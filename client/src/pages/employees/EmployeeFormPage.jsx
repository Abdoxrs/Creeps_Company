import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    ssn: '', fname: '', minit: '', lname: '',
    bdate: '', address: '', sex: 'Male', salary: '',
    deptNo: '', superSsn: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await api.get('/departments?pageSize=1000');
        const d = Array.isArray(deptRes.data) ? deptRes.data : (deptRes.data.data || []);
        setDepartments(d);

        if (isEdit) {
          const empRes = await api.get(`/employees/${id}`);
          const emp = empRes.data.data || empRes.data;
          setForm({
            ssn: emp.ssn || '',
            fname: emp.name?.fname || '',
            minit: emp.name?.minit || '',
            lname: emp.name?.lname || '',
            bdate: emp.bdate ? emp.bdate.substring(0, 10) : '',
            address: emp.address || '',
            sex: emp.sex || 'Male',
            salary: emp.salary || '',
            deptNo: emp.deptNo?._id || emp.deptNo || '',
            superSsn: emp.superSsn || '',
          });
        }
      } catch (err) {
        toast.error('Failed to load data');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ssn: form.ssn,
      name: { fname: form.fname, minit: form.minit || null, lname: form.lname },
      bdate: form.bdate || undefined,
      address: form.address || undefined,
      sex: form.sex,
      salary: Number(form.salary),
      deptNo: form.deptNo || undefined,
      superSsn: form.superSsn || undefined,
    };

    try {
      if (isEdit) {
        await api.patch(`/employees/${id}`, payload);
        toast.success('Employee updated');
      } else {
        await api.post('/employees', payload);
        toast.success('Employee created');
      }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee');
    }
    setSaving(false);
  };

  if (loading) return <Layout title={isEdit ? 'Edit Employee' : 'New Employee'}><Loader size="lg" /></Layout>;

  return (
    <Layout title={isEdit ? 'Edit Employee' : 'New Employee'}>
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/employees')} style={{ marginBottom: '24px' }}>
        Back to Employees
      </Button>

      <Card style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label>First Name *</label>
              <input name="fname" value={form.fname} onChange={handleChange} required placeholder="First name" />
            </div>
            <div>
              <label>M.I.</label>
              <input name="minit" value={form.minit} onChange={handleChange} maxLength={1} placeholder="M" />
            </div>
            <div>
              <label>Last Name *</label>
              <input name="lname" value={form.lname} onChange={handleChange} required placeholder="Last name" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label>SSN *</label>
              <input name="ssn" value={form.ssn} onChange={handleChange} required placeholder="Social Security Number" disabled={isEdit} />
            </div>
            <div>
              <label>Sex</label>
              <select name="sex" value={form.sex} onChange={handleChange} style={{ padding: '12px 16px' }}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label>Salary *</label>
              <input type="number" name="salary" value={form.salary} onChange={handleChange} required min="0" placeholder="0" />
            </div>
            <div>
              <label>Birth Date</label>
              <input type="date" name="bdate" value={form.bdate} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Full address" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label>Department</label>
              <select name="deptNo" value={form.deptNo} onChange={handleChange} style={{ padding: '12px 16px' }}>
                <option value="">— None —</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name} (#{dept.number})</option>
                ))}
              </select>
            </div>
            <div>
              <label>Supervisor SSN</label>
              <input name="superSsn" value={form.superSsn} onChange={handleChange} placeholder="Supervisor SSN" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/employees')}>Cancel</Button>
            <Button type="submit" icon={<Save size={16} />} loading={saving}>
              {isEdit ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default EmployeeFormPage;
