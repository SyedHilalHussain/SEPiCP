// frontend/src/pages/StudentSurveyPage.jsx
import React, { useState } from 'react';
import { STUDENT_FIELDS, STUDENT_SECTIONS } from '../config/STUDENT_FIELDS';
import { lookupCourseCode, submitStudentSurvey, loadStudentSurvey, updateStudentSurvey } from '../api/surveyApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, AlertTriangle, GraduationCap,
  ChevronRight, ArrowLeft, Copy, XCircle,
} from 'lucide-react';

// ── Validation ────────────────────────────────────────────────────────────────
function validateForm(fields, formData) {
  const errors = {};
  fields.forEach(field => {
    const val = (formData[field.name] ?? '').toString().trim();

    if (field.required && val === '') {
      errors[field.name] = 'This field is required';
      return;
    }

    if (val === '') return;

    if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errors[field.name] = 'Enter a valid email address';
      }
      return;
    }

    if (['number', 'percentage', 'rating10', 'rating13'].includes(field.type)) {
      const num = parseFloat(val);
      if (isNaN(num)) {
        errors[field.name] = 'Must be a number';
      } else if (field.min !== undefined && num < field.min) {
        errors[field.name] = `Min value is ${field.min}`;
      } else if (field.max !== undefined && num > field.max) {
        errors[field.name] = `Max value is ${field.max}`;
      }
    }
  });
  return errors;
}

