import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErr, setFieldErr] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    if (!form.password) errs.password = 'กรุณากรอกรหัสผ่าน';
    setFieldErr(errs); setError('');
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) });
      onLogin(data.accessToken, data.user.email);
      navigate('/contacts');
    } catch (err) {
      if (err.status === 401) setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      else setError(`เข้าสู่ระบบไม่สำเร็จ (${err.message})`);
    } finally { setLoading(false); }
  }

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setFieldErr({ ...fieldErr, [k]: '' }); };
  return (
    <div className="login">
      <aside className="hero">
        <h1>ยินดีต้อนรับ 👋</h1>
        <p>ใช้บัญชีประจำห้องเรียนเพื่อเข้าใช้งาน</p>
        <div className="note">
          <b>บัญชีประจำห้องเรียน</b>
          <p>เข้าสู่ระบบด้วย <code>student1@mail.com</code> ถึง <code>student60@mail.com</code> โดยใช้รหัสผ่านร่วมกันคือ <code>1234567891011</code></p>
        </div>
      </aside>
      <form onSubmit={submit} noValidate>
        <h1>เข้าสู่ระบบ</h1>
        <label>อีเมล</label>
        <input type="email" className={fieldErr.email ? 'invalid' : ''} placeholder="student1@mail.com" value={form.email} onChange={set('email')} />
        {fieldErr.email && <div className="err">{fieldErr.email}</div>}
        <label>รหัสผ่าน</label>
        <input type="password" className={fieldErr.password ? 'invalid' : ''} placeholder="••••••••" value={form.password} onChange={set('password')} />
        {fieldErr.password && <div className="err">{fieldErr.password}</div>}
        {error && <div className="err">{error}</div>}
        <button className="full" disabled={loading}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</button>
      </form>
    </div>
  );
}
