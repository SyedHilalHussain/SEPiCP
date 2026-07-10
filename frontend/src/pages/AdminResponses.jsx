import React, { useState, useEffect } from 'react';
import { Download, Database, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAllSurveysAdmin, exportAdminSurveysExcel, convertAdminSurveysToDataset } from '../api/surveyApi';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminResponses() {
  const [stats, setStats] = useState({ instructors: 0, students: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const data = await getAllSurveysAdmin();
      let totalStudents = 0;
      data.forEach(s => totalStudents += s.student_response_count || 0);
      setStats({ instructors: data.length, students: totalStudents });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch survey stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      setError('');
      setSuccess('');
      await exportAdminSurveysExcel(type);
      setSuccess(`${type === 'instructor' ? 'Instructor' : 'Student'} Excel downloaded successfully!`);
    } catch (err) {
      setError(`Failed to download ${type} Excel file.`);
    }
  };

  const handleConvertToDataset = async (type) => {
    try {
      setError('');
      setSuccess('');
      const res = await convertAdminSurveysToDataset(type);
      setSuccess(res.message || 'Data retrieved successfully!');
      if (res.data) {
        // Store in sessionStorage to simulate file upload
        const cols = (res.columns || Object.keys(res.data[0] || {})).map(key => ({
          header: key.toUpperCase(),
          accessorKey: key
        }));
        
        sessionStorage.setItem('uploaded_table_data', JSON.stringify(res.data));
        sessionStorage.setItem('uploaded_columns', JSON.stringify(cols));
        sessionStorage.setItem('uploaded_file_info', JSON.stringify({ name: res.name || 'Survey Data', size: 'DB' }));
        
        setTimeout(() => navigate('/upload'), 1500);
      }
    } catch (err) {
      setError(err.detail || err.error || `Failed to retrieve ${type} data.`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading responses...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Survey Responses</h1>
          <p className="text-slate-500 mt-2">Manage collected instructor and student survey data.</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium text-sm">{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[30px] border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1e3a8a]">
              <FileSpreadsheet className="w-5 h-5" /> Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-around p-4 bg-slate-50 rounded-2xl">
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900">{stats.instructors}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Instructor<br/>Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900">{stats.students}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Student<br/>Responses</div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium">Download all published responses across all courses as a single multi-sheet Excel file for local analysis.</p>
            
            <div className="flex flex-col xl:flex-row gap-4">
              <Button onClick={() => handleDownload('instructor')} className="flex-1 h-14 rounded-2xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold tracking-wide">
                <Download className="w-5 h-5 mr-2" /> Instructor Data
              </Button>
              <Button onClick={() => handleDownload('student')} className="flex-1 h-14 rounded-2xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold tracking-wide">
                <Download className="w-5 h-5 mr-2" /> Student Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600">
              <Database className="w-5 h-5" /> Import to Upload Data Table
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
               <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                 Retrieve the current survey responses and load them directly into the <strong className="font-black">Upload Data Table</strong>. This allows you to preview and clean the data before saving it as a final dataset for analysis.
               </p>
             </div>
             <div className="flex flex-col xl:flex-row gap-4">
              <Button onClick={() => handleConvertToDataset('instructor')} className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide">
                <Database className="w-5 h-5 mr-2" /> Instructor Data
              </Button>
              <Button onClick={() => handleConvertToDataset('student')} className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide">
                <Database className="w-5 h-5 mr-2" /> Student Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
