import React, { useEffect, useState } from 'react';
import { Users, BookOpen, BarChart3, TrendingUp, Copy, CheckCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('http://127.0.0.1:8080/api/teacher/dashboard/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: '#64748b', fontSize: 15, fontWeight: 600 }}>Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 32 }}>My Courses Dashboard</h1>

      {data?.courses?.map(course => (
        <div key={course.id} style={{ background: '#fff', borderRadius: 20,
          padding: 28, marginBottom: 20, border: '1px solid #e2e8f0' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a8a', margin: '0 0 8px 0' }}>{course.course_name}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{course.semester}</p>
            </div>
            
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Student Course Code
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <code style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: 2 }}>{course.course_code}</code>
                <button onClick={() => handleCopy(course.course_code)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedCode === course.course_code ? '#16a34a' : '#0ea5e9', display: 'flex', alignItems: 'center' }}>
                  {copiedCode === course.course_code ? <CheckCircle size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
            <Stat icon={Users}    label="Total Responses"     value={course.total_responses} />
            <Stat icon={TrendingUp} label="Published"         value={course.published_responses} />
            <Stat icon={BookOpen}  label="Saved (Draft)"      value={course.saved_responses} />
            <Stat icon={BarChart3} label="Avg Engagement"     value={course.avg_engagement ?? '—'} />
          </div>
        </div>
      ))}

      {data?.courses?.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 40, textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: 16 }}>No student responses yet for your courses.</p>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div style={{ flex: '1 1 200px', background: '#f8fafc', borderRadius: 14,
      padding: '16px 20px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={18} color="#1e3a8a" />
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, marginTop: 12, color: '#0f172a' }}>{value}</div>
    </div>
  );
}
