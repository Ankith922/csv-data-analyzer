import { Link } from 'react-router-dom';
import { BarChart3, Calculator, BrainCircuit, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-full">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl tracking-tight font-extrabold text-slate-900 sm:text-6xl md:text-7xl">
          <span className="block">Understand Your Data</span>
          <span className="block text-primary mt-2">in Seconds</span>
        </h1>
        <p className="mt-6 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-8 md:text-xl md:max-w-2xl">
          Upload a CSV file and instantly explore your data with statistics, visualizations, and AI-powered insights. No coding required.
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
          <Link
            to="/analyzer"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-hover md:py-4 md:text-lg md:px-10 shadow-lg shadow-primary/30 transition-all hover:-translate-y-1"
          >
            Analyze CSV
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Visualize Data</h3>
            <p className="text-slate-500">
              Create beautiful, interactive charts from your CSV automatically. Discover trends instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Understand Statistics</h3>
            <p className="text-slate-500">
              View important dataset statistics, distributions, and missing value analysis at a glance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Insights</h3>
            <p className="text-slate-500">
              Get simple, human-readable explanations of your data powered by artificial intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
