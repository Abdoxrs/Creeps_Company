import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Briefcase } from 'lucide-react';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, projRes, depRes] = await Promise.allSettled([
          api.get(`/employees/${id}`),
          api.get(`/works-on/employee/${id}/projects`),
          api.get('/dependents?pageSize=1000'),
        ]);
        if (empRes.status === 'fulfilled') setEmployee(empRes.value.data.data || empRes.value.data);
        if (projRes.status === 'fulfilled') {
          const d = projRes.value.data.data || projRes.value.data;
          setProjects(Array.isArray(d) ? d : []);
        }
        if (depRes.status === 'fulfilled') {
          const d = depRes.value.data.data || depRes.value.data;
          const arr = Array.isArray(d) ? d : [];
          setDependents(arr.filter(dep => dep.employeeId === id));
        }
      } catch (err) {
        toast.error('Failed to load employee');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <Layout title="Employee Details"><Loader size="lg" /></Layout>;
  if (!employee) return <Layout title="Employee Details"><p style={{ color: 'var(--text-muted)' }}>Employee not found</p></Layout>;

  const fullName = `${employee.name?.fname || ''} ${employee.name?.minit ? employee.name.minit + '.' : ''} ${employee.name?.lname || ''}`;

  return (
    <Layout title="Employee Details">
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/employees')} style={{ marginBottom: '24px' }}>
        Back to Employees
      </Button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Profile Card */}
        <Card title="Employee Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 700, color: '#fff',
              }}>
                {(employee.name?.fname?.[0] || '') + (employee.name?.lname?.[0] || '')}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{fullName}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>SSN: {employee.ssn}</p>
              </div>
            </div>

            <InfoRow icon={<Badge type={employee.sex}>{employee.sex || '—'}</Badge>} label="Sex" />
            <InfoRow icon={<DollarSign size={16} />} label="Salary" value={`$${employee.salary?.toLocaleString() || '0'}`} valueColor="var(--success)" />
            <InfoRow icon={<MapPin size={16} />} label="Address" value={employee.address || 'Not specified'} />
            <InfoRow icon={<Calendar size={16} />} label="Birth Date" value={employee.bdate ? new Date(employee.bdate).toLocaleDateString() : 'Not specified'} />
            <InfoRow icon={<Users size={16} />} label="Supervisor SSN" value={employee.superSsn || 'None'} />
          </div>
        </Card>

        {/* Projects */}
        <Card title="Assigned Projects" icon={<Briefcase size={18} />}>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No project assignments</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projects.map((p, i) => (
                <div key={i} style={{
                  padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: 500 }}>{p.projectId?.name || p.name || 'Unknown Project'}</span>
                  <Badge type="default">{p.hours || 0} hrs</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Dependents */}
        <Card title="Dependents" icon={<Users size={18} />}>
          {dependents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No dependents</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dependents.map((dep, i) => (
                <div key={i} style={{
                  padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{dep.name}</span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dep.relationship || '—'}</p>
                  </div>
                  <Badge type={dep.sex}>{dep.sex}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

const InfoRow = ({ icon, label, value, valueColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
      {icon}
      <span>{label}</span>
    </div>
    {value && <span style={{ fontWeight: 500, color: valueColor || 'var(--text-primary)', fontSize: '0.9rem' }}>{value}</span>}
  </div>
);

export default EmployeeDetailPage;
