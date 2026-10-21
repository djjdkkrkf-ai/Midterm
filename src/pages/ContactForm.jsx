import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import Icon from '../components/Icon.jsx';

const empty = { firstName: '', lastName: '', email: '', phone: '', address: '', company: '' };

export default function ContactForm({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api(`/contacts/${id}`, { token })
      .then((c) => setForm(Object.fromEntries(Object.keys(empty).map((k) => [k, c[k] ?? '']))))
      .catch((e) => ([400, 404].includes(e.status) ? setNotFound(true) : setError(`โหลดข้อมูลไม่สำเร็จ (${e.message})`)));
  }, [id]);

  if (notFound) {
    return (
      <main className="page narrow">
        <div className="panel empty">
          <h3>ไม่พบข้อมูล Contact</h3>
          <p className="hint">รายการนี้อาจถูกลบไปแล้ว หรือลิงก์ไม่ถูกต้อง</p>
          <Link to="/contacts" className="btn ghost retry"><Icon name="back" /> กลับไปรายการ</Link>
        </div>
      </main>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.firstName.trim()) return setError('กรุณากรอก firstName');
    setSaving(true); setError('');
    const body = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || null]));
    try {
      await api(id ? `/contacts/${id}` : '/contacts', { token, method: id ? 'PATCH' : 'POST', body: JSON.stringify(body) });
      navigate('/contacts');
    } catch (err) {
      setError(`บันทึกไม่สำเร็จ (${err.message})`);
      setSaving(false);
    }
  }

  const field = (k, label, props = {}) => (
    <div>
      <label>{label}</label>
      {props.rows
        ? <textarea rows={props.rows} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        : <input {...props} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}
    </div>
  );

  return (
    <main className="page narrow">
      <div className="page-head">
        <div className="page-icon"><Icon name="contact" size={26} /></div>
        <div>
          <h1>{id ? 'แก้ไข Contact' : 'สร้าง Contact ใหม่'}</h1>
          <p className="sub">{id ? 'แก้ไขข้อมูลของ Contact แล้วบันทึก' : 'กรอกข้อมูลของ Contact ที่ต้องการบันทึก'}</p>
        </div>
      </div>

      <form className="panel form" onSubmit={submit} noValidate>
        <p className="hint">ช่องที่มี * จำเป็นต้องกรอก</p>

        <section>
          <h3>ข้อมูลบุคคล</h3><p className="hint">เริ่มจากชื่อที่ใช้เรียกบุคคลนี้</p>
          <div className="grid">{field('firstName', 'firstName (ชื่อจริง) *')}{field('lastName', 'lastName (นามสกุล)')}</div>
        </section>

        <section>
          <h3>ช่องทางติดต่อ</h3><p className="hint">ใส่ช่องทางที่ใช้ติดต่อ</p>
          <div className="grid">{field('email', 'email (อีเมล)', { type: 'email' })}{field('phone', 'phone (เบอร์โทร)')}</div>
          {field('address', 'address (ที่อยู่)', { rows: 4 })}
        </section>

        <section>
          <h3>การทำงาน</h3><p className="hint">ใส่บริษัทหากต้องการ</p>
          <div className="grid">{field('company', 'company (บริษัท)')}</div>
        </section>

        {error && <div className="err">{error}</div>}
        <div className="form-foot">
          <Link to="/contacts" className="btn ghost"><Icon name="back" /> กลับไปรายการ</Link>
          <button className="btn" disabled={saving}><Icon name="save" /> {id ? 'บันทึกการแก้ไข' : 'สร้าง Contact'}</button>
        </div>
      </form>
    </main>
  );
}
