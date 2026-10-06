'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle, ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, BookOpen,
  ChevronDown, Flower2, Landmark, Loader2, MessageCircle, Plus, Shirt, Sparkles,
} from 'lucide-react';
import { sendAssistantChat } from '@/services/assistantApi';
import { safeSourceUrl } from '@/lib/cultural';
import type { CulturalSource } from '@/types';
import './assistant.css';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  sources?: CulturalSource[];
  suggestedActions?: string[];
}

const topics = [
  { icon: Landmark, title: 'Câu chuyện y phục', hint: 'Nguồn gốc & dấu ấn lịch sử', question: 'Áo Nhật Bình có nguồn gốc và ý nghĩa như thế nào?' },
  { icon: Flower2, title: 'Hoa văn & biểu tượng', hint: 'Ý nghĩa sau từng chi tiết', question: 'Hoa văn trên áo Nhật Bình có ý nghĩa gì?' },
  { icon: Shirt, title: 'Cảm hứng phối đồ', hint: 'Trang phục cho từng dịp', question: 'Gợi ý phối áo ngũ thân để mặc đi chơi Tết.' },
];

const starters = [
  { tag: 'LỊCH SỬ', question: 'Áo Nhật Bình có gì đặc biệt?', icon: Landmark },
  { tag: 'PHÂN BIỆT', question: 'Áo tấc và áo ngũ thân khác nhau thế nào?', icon: BookOpen },
  { tag: 'PHỐI ĐỒ', question: 'Nên phối phụ kiện gì cùng áo dài?', icon: Shirt },
  { tag: 'VĂN HÓA', question: 'Mặc Việt phục đi lễ hội cần lưu ý gì?', icon: Flower2 },
];

