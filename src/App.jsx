import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { api } from './api';
import Login from './pages/Login.jsx';
import Contacts from './pages/Contacts.jsx';
import ContactForm from './pages/ContactForm.jsx';
import Topbar from './components/Topbar.jsx';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [email, setEmail] = useState(() => localStorage.getItem('email'));
  const login = (t, mail) => { localStorage.setItem('token', t); localStorage.setItem('email', mail); setToken(t); setEmail(mail); };
  const logout = () => { api('/auth/logout', { token, method: 'POST' }).catch(() => {}); localStorage.removeItem('token'); setToken(null); };

  const protectedLayout = token
    ? <div className="app"><Topbar email={email} onLogout={logout} /><Outlet /></div>
    : <Navigate to="/login" />;

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/contacts" /> : <div className="wrap"><Login onLogin={login} /></div>} />
      <Route element={protectedLayout}>
        <Route path="/contacts" element={<Contacts token={token} onLogout={logout} />} />
        <Route path="/contacts/new" element={<ContactForm token={token} />} />
        <Route path="/contacts/:id/edit" element={<ContactForm token={token} />} />
      </Route>
      <Route path="*" element={<Navigate to="/contacts" />} />
    </Routes>
  );
}
