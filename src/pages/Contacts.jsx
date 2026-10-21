import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Icon from '../components/Icon.jsx';
import ConfirmDelete from '../components/ConfirmDelete.jsx';

const hue = (name) => [...name].reduce((h, ch) => h + ch.charCodeAt(0) * 37, 0) % 360;

export default function Contacts({ token, onLogout }) {
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();
  const load = () => {
    setLoadError('');
    api('/contacts?limit=100', { token })
      .then((d) => setItems(d.items))
      .catch((e) => (e.status === 401 ? onLogout() : setLoadError(e.message)));
  };
  useEffect(() => { load(); }, []);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const closeDelete = () => { setToDelete(null); setDeleteError(''); };

  async function confirmDelete() {
    setDeleting(true); setDeleteError('');
    try {
      await api(`/contacts/${toDelete.id}`, { token, method: 'DELETE' });
      closeDelete();
      load();
    } catch (e) {
      setDeleteError(e.message);
    } finally { setDeleting(false); }
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-icon"><Icon name="contact" size={26} /></div>
        <div><h1>Contact</h1><p className="sub">สร้าง แก้ไข และลบ Contact ของคุณ</p></div>
        <Link to="/contacts/new" className="btn"><Icon name="plus" /> สร้าง Contact</Link>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th /></tr></thead>
          <tbody>
            {loadError && (
              <tr><td colSpan="5" className="empty">
                <div className="err">โหลดรายการไม่สำเร็จ ({loadError})</div>
                <button className="btn ghost retry" onClick={() => { setItems(null); load(); }}>ลองอีกครั้ง</button>
              </td></tr>
            )}
            {items === null && !loadError && <tr><td colSpan="5" className="empty">กำลังโหลด...</td></tr>}
            {items?.length === 0 && <tr><td colSpan="5" className="empty">ยังไม่มี Contact</td></tr>}
            {items?.map((c) => (
              <tr key={c.id}>
                <td><span className="avatar" style={{ '--h': hue(c.firstName) }}>{c.firstName[0].toUpperCase()}</span><b>{c.firstName} {c.lastName}</b></td>
                <td>{c.email ?? '-'}</td>
                <td>{c.phone ?? '-'}</td>
                <td>{c.company ?? '-'}</td>
                <td className="actions">
                  <button className="icon-btn" title="แก้ไข" onClick={() => navigate(`/contacts/${c.id}/edit`)}><Icon name="edit" /></button>
                  <button className="icon-btn danger" title="ลบ" onClick={() => setToDelete(c)}><Icon name="trash" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toDelete && (
        <ConfirmDelete
          name={`${toDelete.firstName} ${toDelete.lastName ?? ''}`}
          busy={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={closeDelete}
        />
      )}
    </main>
  );
}
