import React, { useEffect, useState } from 'react';
import { Users, BookOpen, BarChart3, TrendingUp, Copy, CheckCircle } from 'lucide-react';
import { apiUrl } from '../lib/api';

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
    fetch(apiUrl('/teacher/dashboard/'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-[15px] font-semibold">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900 mb-8">My Courses Dashboard</h1>

      {data?.courses?.map(course => (
        <div key={course.id} className="bg-white rounded-[20px] p-7 mb-5 border border-slate-200 shadow-sm">
          
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1e3a8a] m-0 mb-2">{course.course_name}</h2>
              <p className="m-0 text-slate-500 text-sm">{course.semester}</p>
            </div>
            
            <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 flex flex-col items-end shrink-0">
              <div className="text-[11px] font-extrabold text-sky-700 uppercase tracking-widest mb-1">
                Student Course Code
              </div>
              <div className="flex items-center gap-2.5">
                <code className="text-lg font-black text-slate-900 tracking-widest">{course.course_code}</code>
                <button onClick={() => handleCopy(course.course_code)}
                  className={`bg-transparent border-none cursor-pointer flex items-center transition-colors ${copiedCode === course.course_code ? 'text-green-600' : 'text-sky-500 hover:text-sky-600'}`}>
                  {copiedCode === course.course_code ? <CheckCircle size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Responses</div>
                <div className="text-xl font-black text-slate-800">
                  {course.published_count} <span className="text-sm font-semibold text-slate-400">/ {course.student_count || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Engagement</div>
                <div className="text-xl font-black text-slate-800">
                  {course.avg_engagement ? course.avg_engagement.toFixed(1) : '-'} <span className="text-sm font-semibold text-slate-400">/ 10</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      ))}
      {(!data?.courses || data.courses.length === 0) && (
        <div className="text-center py-10 text-slate-500">
          No courses found. Go back and create a survey first!
        </div>
      )}
    </div>
  );
}