// ── Field renderer with error state ──────────────────────────────────────────
function FieldInput({ field, value, onChange, hasError, onFix }) {
  const baseStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
    border: hasError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
    background: hasError ? '#fff5f5' : '#f8fafc',
    color: '#0f172a',
  };

  const handleChange = (e) => {
    onChange(e);
    if (hasError) onFix(field.name);
  };

  if (field.type === 'textarea') {
    return (
      <textarea name={field.name} value={value} onChange={handleChange}
        rows={3} style={{ ...baseStyle, resize: 'vertical' }} />
    );
  }

  if (field.type === 'select') {
    return (
      <select name={field.name} value={value} onChange={handleChange}
        style={{ ...baseStyle, cursor: 'pointer' }}>
        <option value="">— Select —</option>
        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  const inputType =
    field.type === 'email' ? 'email'
    : ['number', 'percentage', 'rating10', 'rating13'].includes(field.type) ? 'number'
    : 'text';

  return (
    <input type={inputType} name={field.name} value={value}
      onChange={handleChange} min={field.min} max={field.max}
      placeholder={
        field.type === 'percentage' ? '0 – 100'
        : field.type === 'rating10' ? '1 – 10'
        : field.type === 'rating13' ? '1 – 13'
        : ''
      }
      style={baseStyle}
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const generateDummyData = (fields) => {
  return Object.fromEntries(fields.map(f => {
    let val = '';
    if (f.type === 'text' || f.type === 'textarea') {
      val = `Test ${f.label || f.name}`;
    } else if (f.type === 'email') {
      val = `student_${Math.floor(Math.random()*1000)}@example.com`;
    } else if (f.type === 'number') {
      val = Math.floor(Math.random() * 50) + 10;
    } else if (f.type === 'percentage') {
      val = Math.floor(Math.random() * 100);
    } else if (f.type === 'rating10') {
      val = Math.floor(Math.random() * 10) + 1;
    } else if (f.type === 'rating13') {
      val = Math.floor(Math.random() * 13) + 1;
    } else if (f.type === 'select' && f.options?.length > 0) {
      val = f.options[Math.floor(Math.random() * f.options.length)];
    }
    return [f.name, val];
  }));
};

export default function StudentSurveyPage() {
  const [step, setStep]             = useState('enter_code');
  const [courseCode, setCourseCode] = useState('');
  const [courseInfo, setCourseInfo] = useState(null);
  const [editToken, setEditToken]   = useState(null);
  const [apiError, setApiError]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const [editTokenInput, setEditTokenInput] = useState('');
  const [isEditing, setIsEditing]   = useState(false);

  const initialState = generateDummyData(STUDENT_FIELDS);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors]     = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearError = (name) => {
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Step 1 — verify course code
  const handleLookup = async () => {
    setApiError('');
    if (!courseCode.trim()) { setApiError('Please enter a course code.'); return; }
    setLoading(true);
    try {
      const info = await lookupCourseCode(courseCode.trim().toUpperCase());
      setCourseInfo(info);
      setStep('confirm');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError(err.error || 'Invalid or unpublished course code. Check with your instructor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadToken = async () => {
    setApiError('');
    if (!editTokenInput.trim()) { setApiError('Please enter an edit token.'); return; }
    setLoading(true);
    try {
      const data = await loadStudentSurvey(editTokenInput.trim());
      // Populate form data
      const loadedData = { ...initialState };
      for (const key of Object.keys(loadedData)) {
        if (data[key] !== undefined && data[key] !== null) {
          loadedData[key] = data[key];
        }
      }
      setFormData(loadedData);
      setCourseInfo({
        course_name: 'Existing Course',
        instructor_name: 'Instructor',
      });
      setCourseCode(data.course_code || ''); 
      setEditToken(editTokenInput.trim());
      setIsEditing(true);
      setStep('fill');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError(err.error || 'Invalid or expired edit token, or response is already published.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — validate then submit
  const handleSubmit = async (publish = false) => {
    setApiError('');

    const newErrors = validateForm(STUDENT_FIELDS, formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        const el = document.querySelector('[data-field-error="true"]');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isEditing) {
        result = await updateStudentSurvey(editToken, {
          ...formData,
          publish,
        });
      } else {
        result = await submitStudentSurvey({
          ...formData,
          course_code: courseCode.trim().toUpperCase(),
          publish,
        });
      }
      
      if (publish) {
        setStep('published_done');
      } else {
        setEditToken(result.edit_token);
        setStep('done');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError(err.detail || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const errorCount = Object.keys(errors).length;

  // ── STEP: ENTER CODE ───────────────────────────────────────────────────────
  if (step === 'enter_code') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#1e3a8a',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={26} color="#fff" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>
            Student Survey Portal
          </span>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 860, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          {/* COURSE CODE CARD */}
          <div style={{ background: '#fff', borderRadius: 28, padding: '48px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a',
              textAlign: 'center', marginBottom: 8 }}>
              Enter Course Code
            </h1>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 32 }}>
              Your instructor provides this code after completing the evaluation form.
            </p>

            <AnimatePresence>
              {apiError && !editTokenInput && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 10, padding: '12px 16px', color: '#dc2626',
                    marginBottom: 20, fontSize: 13, fontWeight: 600,
                    display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertTriangle size={16} />{apiError}
                </motion.div>
              )}
            </AnimatePresence>

            <input
              value={courseCode}
              onChange={e => { setCourseCode(e.target.value.toUpperCase()); setApiError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder="e.g. AB12CD34"
              maxLength={10}
              style={{ width: '100%', padding: '18px', fontSize: 28,
                textAlign: 'center', letterSpacing: 8, fontWeight: 900,
                borderRadius: 16, border: apiError && !editTokenInput ? '2px solid #ef4444' : '2px solid #e2e8f0',
                background: apiError && !editTokenInput ? '#fff5f5' : '#f8fafc',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'monospace', marginBottom: 20,
                transition: 'border-color 0.2s, background 0.2s' }}
              onFocus={e => { if (!(apiError && !editTokenInput)) e.target.style.borderColor = '#1e3a8a'; }}
              onBlur={e => { if (!(apiError && !editTokenInput)) e.target.style.borderColor = '#e2e8f0'; }}
            />

            <button onClick={handleLookup} disabled={loading || courseCode.length < 4}
              style={{ width: '100%', padding: '16px', borderRadius: 14,
                background: courseCode.length >= 4 ? '#1e3a8a' : '#94a3b8',
                color: '#fff', border: 'none', fontWeight: 900, fontSize: 16, marginTop: 'auto',
                cursor: courseCode.length >= 4 ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s' }}>
              {loading && !editTokenInput ? 'Verifying...' : <>Continue <ChevronRight size={18} /></>}
            </button>
          </div>

          {/* EDIT TOKEN CARD */}
          <div style={{ background: '#fff', borderRadius: 28, padding: '48px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a',
              textAlign: 'center', marginBottom: 8 }}>
              Resume Saved Form
            </h1>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 32 }}>
              If you saved a response as a draft, enter your edit token to resume it.
            </p>

            <AnimatePresence>
              {apiError && editTokenInput && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 10, padding: '12px 16px', color: '#dc2626',
                    marginBottom: 20, fontSize: 13, fontWeight: 600,
                    display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertTriangle size={16} />{apiError}
                </motion.div>
              )}
            </AnimatePresence>

            <input
              value={editTokenInput}
              onChange={e => { setEditTokenInput(e.target.value); setApiError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLoadToken()}
              placeholder="Enter your token"
              style={{ width: '100%', padding: '18px', fontSize: 18,
                textAlign: 'center', fontWeight: 600,
                borderRadius: 16, border: apiError && editTokenInput ? '2px solid #ef4444' : '2px solid #e2e8f0',
                background: apiError && editTokenInput ? '#fff5f5' : '#f8fafc',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'monospace', marginBottom: 20,
                transition: 'border-color 0.2s, background 0.2s' }}
              onFocus={e => { if (!(apiError && editTokenInput)) e.target.style.borderColor = '#0284c7'; }}
              onBlur={e => { if (!(apiError && editTokenInput)) e.target.style.borderColor = '#e2e8f0'; }}
            />

            <button onClick={handleLoadToken} disabled={loading || editTokenInput.length < 10}
              style={{ width: '100%', padding: '16px', borderRadius: 14,
                background: editTokenInput.length >= 10 ? '#0284c7' : '#94a3b8',
                color: '#fff', border: 'none', fontWeight: 900, fontSize: 16, marginTop: 'auto',
                cursor: editTokenInput.length >= 10 ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s' }}>
              {loading && editTokenInput ? 'Loading...' : 'Resume Form'}
            </button>
          </div>

        </motion.div>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 32 }}>
          Your response is completely anonymous. No login required.
        </p>
      </div>
    );
  }

  // ── STEP: CONFIRM ──────────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: 520, background: '#fff',
            borderRadius: 28, padding: '48px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
            Confirm Course Details
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
            Verify this is the correct course before filling the survey.
          </p>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd',
            borderRadius: 16, padding: '24px', marginBottom: 32 }}>
            {[['Instructor', courseInfo?.instructor_name],
              ['Course', courseInfo?.course_name],
              ['University', courseInfo?.department],
              ['Semester', courseInfo?.semester],
              ['Code', courseCode]].map(([label, val]) => val ? (
              <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: '#0369a1', minWidth: 120, fontSize: 13 }}>
                  {label}
                </span>
                <span style={{ color: '#0f172a', fontSize: 13 }}>{val}</span>
              </div>
            ) : null)}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => { setStep('enter_code'); setApiError(''); }}
              style={{ padding: '14px 20px', borderRadius: 12, border: '1px solid #e2e8f0',
                background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#475569',
                display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={() => setStep('fill')}
              style={{ flex: 1, padding: '14px 24px', borderRadius: 12, border: 'none',
                background: '#1e3a8a', color: '#fff', cursor: 'pointer',
                fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Yes, Fill My Survey <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── STEP: FILL ─────────────────────────────────────────────────────────────
  if (step === 'fill') {
    const required     = STUDENT_FIELDS.filter(f => f.required);
    const filled       = required.filter(f => formData[f.name] !== '').length;
    const pct          = Math.round((filled / required.length) * 100);
    const isFormReady  = filled === required.length;

    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 100px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, paddingTop: 40 }}>
          <button onClick={() => setStep('confirm')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none',
              border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14,
              fontWeight: 600, marginBottom: 20 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#1e3a8a',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Student Evaluation Form
              </h1>
              <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                {courseInfo?.course_name} · {courseInfo?.instructor_name}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
              <span>Required fields</span>
              <span>{filled} / {required.length}</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${pct}%`,
                background: pct === 100 ? '#16a34a' : '#1e3a8a',
                borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* API error */}
        {apiError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, padding: '12px 16px', color: '#dc2626',
            marginBottom: 24, fontSize: 14 }}>
            {apiError}
          </div>
        )}

        {/* Validation error banner */}
        <AnimatePresence>
          {errorCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ background: '#fef2f2', border: '1.5px solid #fecaca',
                borderRadius: 14, padding: '16px 20px', marginBottom: 24,
                display: 'flex', alignItems: 'center', gap: 12 }}>
              <XCircle size={22} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: '#dc2626', fontSize: 14 }}>
                  {errorCount} field{errorCount > 1 ? 's' : ''} need attention
                </div>
                <div style={{ color: '#7f1d1d', fontSize: 12 }}>
                  Fields highlighted in red must be corrected before submitting.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections */}
        {STUDENT_SECTIONS.map((section, sIdx) => {
          const sectionFields   = STUDENT_FIELDS.filter(f => f.section === section);
          const sectionHasError = sectionFields.some(f => errors[f.name]);

          return (
            <motion.div key={section}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.04 }}
              style={{
                background: '#fff', borderRadius: 20, padding: 32, marginBottom: 24,
                border: sectionHasError ? '1.5px solid #fecaca' : '1px solid #e2e8f0',
                boxShadow: sectionHasError
                  ? '0 2px 16px rgba(239,68,68,0.06)'
                  : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s',
              }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: sectionHasError ? '#fef2f2' : '#eff6ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900,
                  color: sectionHasError ? '#dc2626' : '#1e3a8a',
                }}>
                  {sIdx + 1}
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {section}
                </h2>
                {sectionHasError && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#dc2626',
                    background: '#fef2f2', padding: '2px 8px', borderRadius: 99 }}>
                    Has errors
                  </span>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 20,
              }}>
                {sectionFields.map(field => {
                  const hasError = !!errors[field.name];
                  return (
                    <div key={field.name}
                      data-field-error={hasError ? 'true' : undefined}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 4,
                        gridColumn: field.type === 'textarea' ? 'span 2' : 'span 1',
                      }}>

                      <label style={{
                        fontSize: 13, fontWeight: 600, lineHeight: 1.4,
                        color: hasError ? '#dc2626' : '#374151',
                        transition: 'color 0.2s',
                      }}>
                        {field.label}
                        {field.required && (
                          <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span>
                        )}
                        {field.type === 'percentage' && (
                          <span style={{ color: '#94a3b8', fontWeight: 400 }}> (%)</span>
                        )}
                        {field.type === 'rating10' && (
                          <span style={{ color: '#94a3b8', fontWeight: 400 }}> (1–10)</span>
                        )}
                      </label>

                      <FieldInput
                        field={field}
                        value={formData[field.name]}
                        onChange={handleChange}
                        hasError={hasError}
                        onFix={clearError}
                      />

                      <AnimatePresence>
                        {hasError && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              fontSize: 11, color: '#dc2626', fontWeight: 700,
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                            <AlertTriangle size={11} />
                            {errors[field.name]}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Sticky submit (Split) */}
        <div style={{ position: 'sticky', bottom: 24, zIndex: 10,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          
          <button onClick={() => handleSubmit(false)} disabled={loading || !isFormReady}
            title={!isFormReady ? `Fill all required fields (${filled}/${required.length} done)` : ''}
            style={{
              padding: '16px 32px', borderRadius: 16,
              background: isFormReady ? '#fff' : '#f1f5f9',
              color: isFormReady ? '#1e3a8a' : '#94a3b8',
              border: `2px solid ${isFormReady ? '#1e3a8a' : '#e2e8f0'}`,
              fontWeight: 900, fontSize: 17,
              cursor: isFormReady ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 0.3s, color 0.3s',
            }}>
            {loading ? 'Saving...' : <><Copy size={20} /> Save (Edit Later)</>}
          </button>

          <button onClick={() => handleSubmit(true)} disabled={loading || !isFormReady}
            title={!isFormReady ? `Fill all required fields (${filled}/${required.length} done)` : ''}
            style={{
              padding: '16px 32px', borderRadius: 16,
              background: isFormReady ? '#1e3a8a' : '#cbd5e1',
              color: isFormReady ? '#fff' : '#94a3b8',
              border: 'none',
              fontWeight: 900, fontSize: 17,
              cursor: isFormReady ? 'pointer' : 'not-allowed',
              boxShadow: isFormReady ? '0 8px 32px rgba(30,58,138,0.35)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
            }}>
            {loading ? 'Publishing...' : <><CheckCircle size={20} /> Publish (Final)</>}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: 520, background: '#fff',
            borderRadius: 28, padding: '48px 40px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e0f2fe',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px' }}>
            <Copy size={40} color="#0284c7" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
            Survey Saved as Draft
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>
            Your response has been saved. Save your <strong>Edit Token</strong> to update and publish it later.
          </p>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
              Edit Token
            </p>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#0f172a',
              wordBreak: 'break-all', lineHeight: 1.6 }}>
              {editToken}
            </div>
            <button onClick={handleCopy}
              style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8,
                background: copied ? '#dcfce7' : '#eff6ff',
                color: copied ? '#16a34a' : '#1e3a8a',
                border: `1px solid ${copied ? '#bbf7d0' : '#bfdbfe'}`,
                cursor: 'pointer', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6, margin: '12px auto 0' }}>
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy Token'}
            </button>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left' }}>
            <AlertTriangle size={16} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ color: '#7f1d1d', fontSize: 12, fontWeight: 600, margin: 0 }}>
              If this token is lost, you cannot edit your response. Save it now.
            </p>
          </div>
          <button onClick={() => window.location.href = '/survey/student'}
            style={{ marginTop: 24, padding: '12px 24px', borderRadius: 12,
              background: '#fff', border: '2px solid #e2e8f0', color: '#475569',
              fontWeight: 700, cursor: 'pointer' }}>
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'published_done') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: 520, background: '#fff',
            borderRadius: 28, padding: '48px 40px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
            Survey Published!
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>
            Your response has been permanently submitted. Thank you for your feedback!
          </p>
          <button onClick={() => window.location.href = '/survey/student'}
            style={{ marginTop: 24, padding: '12px 24px', borderRadius: 12,
              background: '#1e3a8a', border: 'none', color: '#fff',
              fontWeight: 700, cursor: 'pointer' }}>
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}
