import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, Eye, MapPin } from 'lucide-react';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, dept: null });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments?pageSize=1000');
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setDepartments(data);
    } catch (err) {
      toast.error('Failed to load departments');
    }
    setLoading(false);
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/departments/${deleteModal.dept._id}`);
      toast.success('Department deleted');
      setDeleteModal({ open: false, dept: null });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = departments.filter(d => {
    if (!search) return true;
    return d.name?.toLowerCase().includes(search.toLowerCase()) || String(d.number).includes(search);
  });

  return (
    <Layout title="Departments">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
        </div>
        {isAdmin() && (
          <Button icon={<Plus size={18} />} onClick={() => navigate('/departments/new')}>Add Department</Button>
        )}
      </div>

      {loading ? <Loader size="lg" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>No departments found</p>
          ) : (
            filtered.map(dept => (
              <div key={dept._id} className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/departments/${dept._id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{dept.name}</h3>
                    <Badge type="default">#{dept.number}</Badge>
                  </div>
                  {isAdmin() && (
                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/departments/${dept._id}/edit`)} />
                      <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteModal({ open: true, dept })} />
                    </div>
                  )}
                </div>
                {dept.locations && dept.locations.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {dept.locations.map((loc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--bg-glass-hover)', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={12} /> {loc}
                      </div>
                    ))}
                  </div>
                )}
                {dept.mgrSsn && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>Manager SSN: {dept.mgrSsn}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, dept: null })} title="Delete Department" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteModal({ open: false, dept: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleteModal.dept?.name}</strong>? Employees in this department will be unassigned.
        </p>
      </Modal>
    </Layout>
  );
};

export default DepartmentsPage;
