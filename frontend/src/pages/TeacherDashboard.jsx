import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Copy, CheckCircle, PlusCircle, FileText, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-[15px] font-semibold">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Course Evaluation Dashboard</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Instructor: <span className="text-slate-800 font-bold">{data?.instructor_email || data?.instructor_name}</span>
          </p>
        </div>
        <Link to="/teacher" className="bg-[#1e3a8a] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-900 transition-all shadow-md">
          <PlusCircle size={18} /> Add Course Evaluation
        </Link>
      </div>

      <div className="space-y-4">
        {data?.courses?.map(course => (
          <div key={course.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Left: Course Info & Visual Status Indicators */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                {/* 🔴 Red (Incomplete / Draft) / 🟢 Green (Completed / Published) Indicator */}
                {course.is_completed ? (
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Green - Instructor Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-rose-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Red - Instructor Incomplete (Draft)
                  </span>
                )}
                <span className="text-xs text-slate-400 font-bold">Survey ID: #{course.id}</span>
              </div>

              <h2 className="text-xl font-extrabold text-[#1e3a8a]">{course.course_name}</h2>
              <p className="text-sm font-medium text-slate-500">{course.semester}</p>
            </div>

            {/* Right: Metrics, Survey ID / Code & Evaluate Form Action Button */}
            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 flex-wrap">
              {/* Response Counter */}
              <div className="text-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Responses</div>
                <div className="text-lg font-black text-slate-800 flex items-center justify-center gap-1">
                  <Users size={16} className="text-blue-600" />
                  {course.published_responses}
                </div>
              </div>

              {/* 5-Char Survey Code */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 text-right">
                <div className="text-[10px] font-extrabold text-sky-800 uppercase tracking-widest">Survey Code</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="text-base font-black text-slate-900 tracking-wider">{course.course_code}</code>
                  <button onClick={() => handleCopy(course.course_code)} className="text-sky-600 hover:text-sky-800 border-none bg-transparent cursor-pointer">
                    {copiedCode === course.course_code ? <CheckCircle size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Evaluate Form Action Button (Shows Draft status explicitly if pending) */}
              <button
                onClick={() => navigate('/teacher/form', {
                  state: {
                    surveyId: course.id,
                    courseName: course.course_name,
                    semester: course.semester
                  }
                })}
                className={course.is_completed 
                  ? "bg-[#1e3a8a] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  : "bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer animate-bounce-short"
                }
              >
                <FileText size={15} />
                {course.is_completed ? "Edit Form (Completed)" : "Evaluate Form (Draft)"}
              </button>
            </div>

          </div>
        ))}

        {(!data?.courses || data.courses.length === 0) && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
            No course evaluations found. Click <strong>Add Course Evaluation</strong> to start!
          </div>
        )}
      </div>
    </div>
  );
}
