// frontend/src/pages/TeacherHome.jsx
// Teacher landing page — shown immediately after login
// Two paths: Dashboard (analytics) or Form (fill survey)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';
import { motion } from 'framer-motion';
import {
  BarChart3, ClipboardList, ChevronRight, LogOut,
  GraduationCap, BookOpen, TrendingUp, Users, FileText,
} from 'lucide-react';

export default function TeacherHome() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setChecking(false);
      return;
    }
    fetch(apiUrl('/teacher/dashboard/'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.has_survey === false) {
          // First time — mandatory redirect
          navigate('/teacher/form', { state: { mandatory: true } });
        }
      })
      .catch(console.error)
      .finally(() => setChecking(false));
  }, [navigate]);

  const firstName = user?.name?.split('_')[0] || user?.name || 'Teacher';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: '#64748b', fontSize: 15, fontWeight: 600 }}>Loading dashboard…</div>
      </div>
    );
  }


  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div style={{ background: '#1e3a8a', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64, boxShadow: '0 2px 12px rgba(30,58,138,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GraduationCap size={24} color="#93c5fd" />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 17 }}>SEPiCP</span>
          <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600, marginLeft: 8 }}>
            Teacher Portal
          </span>
        </div>
        <button onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', borderRadius: 10, padding: '8px 16px',
            cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px' }}>

        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 52 }}>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
            Welcome back,
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            {displayName} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, marginTop: 8 }}>
            What would you like to do today?
          </p>
        </motion.div>

        {/* ── Two main option cards ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>

          {/* DASHBOARD card */}
          <motion.button
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/teacher/dashboard')}
            style={{
              background: '#fff', border: '2px solid #e2e8f0',
              borderRadius: 24, padding: '36px 32px', cursor: 'pointer',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0,
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1e3a8a'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(30,58,138,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
          >
            {/* Icon */}
            <div style={{ width: 60, height: 60, borderRadius: 18, background: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <BarChart3 size={30} color="#1e3a8a" />
            </div>

            <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 10 }}>
              Dashboard
            </div>
            <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
              View analytics, compare instructor and student survey results, and track course evaluations.
            </div>

            {/* Feature list */}
            {['Survey results & analytics', 'Student response overview', 'Course comparison charts'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: '#1e3a8a', flexShrink: 0 }} />
                <span style={{ color: '#475569', fontSize: 13 }}>{f}</span>
              </div>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex',
              alignItems: 'center', gap: 6, color: '#1e3a8a', fontWeight: 800, fontSize: 14 }}>
              Go to Dashboard <ChevronRight size={18} />
            </div>
          </motion.button>

          {/* FORM card */}
          <motion.button
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/teacher/form')}
            style={{
              background: '#1e3a8a', border: '2px solid #1e3a8a',
              borderRadius: 24, padding: '36px 32px', cursor: 'pointer',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0,
              boxShadow: '0 4px 24px rgba(30,58,138,0.25)',
              transition: 'box-shadow 0.2s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(30,58,138,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(30,58,138,0.25)'; }}
          >
            {/* Decorative circle */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140,
              borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

            {/* Icon */}
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <ClipboardList size={30} color="#fff" />
            </div>

            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10 }}>
              Form
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 24 }}>
              Register a course for evaluation. Fill the instructor survey and choose how to proceed.
            </div>

            {/* Feature list */}
            {['Fill the instructor survey', 'Publish for students (get code)', 'Or fill yourself & publish for analysis'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: '#93c5fd', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{f}</span>
              </div>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex',
              alignItems: 'center', gap: 6, color: '#93c5fd', fontWeight: 800, fontSize: 14 }}>
              Open Form <ChevronRight size={18} />
            </div>
          </motion.button>
        </div>

        {/* ── Info strip ─────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: '20px 28px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { icon: FileText,   label: 'Instructor Form', value: '75 fields' },
            { icon: Users,      label: 'Student Form',    value: '84 fields' },
            { icon: TrendingUp, label: 'Analytics',       value: 'Built-in' },
            { icon: BookOpen,   label: 'Access',          value: 'Teacher only' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon size={18} color="#1e3a8a" />
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 1 }}>
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{value}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
