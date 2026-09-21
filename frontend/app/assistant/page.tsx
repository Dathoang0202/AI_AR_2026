'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendAssistantChat } from '@/services/assistantApi';
import { CulturalSource } from '@/types';
import { MessageSquare, Send, Bot, Sparkles, User, ExternalLink, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  sources?: CulturalSource[];
  suggestedActions?: string[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý AI Di sản Việt Phục. Tôi có thể hỗ trợ bạn tìm hiểu về nguồn gốc lịch sử, quy chuẩn phối đồ Áo Nhật Bình, Áo Giao Lĩnh, Áo Tấc hay giải thích ý nghĩa các hoa văn nghi lễ. Bạn muốn tìm hiểu điều gì?',
      suggestedActions: [
        'Hỏi về Áo Nhật Bình triều Nguyễn',
        'Áo Giao Lĩnh thời Lý - Trần',
        'Khuyên phối đồ mặc đi Tết',
      ],
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInputMsg('');
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await sendAssistantChat({
        message: textToSend,
        conversationId,
      });

      if (res.success && res.data) {
        setConversationId(res.data.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: res.data!.answer,
            sources: res.data!.sources,
            suggestedActions: res.data!.suggestedActions,
          },
        ]);
      } else {
        setErrorMsg(res.error?.message || 'Không thể lấy câu trả lời từ AI Assistant.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ REST API');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageText(inputMsg);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-white p-6 rounded-2xl shadow-md border border-amber-500/30 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SLICE 5 — Trợ Lý AI Văn Hóa Việt Phục</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">Hỏi Đáp Tri Thức Di Sản & Phối Đồ</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Chat Box */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.sender === 'user' ? 'bg-red-800 text-amber-200' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-2 max-w-[85%]`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-red-800 text-white rounded-tr-none'
                      : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Sources & Citations list */}
                {m.sources && m.sources.length > 0 && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] space-y-1">
                    <p className="font-bold text-amber-950 uppercase text-[10px]">Trích dẫn sử liệu xác thực:</p>
                    {m.sources.map((src, sIdx) => (
                      <div key={sIdx} className="flex justify-between items-center text-stone-700">
                        <span>• {src.title} ({src.publisher})</span>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-800 hover:underline font-semibold ml-2 inline-flex items-center space-x-0.5"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => sendMessageText(action)}
                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-[11px] font-semibold transition-all flex items-center space-x-1"
                      >
                        <span>{action}</span>
                        <ArrowRight className="w-3 h-3 text-amber-700" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-stone-400 italic">
              <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              <span>Trợ lý AI đang truy vấn CSDL di sản & tạo phản hồi xác thực...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="p-4 bg-stone-50 border-t border-amber-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Đặt câu hỏi về Áo Nhật Bình, Áo Giao Lĩnh, quy chuẩn nghi lễ..."
            className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputMsg.trim()}
            className="px-4 py-2.5 bg-red-800 hover:bg-red-900 text-amber-200 rounded-xl shadow font-bold text-xs transition-all flex items-center space-x-1 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Gửi</span>
          </button>
        </form>
      </div>
    </div>
  );
}
