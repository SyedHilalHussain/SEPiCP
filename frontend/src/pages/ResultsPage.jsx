import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Printer,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  CheckCircle2,
  AlertTriangle,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const ResultsPage = () => {
  const [activeTab, setActiveTab] = React.useState('scatter');

  const metrics = [
    { label: 'Model Accuracy', value: '94.2%', trendStatus: 'up', trend: '+2.4%', icon: CheckCircle2, color: 'text-emerald-500', barColor: 'bg-emerald-500' },
    { label: 'Mean Squared Error', value: '0.045', trendStatus: 'none', trend: 'MSE', icon: Database, color: 'text-[#1e3a8a]', barColor: 'bg-[#1e3a8a]' },
    { label: 'R-Squared', value: '0.88', trendStatus: 'down', trend: '-0.1%', icon: AlertTriangle, color: 'text-amber-500', barColor: 'bg-amber-500' },
    { label: 'Sample Size (N)', value: '1,250', trendStatus: 'none', trend: 'Entries', icon: Users, color: 'text-slate-400', barColor: 'bg-slate-300' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Analysis Results Report</h1>
          <p className="text-slate-500 mt-1.5 text-xs sm:text-sm font-medium">
            Regression Analysis: Experiment 2023-B • Oct 24, 2023
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" className="h-10 px-4 rounded-xl font-bold border-slate-200 bg-white text-slate-600 shadow-sm flex items-center gap-2 text-xs">
            <Printer className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" className="h-10 px-4 rounded-xl font-bold border-slate-200 bg-white text-slate-600 shadow-sm flex items-center gap-2 text-xs">
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button className="h-10 px-4 rounded-xl bg-[#1e3a8a] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:bg-[#1a337a] transition-all flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <Card key={i} className="rounded-2xl border-slate-200 shadow-lg shadow-slate-200/20 bg-white p-6 overflow-hidden relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
              <m.icon className={cn("w-5 h-5", m.color)} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 leading-tight">{m.value}</span>
              {m.trendStatus !== 'none' && (
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black",
                  m.trendStatus === 'up' ? "text-emerald-500" : "text-amber-500"
                )}>
                  {m.trendStatus === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {m.trend}
                </div>
              )}
            </div>
            <div className={cn("absolute bottom-0 left-0 h-1 w-full transition-all group-hover:h-1.5", m.barColor)} />
          </Card>
        ))}
      </div>

      {/* Main Chart Card */}
      <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/30 bg-white p-6 sm:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Predicted vs. Actual Values</h3>
            <p className="text-slate-500 font-bold text-[12px] sm:text-sm mt-1">Visualizing the correlation between model predictions and ground truth data.</p>
          </div>
          <div className="p-1 bg-slate-100 rounded-xl flex border border-slate-200 self-start md:self-center">
            {['Scatter', 'Line', 'Residuals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-xs transition-all",
                  activeTab === tab.toLowerCase()
                    ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="h-[450px] w-full relative bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-center">
          {/* Grid Background */}
          <div className="absolute inset-10 border-l border-b border-slate-200 bg-linear-to-tr from-white to-transparent">
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full border-t border-slate-100 border-dashed"></div>)}
            </div>
            {/* Trend line */}
            <div className="absolute left-0 bottom-0 w-full h-[80%] border-t-2 border-[#1e3a8a] border-dashed transform -rotate-15 origin-left opacity-30"></div>

            {/* Dots */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-4 h-4 rounded-full shadow-lg transform transition-all hover:scale-150 cursor-pointer",
                  i % 5 === 0 ? "bg-red-400" : "bg-[#1e3a8a]"
                )}
                style={{
                  left: `${5 + (i * 6)}%`,
                  bottom: `${10 + (i * 5) + (Math.random() * 8)}%`
                }}
              ></div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#1e3a8a]"></div>
                <span className="text-xs font-bold text-slate-600">Predicted Data</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-xs font-bold text-slate-600">Outliers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-0.5 border-t border-[#1e3a8a] border-dashed"></div>
                <span className="text-xs font-bold text-slate-600">Trend Line</span>
              </div>
            </div>

            {/* Axes Labels */}
            <div className="absolute -left-16 top-1/2 -rotate-90 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Dependent Variable (Growth)</div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Independent Variable (Time)</div>
          </div>
        </div>
      </Card>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-10">
        <Card className="rounded-[40px] border-slate-200 shadow-xl shadow-slate-200/30 bg-white p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Key Contributing Factors</h3>
            <Link to="/analysis" className="text-[11px] font-black text-[#1e3a8a] uppercase tracking-widest hover:underline">View Full Analysis</Link>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Enrollment Index', coef: '0.420', error: '0.012', p: '< 0.001' },
              { name: 'Research Quality', coef: '0.315', error: '0.024', p: '0.005' },
              { name: 'Faculty Growth', coef: '0.128', error: '0.045', p: '0.012' },
            ].map(row => (
              <div key={row.name} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 px-2 rounded-xl transition-all">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">{row.name}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Dimension</span>
                </div>
                <div className="text-right flex items-center gap-10">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700">{row.coef}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Coefficient</span>
                  </div>
                  <div className="flex flex-col w-16">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-center">{row.p}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase text-center mt-1">P-Value</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[40px] border-slate-200 shadow-xl shadow-slate-200/30 bg-white p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Model Configuration</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Algorithm</p>
                <p className="text-sm font-black text-slate-700">Linear Regression (OLS)</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Regularization</p>
                <p className="text-sm font-black text-slate-700">Ridge (Alpha = 1.0)</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-black text-xs shadow-lg">Dr</div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-tight">Dr. Sarah Jenkins</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Head of Data Science</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
              "The model shows significant stability in the core dimensions. Outliers in the upper quadrant suggest unexplored departmental variance."
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;

