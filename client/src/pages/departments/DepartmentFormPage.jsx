import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';

const DepartmentFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ number: '', name: '', mgrSsn: '', mgrStartDate: '', locations: [] });
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchDept = async () => {
        try {
          const res = await api.get(`/departments/${id}`);
          const dept = res.data.data || res.data;
          setForm({
            number: dept.number || '',
            name: dept.name || '',
            mgrSsn: dept.mgrSsn || '',
            mgrStartDate: dept.mgrStartDate ? dept.mgrStartDate.substring(0, 10) : '',
            locations: dept.locations || [],
          });
        } catch (err) {
          toast.error('Failed to load department');
        }
        setLoading(false);
      };
      fetchDept();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      setForm(prev => ({ ...prev, locations: [...prev.locations, newLocation.trim()] }));
      setNewLocation('');
    }
  };

  const removeLocation = (index) => {
    setForm(prev => ({ ...prev, locations: prev.locations.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      number: Number(form.number),
      name: form.name,
      locations: form.locations,
      mgrSsn: form.mgrSsn || undefined,
      mgrStartDate: form.mgrStartDate || undefined,
    };
    try {
      if (isEdit) {
        await api.patch(`/departments/${id}`, payload);
        toast.success('Department updated');
      } else {
        await api.post('/departments', payload);
        toast.success('Department created');
      }
      navigate('/departments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    }
    setSaving(false);
  };

  if (loading) return <Layout title={isEdit ? 'Edit Department' : 'New Department'}><Loader size="lg" /></Layout>;

  return (
    <Layout title={isEdit ? 'Edit Department' : 'New Department'}>
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/departments')} style={{ marginBottom: '24px' }}>
        Back to Departments
      </Button>

      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label>Department Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Department name" />
            </div>
            <div>
              <label>Department Number *</label>
              <input type="number" name="number" value={form.number} onChange={handleChange} required placeholder="Unique number" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label>Manager SSN</label>
              <input name="mgrSsn" value={form.mgrSsn} onChange={handleChange} placeholder="Manager SSN" />
            </div>
            <div>
              <label>Manager Start Date</label>
              <input type="date" name="mgrStartDate" value={form.mgrStartDate} onChange={handleChange} />
            </div>
          </div>

          {/* Locations */}
          <div style={{ marginBottom: '24px' }}>
            <label>Locations</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Add a location"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }}
              />
              <Button type="button" variant="secondary" icon={<Plus size={16} />} onClick={addLocation}>Add</Button>
            </div>
            {form.locations.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {form.locations.map((loc, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                    background: 'var(--bg-glass-hover)', borderRadius: '100px',
                    fontSize: '0.85rem', color: 'var(--text-primary)', border: '1px solid var(--border)',
                  }}>
                    {loc}
                    <button type="button" onClick={() => removeLocation(i)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      display: 'flex', padding: '2px',
                    }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/departments')}>Cancel</Button>
            <Button type="submit" icon={<Save size={16} />} loading={saving}>
              {isEdit ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default DepartmentFormPage;
