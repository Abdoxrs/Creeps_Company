import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, Users } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, workersRes] = await Promise.allSettled([
          api.get(`/projects/${id}`),
          api.get(`/works-on/project/${id}/employees`),
        ]);
        if (projRes.status === 'fulfilled') setProject(projRes.value.data.data || projRes.value.data);
        if (workersRes.status === 'fulfilled') {
          const d = workersRes.value.data.data || workersRes.value.data;
          setWorkers(Array.isArray(d) ? d : []);
        }
      } catch (err) { toast.error('Failed to load project'); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <Layout title="Project Details"><Loader size="lg" /></Layout>;
  if (!project) return <Layout title="Project Details"><p style={{ color: 'var(--text-muted)' }}>Project not found</p></Layout>;

  return (
    <Layout title="Project Details">
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/projects')} style={{ marginBottom: '24px' }}>Back to Projects</Button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <Card title={project.name}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Project No.</span><Badge type="default">#{project.number}</Badge></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Location</span><span>{project.location || '—'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Department</span><span>{project.controllingDept?.name || '—'}</span></div>
          </div>
        </Card>

        <Card title="Assigned Workers" icon={<Users size={18} />}>
          {workers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No workers assigned</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {workers.map((w, i) => (
                <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{w.employeeId?.name ? `${w.employeeId.name.fname} ${w.employeeId.name.lname}` : 'Unknown'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-secondary)' }}>
                    <Clock size={14} /> {w.hours} hrs
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
