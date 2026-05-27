import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Users, Building2, FolderKanban, ClipboardList, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6c5ce7', '#00cec9', '#a29bfe', '#0984e3', '#fd79a8', '#fdcb6e', '#55efc4', '#ff7675'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employees: 0, departments: 0, projects: 0, assignments: 0 });
  const [deptStats, setDeptStats] = useState([]);
  const [projectHours, setProjectHours] = useState([]);
  const [topSupervisors, setTopSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [empRes, deptRes, projRes, assignRes, deptStatsRes, projHoursRes, topSupRes] = await Promise.allSettled([
          api.get('/employees?pageSize=1'),
          api.get('/departments?pageSize=1'),
          api.get('/projects?pageSize=1'),
          api.get('/works-on?pageSize=1'),
          api.get('/reports/departments/stats'),
          api.get('/reports/projects/hours'),
          api.get('/reports/employees/top-supervisors?limit=5'),
        ]);

        const getLength = (res) => {
          if (res.status !== 'fulfilled') return 0;
          const d = res.value.data;
          if (d.results !== undefined) return d.results;
          if (Array.isArray(d)) return d.length;
          if (d.data && Array.isArray(d.data)) return d.data.length;
          return 0;
        };

        // For counts, we need to fetch all to count. Let's use a separate larger request
        const [allEmp, allDept, allProj, allAssign] = await Promise.allSettled([
          api.get('/employees?pageSize=1000'),
          api.get('/departments?pageSize=1000'),
          api.get('/projects?pageSize=1000'),
          api.get('/works-on?pageSize=1000'),
        ]);

        const getCount = (res) => {
          if (res.status !== 'fulfilled') return 0;
          const d = res.value.data;
          if (Array.isArray(d)) return d.length;
          if (d.data && Array.isArray(d.data)) return d.data.length;
          if (d.results !== undefined) return d.results;
          return 0;
        };

        setStats({
          employees: getCount(allEmp),
          departments: getCount(allDept),
          projects: getCount(allProj),
          assignments: getCount(allAssign),
        });

        if (deptStatsRes.status === 'fulfilled') {
          const d = deptStatsRes.value.data.data || deptStatsRes.value.data;
          setDeptStats(Array.isArray(d) ? d.map(item => ({
            name: item.departmentName || 'Unassigned',
            avgSalary: Math.round(item.avgSalary || 0),
            count: item.employeeCount || 0,
          })) : []);
        }

        if (projHoursRes.status === 'fulfilled') {
          const d = projHoursRes.value.data.data || projHoursRes.value.data;
          setProjectHours(Array.isArray(d) ? d.map(item => ({
            name: item.projectName || 'Unknown',
            hours: item.totalHours || 0,
            employees: item.employeeCount || 0,
          })) : []);
        }

        if (topSupRes.status === 'fulfilled') {
          const d = topSupRes.value.data.data || topSupRes.value.data;
          setTopSupervisors(Array.isArray(d) ? d : []);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const chartTooltipStyle = {
    backgroundColor: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#f0f0f5',
    fontSize: '0.85rem',
  };

  if (loading) return <Layout title="Dashboard"><Loader size="lg" /></Layout>;

  return (
    <Layout title="Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--accent-gradient-glow)',
        border: '1px solid rgba(108, 92, 231, 0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>
            Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'User'}</span> 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Here's what's happening in your company today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <Card variant="stat" title="Total Employees" value={stats.employees} icon={<Users size={22} />} />
        <Card variant="stat" title="Departments" value={stats.departments} icon={<Building2 size={22} />} />
        <Card variant="stat" title="Projects" value={stats.projects} icon={<FolderKanban size={22} />} />
        <Card variant="stat" title="Assignments" value={stats.assignments} icon={<ClipboardList size={22} />} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Department Avg Salary */}
        <Card title="Average Salary by Department" icon={<TrendingUp size={18} />}>
          {deptStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#9494b0', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <YAxis tick={{ fill: '#9494b0', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(108, 92, 231, 0.08)' }} />
                <Bar dataKey="avgSalary" fill="#6c5ce7" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No department data available</p>
          )}
        </Card>

        {/* Project Hours Distribution */}
        <Card title="Project Hours Distribution" icon={<FolderKanban size={18} />}>
          {projectHours.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={projectHours}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="hours"
                  nameKey="name"
                >
                  {projectHours.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No project hours data</p>
          )}
          {projectHours.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px', justifyContent: 'center' }}>
              {projectHours.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Top Supervisors */}
      <Card title="Top Supervisors" icon={<Award size={18} />}>
        {topSupervisors.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topSupervisors.map((sup, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: `${COLORS[i % COLORS.length]}22`, color: COLORS[i % COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700,
                  }}>
                    #{i + 1}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {sup.name ? `${sup.name.fname} ${sup.name.lname}` : 'Unknown'}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>SSN: {sup.ssn}</p>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(108, 92, 231, 0.15)', color: '#a29bfe',
                  padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                }}>
                  {sup.subordinateCount} subordinates
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No supervisor data available</p>
        )}
      </Card>
    </Layout>
  );
};

export default DashboardPage;
