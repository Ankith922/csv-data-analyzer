import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function AIInsights({ summary }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/insights', {
          summary: summary
        });
        setInsights(response.data.insights);
      } catch (err) {
        setError("Could not load AI Insights at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [summary]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden mt-8">
      <div className="p-4 border-b border-indigo-50 bg-indigo-50 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-indigo-900">AI Insights</h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700">
                <span className="text-xl">💡</span>
                <p className="leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
