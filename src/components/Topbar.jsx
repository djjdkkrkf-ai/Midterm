import { useState, useEffect } from 'react';

export default function Topbar({ email, onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }, [theme]);
  return (
    <header className="topbar">
      <button className="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? '☀ สว่าง' : '☾ มืด'}
      </button>
      <span className="email">{email}</span>
      <button className="ghost" onClick={onLogout}>⇥ ออกจากระบบ</button>
    </header>
  );
}
