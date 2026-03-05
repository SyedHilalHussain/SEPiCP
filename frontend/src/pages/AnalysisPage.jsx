import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Settings2,
  BarChart3,
  ChevronRight,
  Zap,
  Info,
  Loader2,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Switch } from '../components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';

const AnalysisPage = () => {
  const { user, logActivity } = useAuth();
  const [dataset] = useState('Fall_2023_Survey_Results.xlsx');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRun = () => {
    logActivity('analysis', `Ran visualization on ${dataset}`);
    navigate('/results');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Analysis Configuration</h1>
          <p className="text-slate-500 mt-1.5 text-xs sm:text-sm font-medium">
            Configure parameters for your dataset analysis. Active session:
            <span className="text-[#1e3a8a] font-bold underline cursor-pointer ml-1">{dataset}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-200 bg-white text-slate-600 shadow-sm flex items-center gap-2 text-xs">
            <History className="w-4 h-4 text-slate-400" />
            History
          </Button>
          <Button
            onClick={handleRun}
            className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            Run Analysis
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Configuration */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <Card className="rounded-[24px] border-slate-200 shadow-lg shadow-slate-200/20 bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-50">
              <CardTitle className="font-black text-slate-800 flex items-center gap-2.5 text-sm uppercase tracking-wider">
                <Settings2 className="w-4.5 h-4.5 text-slate-400" />
                Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-0.5">Independent Variable (X-Axis)</label>
                <Select value={xAxis} onValueChange={setXAxis}>
                  <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 rounded-xl h-11 font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs">
                    <SelectValue placeholder="Select variable..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="age" className="rounded-lg font-bold text-xs">Age Group</SelectItem>
                    <SelectItem value="gpa" className="rounded-lg font-bold text-xs">GPA Index</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 font-medium ml-0.5 uppercase tracking-wide">Categorical or continuous variable.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-0.5">Dependent Variable (Y-Axis)</label>
                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 rounded-xl h-11 font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs">
                    <SelectValue placeholder="Select outcome..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="score" className="rounded-lg font-bold text-xs">Performance Score</SelectItem>
                    <SelectItem value="satisfaction" className="rounded-lg font-bold text-xs">Student Satisfaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-0.5">Group By (Optional)</label>
                <Select defaultValue="none">
                  <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 rounded-xl h-11 font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="none" className="rounded-lg font-bold text-xs">None</SelectItem>
                    <SelectItem value="dept" className="rounded-lg font-bold text-xs">Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border-slate-200 shadow-lg shadow-slate-200/20 bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-50">
              <CardTitle className="font-black text-slate-800 flex items-center gap-2.5 text-sm uppercase tracking-wider">
                <BarChart3 className="w-4.5 h-4.5 text-slate-400" />
                Chart Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-8">
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/50 rounded-2xl">
                {[
                  { id: 'bar', label: 'Bar', icon: BarChart3 },
                  { id: 'line', label: 'Line', icon: Settings2 },
                  { id: 'scatter', label: 'Scatter', icon: Database },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all",
                      chartType === type.id
                        ? "bg-white text-[#1e3a8a] shadow-sm font-black ring-1 ring-slate-200"
                        : "text-slate-400 hover:text-slate-600 font-bold"
                    )}
                  >
                    <type.icon className="w-4.5 h-4.5" />
                    <span className="text-[10px] uppercase tracking-widest">{type.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-slate-900 text-[13px] font-black">Exclude Outliers</p>
                    <p className="text-slate-400 text-[11px] font-bold">Remove values {'>'} 3 SD</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#1e3a8a] scale-90" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-slate-900 text-[13px] font-black">Show Confidence Int.</p>
                    <p className="text-slate-400 text-[11px] font-bold">95% CI shading</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#1e3a8a] scale-90" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Preview Area */}
        <div className="lg:col-span-12 xl:col-span-7 h-full">
          <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/30 w-full min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] flex items-center justify-center relative overflow-hidden bg-white/60 backdrop-blur-sm">
            {/* Visualizer Background Placeholder */}
            <div className="absolute inset-10 sm:inset-20 opacity-10 pointer-events-none grayscale flex items-end gap-6 sm:gap-10">
              {[4, 5, 8, 4, 10, 6].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-xl sm:rounded-t-2xl bg-slate-300" style={{ height: `${h * 10}%` }}></div>
              ))}
            </div>

            {loading && (
              <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 p-8 sm:p-12 bg-white rounded-[32px] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-500 mx-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-slate-100 border-t-[#1e3a8a] animate-spin"></div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">Generating Preview</p>
                  <p className="text-[12px] font-bold text-slate-400 mt-1 sm:mt-2">Processing 1,240 rows...</p>
                </div>
              </div>
            )}

            {/* Bottom Controls as seen in image */}
            <div className="absolute bottom-10 flex gap-6 sm:gap-12 opacity-30 grayscale scale-75 sm:scale-90 pointer-events-none">
              <div className="w-20 sm:w-32 h-4 sm:h-6 bg-slate-200 rounded-full"></div>
              <div className="w-20 sm:w-32 h-4 sm:h-6 bg-slate-200 rounded-full"></div>
              <div className="w-20 sm:w-32 h-4 sm:h-6 bg-slate-200 rounded-full"></div>
            </div>

            <div className="absolute top-10 right-10 flex gap-3 sm:gap-4 opacity-30 grayscale scale-75 sm:scale-90 pointer-events-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-xl"></div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-xl"></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;

