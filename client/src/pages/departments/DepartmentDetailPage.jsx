import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, FolderKanban, MapPin, DollarSign } from 'lucide-react';

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, sumRes] = await Promise.allSettled([
          api.get(`/departments/${id}`),
          api.get(`/reports/departments/${id}/summary`),
        ]);
        if (deptRes.status === 'fulfilled') setDepartment(deptRes.value.data.data || deptRes.value.data);
        if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data.data || sumRes.value.data);
      } catch (err) {
        toast.error('Failed to load department');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <Layout title="Department Details"><Loader size="lg" /></Layout>;
  if (!department) return <Layout title="Department Details"><p style={{ color: 'var(--text-muted)' }}>Department not found</p></Layout>;

  return (
    <Layout title="Department Details">
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/departments')} style={{ marginBottom: '24px' }}>
        Back to Departments
      </Button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <Card title={department.name}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Department No.</span>
              <Badge type="default">#{department.number}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Manager SSN</span>
              <span style={{ fontWeight: 500 }}>{department.mgrSsn || 'None'}</span>
            </div>
            {department.mgrStartDate && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Manager Since</span>
                <span>{new Date(department.mgrStartDate).toLocaleDateString()}</span>
              </div>
            )}
            {department.locations?.length > 0 && (
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Locations</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {department.locations.map((loc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--bg-glass-hover)', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                      <MapPin size={12} /> {loc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Summary Stats */}
        {summary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card variant="stat" title="Employees" value={summary.employeeCount || 0} icon={<Users size={22} />} />
            <Card variant="stat" title="Projects" value={summary.projectCount || 0} icon={<FolderKanban size={22} />} />
            <Card variant="stat" title="Avg Salary" value={`$${Math.round(summary.avgSalary || 0).toLocaleString()}`} icon={<DollarSign size={22} />} />
          </div>
        )}

        {summary?.manager && (
          <Card title="Manager" icon={<Users size={18} />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                {(summary.manager.name?.fname?.[0] || '') + (summary.manager.name?.lname?.[0] || '')}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{summary.manager.name?.fname} {summary.manager.name?.lname}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>SSN: {summary.manager.ssn}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DepartmentDetailPage;
