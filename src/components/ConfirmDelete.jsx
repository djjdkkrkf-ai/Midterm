import { useEffect } from 'react';

export default function ConfirmDelete({ name, busy, error, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy]);

  return (
    <div className="overlay" onClick={() => !busy && onCancel()}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>ลบ Contact นี้หรือไม่</h2>
        <div className="dialog-name">{name}</div>
        <p>การลบไม่สามารถย้อนกลับได้</p>
        {error && <div className="err">ลบไม่สำเร็จ ({error})</div>}
        <div className="dialog-actions">
          <button className="btn-danger" onClick={onConfirm} disabled={busy} autoFocus>{busy ? 'กำลังลบ...' : 'ลบ'}</button>
          <button className="ghost" onClick={onCancel} disabled={busy}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
}
