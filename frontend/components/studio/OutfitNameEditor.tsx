'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Check, PencilLine, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (name: string) => void;
  onEditingChange: (editing: boolean) => void;
  disabled?: boolean;
}

export function OutfitNameEditor({ value, onChange, onEditingChange, disabled = false }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editing) { inputRef.current?.focus(); inputRef.current?.select(); }
  }, [editing]);

  function close() {
    setEditing(false);
    onEditingChange(false);
    setError('');
    requestAnimationFrame(() => editButtonRef.current?.focus());
  }

  function confirm(event: FormEvent) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) { setError('Bạn nhập tên cho bộ phối nhé.'); inputRef.current?.focus(); return; }
    onChange(name);
    close();
  }

  return <div className="min-w-0" data-outfit-name>
    {editing ? <form onSubmit={confirm} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); close(); } }}>
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          aria-label="Tên bộ phối"
          aria-invalid={!!error}
          aria-describedby={error ? 'outfit-name-error' : undefined}
          value={draft}
          maxLength={150}
          onChange={event => { setDraft(event.target.value); setError(''); }}
          onKeyDown={event => { if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault(); }}
          className="min-w-0 flex-1 rounded-lg border border-amber-800/40 bg-white px-2.5 py-1.5 text-sm text-red-950 outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800"
        />
        <button type="submit" aria-label="Xác nhận tên bộ phối" title="Xác nhận" className="shrink-0 rounded-lg bg-red-900 p-2 text-white hover:bg-red-950"><Check size={15} /></button>
        <button type="button" onClick={close} aria-label="Hủy đổi tên" title="Hủy" className="shrink-0 rounded-lg p-2 text-stone-500 hover:bg-stone-100"><X size={15} /></button>
      </div>
      {error && <p id="outfit-name-error" role="alert" className="mt-1 text-[11px] text-red-800">{error}</p>}
    </form> : <div className="flex min-w-0 items-center gap-2">
      <h2 title={value} className="min-w-0 break-words font-serif text-base font-semibold leading-snug text-red-950 sm:text-lg">{value}</h2>
      <button ref={editButtonRef} type="button" disabled={disabled} onClick={() => { setDraft(value); setError(''); setEditing(true); onEditingChange(true); }} aria-label="Đổi tên bộ phối" title="Đổi tên bộ phối" className="shrink-0 rounded-lg p-1.5 text-stone-400 transition hover:bg-amber-50 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800 disabled:opacity-40"><PencilLine size={15} /></button>
    </div>}
  </div>;
}