function Sources({ sources }: { sources: CulturalSource[] }) {
  if (!sources.length) return null;
  return (
    <details className="assistant-sources">
      <summary><BookOpen size={14} aria-hidden="true" /><span>Tư liệu tham khảo</span><span className="assistant-source-count">{sources.length}</span><ChevronDown size={14} aria-hidden="true" /></summary>
      <ol>
        {sources.map((source, index) => {
          const href = safeSourceUrl(source.url);
          const content = <><span className="assistant-source-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{source.title}</strong>{source.publisher && <small>{source.publisher}</small>}</span>{href && <ArrowUpRight size={15} aria-hidden="true" />}</>;
          return <li key={index}>{href
            ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${source.title} (mở trong thẻ mới)`}>{content}</a>
            : <div>{content}</div>}</li>;
        })}
      </ol>
    </details>
  );
}

function AnswerText({ text }: { text: string }) {
  // Keep generated content as text, with basic emphasis and paragraph breaks.
  return <div className="assistant-answer-text">{text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => (
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
        : part
    ))}</p>
  ))}</div>;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const followLatestRef = useRef(true);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    const area = inputRef.current;
    if (area) {
      area.style.height = 'auto';
      area.style.height = `${Math.min(area.scrollHeight, 132)}px`;
    }
  }, [inputMsg]);

  useEffect(() => {
    const panel = scrollRef.current;
    if (panel && followLatestRef.current) panel.scrollTop = panel.scrollHeight;
  }, [messages, loading, errorMsg]);

  const sendMessageText = async (text: string) => {
    const message = text.trim();
    if (!message || message.length > 2000 || requestRef.current) return;

    const controller = new AbortController();
    requestRef.current = controller;
    const history = messages.slice(-8).map(entry => ({ role: entry.sender, content: entry.text }));
    followLatestRef.current = true;
    setShowScrollButton(false);
    setMessages(previous => [...previous, { sender: 'user', text: message }]);
    setInputMsg('');
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await sendAssistantChat({ message, conversationId, history }, controller.signal);
      if (controller.signal.aborted) return;
      if (!response.success || !response.data) {
        throw new Error('Chưa kết nối được với trợ lý. Câu hỏi vẫn ở ô nhập, bạn có thể gửi lại.');
      }
      setConversationId(response.data.conversationId);
      setMessages(previous => [...previous, {
        sender: 'assistant',
        text: response.data!.answer,
        sources: response.data!.sources,
        suggestedActions: response.data!.suggestedActions,
      }]);
    } catch {
      if (controller.signal.aborted) return;
      setErrorMsg('Chưa nhận được câu trả lời. Câu hỏi vẫn ở ô nhập, bạn có thể gửi lại.');
      setMessages(previous => previous.slice(0, -1));
      setInputMsg(message);
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  };

  const startNewConversation = () => {
    if (requestRef.current) return;
    setMessages([]);
    setConversationId(undefined);
    setInputMsg('');
    setErrorMsg(null);
    setShowScrollButton(false);
    followLatestRef.current = true;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    inputRef.current?.focus();
  };

  const scrollToLatest = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    followLatestRef.current = true;
    setShowScrollButton(false);
  };

  return (
    <div className="assistant-page">
      <header className="assistant-page-heading">
        <div>
          <p className="assistant-eyebrow"><span />KẾT NỐI CÙNG DI SẢN</p>
          <h1>Trợ lý <em>Việt Phục</em><span className="assistant-ai-tag">AI</span></h1>
        </div>
        <p>Một người bạn đồng hành trên hành trình<br className="assistant-desktop-break" /> tìm hiểu và sáng tạo cùng Việt phục.</p>
      </header>

      <div className="assistant-workspace">
        <aside className="assistant-sidebar" aria-label="Khám phá cùng trợ lý">
          <div className="assistant-sidebar-intro">
            <span className="assistant-sidebar-mark"><Flower2 size={27} strokeWidth={1.3} aria-hidden="true" /></span>
            <h2>Mỗi nếp áo,<br />một câu chuyện.</h2>
            <p>Cùng tìm hiểu những điều làm nên vẻ đẹp của Việt phục.</p>
          </div>
          <div className="assistant-topic-list">
            <p className="assistant-section-label">BẮT ĐẦU TỪ MỘT CHỦ ĐỀ</p>
            {topics.map(({ icon: Icon, title, hint, question }) => (
              <button key={title} type="button" onClick={() => sendMessageText(question)} disabled={loading} className="assistant-topic">
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" /><span><strong>{title}</strong><small>{hint}</small></span><ArrowUpRight size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="assistant-explore-links">
            <p className="assistant-section-label">TIẾP NỐI CẢM HỨNG</p>
            <Link href="/cultural"><Landmark size={16} aria-hidden="true" /><span>Ghé bảo tàng Việt phục</span><ArrowUpRight size={15} aria-hidden="true" /></Link>
            <Link href="/onboarding"><Shirt size={16} aria-hidden="true" /><span>Tạo bộ phối của bạn</span><ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
          <p className="assistant-sidebar-note"><MessageCircle size={16} aria-hidden="true" /><span>Bạn có thể hỏi tiếp để cùng khám phá sâu hơn một chủ đề.</span></p>
        </aside>

        <section className="assistant-chat" aria-label="Hội thoại với trợ lý Việt Phục">
          <div className="assistant-chat-toolbar">
            <div className="assistant-chat-identity"><span><Sparkles size={16} aria-hidden="true" /></span><div><strong>Trò chuyện cùng di sản</strong><small>Lịch sử · Văn hóa · Phối đồ</small></div></div>
            <button type="button" onClick={startNewConversation} disabled={loading || (!messages.length && !inputMsg && !errorMsg)} className="assistant-new-chat" aria-label="Bắt đầu cuộc trò chuyện mới" title="Bắt đầu cuộc trò chuyện mới"><Plus size={16} aria-hidden="true" /><span>Trò chuyện mới</span></button>
          </div>

          <div className="assistant-conversation-area">
            <div className="assistant-conversation" ref={scrollRef} tabIndex={0} role="region" aria-label="Nội dung cuộc trò chuyện" onScroll={() => {
              const panel = scrollRef.current;
              if (!panel) return;
              const nearBottom = panel.scrollHeight - panel.scrollTop - panel.clientHeight < 80;
              followLatestRef.current = nearBottom;
              setShowScrollButton(!nearBottom && messages.length > 0);
            }}>
              {!messages.length ? (
                <div className="assistant-welcome">
                  <div className="assistant-welcome-symbol" aria-hidden="true"><Flower2 size={34} strokeWidth={1.2} /><span /><span /></div>
                  <p className="assistant-welcome-greeting">XIN CHÀO, BẠN MUỐN KHÁM PHÁ ĐIỀU GÌ?</p>
                  <h2>Cùng bạn hiểu thêm<br />về <em>Việt phục.</em></h2>
                  <p className="assistant-welcome-description">Từ câu chuyện của một chiếc áo đến cảm hứng<br className="assistant-desktop-break" /> cho bộ phối tiếp theo. Hãy bắt đầu bằng một câu hỏi.</p>
                  <div className="assistant-starters">
                    {starters.map(({ tag, question, icon: Icon }) => (
                      <button key={tag} type="button" onClick={() => sendMessageText(question)} disabled={loading} className="assistant-starter">
                        <span className="assistant-starter-tag"><Icon size={14} aria-hidden="true" />{tag}</span>
                        <span className="assistant-starter-question">{question}<ArrowUpRight size={15} aria-hidden="true" /></span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="assistant-messages" role="log" aria-label="Tin nhắn" aria-live="polite" aria-relevant="additions">
                  {messages.map((message, index) => (
                    <article key={index} className={`assistant-message assistant-message--${message.sender}`} aria-label={message.sender === 'user' ? 'Bạn' : 'Trợ lý Việt Phục'}>
                      {message.sender === 'assistant' && <div className="assistant-message-author"><Flower2 size={17} strokeWidth={1.5} aria-hidden="true" /><span>Trợ lý Việt Phục</span></div>}
                      {message.sender === 'user' ? <p className="assistant-user-text">{message.text}</p> : <AnswerText text={message.text} />}
                      {message.sender === 'assistant' && <>
                        <Sources sources={message.sources ?? []} />
                        {index === messages.length - 1 && !!message.suggestedActions?.length && (
                          <div className="assistant-followups">
                            <p>CÙNG TÌM HIỂU THÊM</p>
                            {message.suggestedActions.map((action, actionIndex) => (
                              <button key={actionIndex} type="button" onClick={() => sendMessageText(action)} disabled={loading}><span>{action}</span><ArrowRight size={14} aria-hidden="true" /></button>
                            ))}
                          </div>
                        )}
                      </>}
                    </article>
                  ))}
                </div>
              )}
              {loading && <div className="assistant-thinking" role="status"><span><Flower2 size={18} aria-hidden="true" /></span><p>Đang tìm hiểu câu chuyện của bạn<span className="assistant-thinking-dots" aria-hidden="true"><i /><i /><i /></span></p></div>}
            </div>
            {showScrollButton && <button type="button" className="assistant-scroll-latest" onClick={scrollToLatest}><ArrowDown size={14} aria-hidden="true" />Tin nhắn mới nhất</button>}
          </div>

          <div className="assistant-composer-area">
            {errorMsg && <p className="assistant-error" role="alert"><AlertCircle size={16} aria-hidden="true" /><span>{errorMsg}</span></p>}
            <form className="assistant-composer" onSubmit={event => { event.preventDefault(); sendMessageText(inputMsg); }} aria-label="Gửi câu hỏi">
              <label htmlFor="assistant-question" className="sr-only">Câu hỏi của bạn</label>
              <textarea id="assistant-question" ref={inputRef} value={inputMsg} onChange={event => setInputMsg(event.target.value)} onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && window.matchMedia('(pointer: fine)').matches) {
                  event.preventDefault();
                  sendMessageText(inputMsg);
                }
              }} readOnly={loading} maxLength={2000} rows={1} placeholder="Bạn muốn tìm hiểu điều gì về Việt phục?" />
              <button type="submit" disabled={loading || !inputMsg.trim()} aria-label={loading ? 'Đang chờ câu trả lời' : 'Gửi câu hỏi'} title="Gửi câu hỏi">{loading ? <Loader2 size={19} className="animate-spin" aria-hidden="true" /> : <ArrowUp size={21} aria-hidden="true" />}</button>
            </form>
            <div className="assistant-composer-hint"><span className="assistant-keyboard-hint">Enter để gửi · Shift + Enter để xuống dòng</span><span className="assistant-touch-hint">Hỏi bằng lời của bạn, khám phá theo cách của bạn.</span><span>{inputMsg.length ? `${inputMsg.length.toLocaleString('vi-VN')} / 2.000` : 'Cùng khám phá Việt phục'}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
