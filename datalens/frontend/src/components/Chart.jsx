import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Chart({ data, columns_info }) {
  const [selectedColumn, setSelectedColumn] = useState(columns_info[0]?.name || '');
  const [chartType, setChartType] = useState('bar');

  const columnType = columns_info.find(c => c.name === selectedColumn)?.type;
  
  // Update available chart types based on column type
  const isNumeric = columnType === 'int64' || columnType === 'float64';
  
  const availableChartTypes = isNumeric 
    ? [{ id: 'line', label: 'Line Chart' }, { id: 'bar', label: 'Bar Chart (Histogram)' }]
    : [{ id: 'bar', label: 'Bar Chart' }, { id: 'pie', label: 'Pie Chart' }];

  // Ensure selected chart type is valid for current column
  if (isNumeric && chartType === 'pie') setChartType('bar');
  if (!isNumeric && chartType === 'line') setChartType('bar');

  // Prepare data based on chart type and column
  const chartData = useMemo(() => {
    if (!data || !selectedColumn) return [];

    if (isNumeric) {
      if (chartType === 'line') {
        // Just take the first 50 data points for a line chart to not overload
        return data.slice(0, 50).map((row, i) => ({
          name: `Row ${i+1}`,
          value: Number(row[selectedColumn])
        })).filter(item => !isNaN(item.value));
      } else {
        // Simple histogram (binning)
        const values = data.map(r => Number(r[selectedColumn])).filter(v => !isNaN(v));
        if (values.length === 0) return [];
        
        const min = Math.min(...values);
        const max = Math.max(...values);
        const bins = 10;
        const binSize = (max - min) / bins;
        
        const binnedData = Array.from({ length: bins }).map((_, i) => ({
          name: `${(min + (i * binSize)).toFixed(1)} - ${(min + ((i+1) * binSize)).toFixed(1)}`,
          count: 0
        }));
        
        values.forEach(v => {
          let binIndex = Math.floor((v - min) / binSize);
          if (binIndex >= bins) binIndex = bins - 1; // Put max value in last bin
          if (binnedData[binIndex]) {
            binnedData[binIndex].count++;
          }
        });
        return binnedData;
      }
    } else {
      // Categorical (Bar or Pie) - count frequencies
      const counts = {};
      data.forEach(row => {
        const val = String(row[selectedColumn]);
        counts[val] = (counts[val] || 0) + 1;
      });
      
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 categories
    }
  }, [data, selectedColumn, chartType, isNumeric]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-8">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-semibold text-slate-900">Interactive Charts</h3>
        <div className="flex gap-3">
          <select 
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary shadow-sm"
          >
            {columns_info.map(col => (
              <option key={col.name} value={col.name}>{col.name}</option>
            ))}
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary shadow-sm"
          >
            {availableChartTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="p-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{r: 3, fill: '#3b82f6'}} activeDot={{r: 5}} />
            </LineChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
              <Bar dataKey={isNumeric ? 'count' : 'count'} fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {!isNumeric && chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
