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
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ open: false, employee: null, cascade: false });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/employees?pageNumber=${page}&pageSize=${pageSize}`);
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setEmployees(data);
    } catch (err) {
      toast.error('Failed to load employees');
    }
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, [page]);

  const handleDelete = async () => {
    try {
      const url = `/employees/${deleteModal.employee._id}${deleteModal.cascade ? '?cascade=true' : ''}`;
      await api.delete(url);
      toast.success('Employee deleted');
      setDeleteModal({ open: false, employee: null, cascade: false });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = employees.filter(emp => {
    if (!search) return true;
    const name = `${emp.name?.fname || ''} ${emp.name?.lname || ''}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (emp.ssn || '').includes(search);
  });

  return (
    <Layout title="Employees">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Search by name or SSN..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '42px', width: '100%' }}
          />
        </div>
        {isAdmin() && (
          <Button icon={<Plus size={18} />} onClick={() => navigate('/employees/new')}>
            Add Employee
          </Button>
        )}
      </div>

      {loading ? <Loader size="lg" /> : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SSN</th>
                  <th>Sex</th>
                  <th>Salary</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No employees found</td></tr>
                ) : (
                  filtered.map(emp => (
                    <tr key={emp._id}>
                      <td style={{ fontWeight: 600 }}>{emp.name?.fname} {emp.name?.minit ? emp.name.minit + '.' : ''} {emp.name?.lname}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{emp.ssn}</td>
                      <td><Badge type={emp.sex}>{emp.sex || '—'}</Badge></td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>${emp.salary?.toLocaleString() || '0'}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.address || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <Button variant="secondary" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/employees/${emp._id}`)}>View</Button>
                          {isAdmin() && (
                            <>
                              <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/employees/${emp._id}/edit`)}>Edit</Button>
                              <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteModal({ open: true, employee: emp, cascade: false })}>Delete</Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <Button variant="secondary" size="sm" icon={<ChevronLeft size={16} />} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Page {page}</span>
            <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={filtered.length < pageSize}>Next <ChevronRight size={16} /></Button>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, employee: null, cascade: false })} title="Delete Employee" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteModal({ open: false, employee: null, cascade: false })}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}
      >
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleteModal.employee?.name?.fname} {deleteModal.employee?.name?.lname}</strong>?
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={deleteModal.cascade} onChange={e => setDeleteModal(prev => ({ ...prev, cascade: e.target.checked }))}
            style={{ width: 'auto', accentColor: 'var(--accent-primary)' }} />
          Also delete dependents & assignments (cascade)
        </label>
      </Modal>
    </Layout>
  );
};

export default EmployeesPage;
