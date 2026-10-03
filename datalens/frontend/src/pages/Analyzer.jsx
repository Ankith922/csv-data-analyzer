import { useState } from 'react';
import axios from 'axios';
import { Layers, Columns, AlertTriangle, Copy, FileBarChart2 } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import ColumnInfo from '../components/ColumnInfo';
import Chart from '../components/Chart';
import AIInsights from '../components/AIInsights';

export default function Analyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Unable to read this CSV. Please check that the file contains valid CSV data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart2 className="h-6 w-6 text-primary" />
            Data Analyzer
          </h1>
          <p className="text-slate-500 mt-1">Upload and explore your dataset</p>
        </div>
      </div>

      {!data && <UploadBox onUpload={handleUpload} isLoading={loading} error={error} />}

      {data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex justify-end">
            <button 
              onClick={() => setData(null)}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
            >
              Upload another file
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Rows" 
              value={data.rows.toLocaleString()} 
              icon={Layers} 
              colorClass="bg-blue-50 text-blue-600" 
            />
            <StatCard 
              title="Columns" 
              value={data.columns.toLocaleString()} 
              icon={Columns} 
              colorClass="bg-purple-50 text-purple-600" 
            />
            <StatCard 
              title="Missing Values" 
              value={data.missing_values.toLocaleString()} 
              icon={AlertTriangle} 
              colorClass={data.missing_values > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"} 
            />
            <StatCard 
              title="Duplicates" 
              value={data.duplicate_rows.toLocaleString()} 
              icon={Copy} 
              colorClass={data.duplicate_rows > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DataTable data={data.preview} columns_info={data.columns_info} />
              <Chart data={data.all_data} columns_info={data.columns_info} />
            </div>
            
            <div className="space-y-8">
              <AIInsights summary={data} />
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-900">Missing Values Overview</h3>
                </div>
                <div className="p-4 space-y-4">
                  {Object.keys(data.missing_breakdown).length > 0 && Object.values(data.missing_breakdown).some(v => v > 0) ? (
                    Object.entries(data.missing_breakdown)
                      .sort((a, b) => b[1] - a[1])
                      .filter(([_, count]) => count > 0)
                      .map(([col, count]) => (
                        <div key={col}>
                          <div className="flex justify-between text-sm mb-1 text-slate-700">
                            <span>{col}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-amber-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (count / data.rows) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 py-2">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="text-sm font-medium">No missing values detected.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ColumnInfo columns_info={data.columns_info} />

        </div>
      )}
    </div>
  );
}

// Needed CheckCircle2 import
import { CheckCircle2 } from 'lucide-react';
