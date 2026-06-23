import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Settings2, BarChart3, Zap, History } from "lucide-react";
import { cn } from "../lib/utils";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { apiUrl } from "../lib/api";
import DataPreviewTable from "../components/DataPreviewTable";

const AnalysisPage = () => {
  const [xAxis, setXAxis] = useState(() => {
    try {
      const saved = sessionStorage.getItem('analysis_xaxis');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [yAxis, setYAxis] = useState(() => {
    return sessionStorage.getItem('analysis_yaxis') || "";
  });
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(false);
  const [datasetsLoading, setDatasetsLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);

  const [step, setStep] = useState(() => {
    return Number(sessionStorage.getItem('analysis_step')) || 1;
  });
  const [selectedDataset, setSelectedDataset] = useState(() => {
    return sessionStorage.getItem('analysis_selected_dataset') || "";
  });
  const [columns, setColumns] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [variance, setVariance] = useState(95);

  const [analysisType, setAnalysisType] = useState(() => {
    return sessionStorage.getItem('analysis_type') || "";
  });
  const navigate = useNavigate();

  // Compute table data and columns for dataset preview
  const tableData = React.useMemo(() => {
    if (!selectedDataset || selectedDataset === "none") return [];
    const selected = datasets.find((d) => d.id.toString() === selectedDataset);
    return selected?.cleaned_data || [];
  }, [selectedDataset, datasets]);

  const tableColumns = React.useMemo(() => {
    if (tableData.length === 0) return [];
    return Object.keys(tableData[0]).map((key) => ({
      header: key.toUpperCase(),
      accessorKey: key
    }));
  }, [tableData]);

  // Compute the active dataset name dynamically
  const activeSessionName = React.useMemo(() => {
    if (!selectedDataset || selectedDataset === "none") {
      return "No Active Dataset";
    }
    const selected = datasets.find((d) => d.id.toString() === selectedDataset);
    if (selected) {
      const isLatest = datasets[0] && datasets[0].id === selected.id;
      if (isLatest) {
        const saved = sessionStorage.getItem('uploaded_file_info');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.name) return parsed.name;
          } catch {}
        }
      }
      return `Dataset #${selected.id}`;
    }
    return "No Active Dataset";
  }, [selectedDataset, datasets]);

  // Sync states to sessionStorage on change
  React.useEffect(() => {
    sessionStorage.setItem('analysis_selected_dataset', selectedDataset);
  }, [selectedDataset]);

  React.useEffect(() => {
    sessionStorage.setItem('analysis_step', step);
  }, [step]);

  React.useEffect(() => {
    sessionStorage.setItem('analysis_type', analysisType);
  }, [analysisType]);

  React.useEffect(() => {
    sessionStorage.setItem('analysis_xaxis', JSON.stringify(xAxis));
  }, [xAxis]);

  React.useEffect(() => {
    sessionStorage.setItem('analysis_yaxis', yAxis);
  }, [yAxis]);

  React.useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setDatasetsLoading(true);
        const response = await fetch(apiUrl("/datasets/"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to fetch datasets", data);
          return;
        }

        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        setDatasets(sorted.slice(0, 5));

        // Auto-select latest dataset if none is selected
        if (!sessionStorage.getItem('analysis_selected_dataset') && sorted.length > 0) {
          setSelectedDataset(sorted[0].id.toString());
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setDatasetsLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  React.useEffect(() => {
    setXAxis([]);
    setYAxis("");
    setColumns([]);
  }, [selectedDataset]);

  React.useEffect(() => {
    if (!selectedDataset) return;

    const selected = datasets.find((d) => d.id.toString() === selectedDataset);

    if (selected && selected.cleaned_data && selected.cleaned_data.length > 0) {
      const cols = Object.keys(selected.cleaned_data[0]);
      setColumns(cols);
    } else {
      setColumns([]);
    }
  }, [selectedDataset, datasets]);

  React.useEffect(() => {
    if (!selectedDataset) return;

    const selected = datasets.find((d) => d.id.toString() === selectedDataset);

    if (selected && selected.cleaned_data?.length > 0) {
      const data = selected.cleaned_data;

      const cols = Object.keys(data[0]);

      const numericCols = cols.filter((col) => {
        const validValues = data
          .map((row) => row[col])
          .filter((val) => val !== null && val !== "");

        const numericCount = validValues.filter(
          (val) => !isNaN(Number(val)),
        ).length;

        return numericCount / validValues.length > 0.8; // 80% numeric
      });

      setColumns(cols);
      setNumericColumns(numericCols);
    }
  }, [selectedDataset, datasets]);
  // const handleRun = () => {
  //   if (step !== 2) return;
  //   logActivity('analysis', `Ran visualization on ${dataset}`);
  //   navigate('/results');
  // };
  const handleRun = async () => {
    const selected = datasets.find((d) => d.id.toString() === selectedDataset);

    if (!selected) return;

    let url = "";
    let payload = {};

    if (analysisType === "regression") {
      if (xAxis.length === 0 || !yAxis) {
        alert("Select X and Y variables");
        return;
      }
      url = apiUrl("/analysis/regression/");

      payload = {
        independent_vars: xAxis,
        dependent_var: yAxis,
        data: selected.cleaned_data,
      };
    }

    if (analysisType === "pca") {
      if (xAxis.length === 0) {
        alert("Select features");
        return;
      }
      url = apiUrl("/analysis/pca/");

      payload = {
        selected_columns: xAxis,
        variance_threshold: variance,
        data: selected.cleaned_data,
      };
    }

    if (analysisType === "basic") {
      url = apiUrl("/analysis/basic/");
      payload = {
        data: selected.cleaned_data,
      };
    }

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      navigate("/results", {
        state: {
          analysisType,
          result: data,
          datasetId: selected.id,
          datasetCreatedAt: selected.created_at,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleSelectAll = (availableColumns) => {
    if (xAxis.length === availableColumns.length) {
      setXAxis([]); // Unselect all
    } else {
      setXAxis([...availableColumns]); // Select all
    }
  };

  const StatBox = ({ label, value }) => (
  <div className="rounded-xl bg-white border border-slate-200 p-3">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
      {label}
    </p>
    <p className="text-lg font-black text-slate-900 mt-1">
      {typeof value === "number" ? value.toFixed(2) : value ?? "N/A"}
    </p>
  </div>
);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Analysis Configuration
          </h1>
          <p className="text-slate-500 mt-1.5 text-xs sm:text-sm font-medium inline-flex items-center flex-wrap gap-1">
            Configure parameters for your dataset analysis. Active session:
            <Select
              value={selectedDataset}
              onValueChange={setSelectedDataset}
            >
              <SelectTrigger className="border border-blue-200/80 bg-blue-50/60 hover:bg-blue-100/60 h-auto py-1 px-3 text-[#1e3a8a] font-black rounded-full cursor-pointer inline-flex items-center gap-1.5 focus:ring-0 focus-visible:ring-0 shadow-xs transition-all text-xs">
                <SelectValue placeholder="Select dataset..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                {datasets.length === 0 ? (
                  <SelectItem value="none" className="rounded-lg font-bold text-xs">
                    No datasets
                  </SelectItem>
                ) : (
                  datasets.map((item, index) => {
                    let name = `Dataset #${item.id}`;
                    const isLatest = datasets[0] && datasets[0].id === item.id;
                    if (isLatest) {
                      const saved = sessionStorage.getItem('uploaded_file_info');
                      if (saved) {
                        try {
                          const parsed = JSON.parse(saved);
                          if (parsed.name) name = parsed.name;
                        } catch {}
                      }
                    }
                    return (
                      <SelectItem
                        key={item.id}
                        value={item.id.toString()}
                        className="rounded-lg font-bold text-xs"
                      >
                        {name}
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-11 px-6 rounded-xl font-bold border-slate-200 bg-white text-slate-600 shadow-sm flex items-center gap-2 text-xs"
          >
            <History className="w-4 h-4 text-slate-400" />
            History
          </Button>
          <Button
            onClick={handleRun}
            disabled={loading}
            className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full bg-white"
                      style={{ height: "4px" }}
                      animate={{
                        height: [4, 14, 4]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15
                      }}
                    />
                  ))}
                </div>
                Processing...
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white animate-pulse" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Horizontal Configurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <Card className="rounded-[24px] border-slate-200 shadow-lg shadow-slate-200/20 bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-50">
              <CardTitle className="font-black text-slate-800 flex items-center gap-2.5 text-sm uppercase tracking-wider">
                <Settings2 className="w-4.5 h-4.5 text-slate-400" />
                Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              {step === 1 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-0.5">
                    Datasets
                  </label>
                  <Select
                    defaultValue="none"
                    value={selectedDataset}
                    onValueChange={setSelectedDataset}
                  >
                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 rounded-xl h-11 font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      {datasets.length === 0 ? (
                        <SelectItem
                          value="none"
                          className="rounded-lg font-bold text-xs"
                        >
                          No datasets
                        </SelectItem>
                      ) : (
                        datasets.map((item, index) => (
                          <SelectItem
                            key={item.id}
                            value={item.id.toString()}
                            className="rounded-lg font-bold text-xs"
                          >
                            Dataset {index + 1}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={() => {
                      if (!selectedDataset || selectedDataset === "none") {
                        alert("Please select dataset");
                        return;
                      }
                      setStep(2);
                    }}
                    className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex items-center gap-2"
                  >
                    Next
                  </button>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-700 ml-0.5">
                    Analysis Type
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "basic", label: "Basic Analysis" },
                      { id: "regression", label: "Regression" },
                      { id: "pca", label: "PCA" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setAnalysisType(type.id)}
                        className={cn(
                          "h-12 rounded-xl border text-xs font-black uppercase tracking-wider transition-all",
                          analysisType === type.id
                            ? "bg-[#1e3a8a] text-white shadow-lg"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100",
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => {
                        setStep(1);

                        setAnalysisType("");
                      }}
                      className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex items-center gap-2"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!analysisType) {
                          alert("Please select analysis type");
                          return;
                        }
                        setStep(3);
                      }}
                      className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white font-black text-[12px] uppercase tracking-widest shadow-lg hover:bg-[#1a337a]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && analysisType === "regression" && (
                <div className="flex flex-col gap-5">
                  {/* 🔥 X VARIABLES (MULTI SELECT) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-slate-700">
                        Independent Variables (X)
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setXAxis(
                            xAxis.length === columns.length ? [] : [...columns],
                          )
                        }
                        className="text-xs font-bold text-[#1e3a8a] hover:underline"
                      >
                        {xAxis.length === columns.length
                          ? "Clear All"
                          : "Select All"}
                      </button>
                    </div>

                    <div className="max-h-52 overflow-y-auto border rounded-xl p-3 bg-slate-50 mt-2">
                      {columns.map((col) => (
                        <label
                          key={col}
                          className="flex items-center gap-2 text-xs font-bold mb-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={xAxis.includes(col)}
                            onChange={() => {
                              setXAxis((prev) =>
                                prev.includes(col)
                                  ? prev.filter((c) => c !== col)
                                  : [...prev, col],
                              );
                            }}
                          />
                          {col}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 🔥 Y VARIABLE (SINGLE SELECT) */}
                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Dependent Variable (Y)
                    </label>

                    <select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                      className="w-full mt-2 h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                    >
                      <option value="">Select Y</option>
                      {columns
                        .filter((col) => !xAxis.includes(col)) // avoid same variable
                        .map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* 🔙 BACK & RUN */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setStep(2);
                        setXAxis([]);
                        setYAxis("");
                      }}
                      className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all flex-1"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRun}
                      disabled={loading}
                      className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="flex items-center gap-0.5 h-4">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 rounded-full bg-white"
                                style={{ height: "4px" }}
                                animate={{
                                  height: [4, 14, 4]
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: i * 0.15
                                }}
                              />
                            ))}
                          </div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white animate-pulse" />
                          Run Analysis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              {step === 3 && analysisType === "pca" && (
                <div className="space-y-5">
                  {/* 🔥 FEATURE SELECTION */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-slate-700">
                        Select Features
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setXAxis(
                            xAxis.length === numericColumns.length
                              ? []
                              : [...numericColumns],
                          )
                        }
                        className="text-xs font-bold text-[#1e3a8a] hover:underline"
                      >
                        {xAxis.length === numericColumns.length
                          ? "Clear All"
                          : "Select All"}
                      </button>
                    </div>

                    <div className="max-h-52 overflow-y-auto border rounded-xl p-3 bg-slate-50 mt-2">
                      {numericColumns.map((col) => (
                        <label
                          key={col}
                          className="flex items-center gap-2 text-xs font-bold mb-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={xAxis.includes(col)}
                            onChange={() => {
                              setXAxis((prev) =>
                                prev.includes(col)
                                  ? prev.filter((c) => c !== col)
                                  : [...prev, col],
                              );
                            }}
                          />
                          {col}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 🔥 VARIANCE */}
                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Variance Threshold (%)
                    </label>

                    <input
                      type="number"
                      value={variance}
                      onChange={(e) => setVariance(Number(e.target.value))}
                      className="w-full mt-2 h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  {/* 🔙 BACK & RUN */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setStep(2);
                        setXAxis([]);
                      }}
                      className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all flex-1"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRun}
                      disabled={loading}
                      className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="flex items-center gap-0.5 h-4">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 rounded-full bg-white"
                                style={{ height: "4px" }}
                                animate={{
                                  height: [4, 14, 4]
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: i * 0.15
                                }}
                              />
                            ))}
                          </div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white animate-pulse" />
                          Run Analysis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Basic Analysis block */}
              {step === 3 && analysisType === "basic" && (
                <div className="space-y-5">
                  <p className="text-xs font-bold text-slate-500">
                    Basic analysis will generate descriptive statistics (mean, median, unique values, missing values, etc.) for all columns in the dataset. No variable configuration is required.
                  </p>
                  
                  {/* 🔙 BACK & RUN */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setStep(2);
                        setXAxis([]);
                        setYAxis("");
                      }}
                      className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all flex-1"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRun}
                      disabled={loading}
                      className="h-11 px-6 rounded-xl bg-[#1e3a8a] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:bg-[#1a337a] transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="flex items-center gap-0.5 h-4">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 rounded-full bg-white"
                                style={{ height: "4px" }}
                                animate={{
                                  height: [4, 14, 4]
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: i * 0.15
                                }}
                              />
                            ))}
                          </div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white animate-pulse" />
                          Run Analysis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
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
                  { id: "bar", label: "Bar", icon: BarChart3 },
                  { id: "line", label: "Line", icon: Settings2 },
                  { id: "scatter", label: "Scatter", icon: Database },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all",
                      chartType === type.id
                        ? "bg-white text-[#1e3a8a] shadow-sm font-black ring-1 ring-slate-200"
                        : "text-slate-400 hover:text-slate-600 font-bold",
                    )}
                  >
                    <type.icon className="w-4.5 h-4.5" />
                    <span className="text-[10px] uppercase tracking-widest">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-slate-900 text-[13px] font-black">
                      Exclude Outliers
                    </p>
                    <p className="text-slate-400 text-[11px] font-bold">
                      Remove values {">"} 3 SD
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#1e3a8a] scale-90"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-slate-900 text-[13px] font-black">
                      Show Confidence Int.
                    </p>
                    <p className="text-slate-400 text-[11px] font-bold">
                      95% CI shading
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#1e3a8a] scale-90" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Preview */}
        {selectedDataset && tableData && tableData.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Preview</h2>
            </div>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/30 overflow-hidden">
              <DataPreviewTable data={tableData} columns={tableColumns} />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Running Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center gap-8 z-[9999] transition-all duration-300 animate-in fade-in">
          {/* Waveform container */}
          <div className="flex items-center gap-2 h-28">
            {[...Array(15)].map((_, i) => {
              const shieldHeights = [16, 24, 42, 60, 76, 84, 72, 54, 72, 84, 76, 60, 42, 24, 16];
              const undulateHeights = [
                40 + Math.sin(i * 0.6 + 0.0) * 22,
                40 + Math.sin(i * 0.6 + 1.5) * 22,
                40 + Math.sin(i * 0.6 + 3.0) * 22,
                40 + Math.sin(i * 0.6 + 4.5) * 22,
                shieldHeights[i],
                shieldHeights[i],
                40 + Math.sin(i * 0.6 + 6.0) * 22,
                40 + Math.sin(i * 0.6 + 7.5) * 22,
              ];
              return (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 via-blue-500 to-purple-600"
                  animate={{
                    height: undulateHeights
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
          <div className="space-y-1.5 text-center">
            <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase animate-pulse">Learning Engagement</h3>
            <p className="text-[11px] font-bold text-slate-400 max-w-[240px]">AI agent syncing with classroom dataset...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
