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

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, project: null });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects?pageSize=1000');
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setProjects(data);
    } catch (err) { toast.error('Failed to load projects'); }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteModal.project._id}`);
      toast.success('Project deleted');
      setDeleteModal({ open: false, project: null });
      fetchProjects();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const filtered = projects.filter(p => {
    if (!search) return true;
    return p.name?.toLowerCase().includes(search.toLowerCase()) || String(p.number).includes(search);
  });

  return (
    <Layout title="Projects">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
        </div>
        {isAdmin() && <Button icon={<Plus size={18} />} onClick={() => navigate('/projects/new')}>Add Project</Button>}
      </div>

      {loading ? <Loader size="lg" /> : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Department</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No projects found</td></tr>
                ) : (
                  filtered.map(proj => (
                    <tr key={proj._id}>
                      <td><Badge type="default">#{proj.number}</Badge></td>
                      <td style={{ fontWeight: 600 }}>{proj.name}</td>
                      <td>
                        {proj.location ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <MapPin size={14} /> {proj.location}
                          </div>
                        ) : '—'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {proj.controllingDept?.name || proj.controllingDept || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <Button variant="secondary" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/projects/${proj._id}`)}>View</Button>
                          {isAdmin() && (
                            <>
                              <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/projects/${proj._id}/edit`)} />
                              <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteModal({ open: true, project: proj })} />
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
        </Card>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, project: null })} title="Delete Project" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteModal({ open: false, project: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleteModal.project?.name}</strong>?
        </p>
      </Modal>
    </Layout>
  );
};

export default ProjectsPage;
