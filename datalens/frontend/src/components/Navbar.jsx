import { Link } from 'react-router-dom';
import { Database, UploadCloud } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">DataLens</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/analyzer" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Analyzer
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/analyzer" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary gap-2 transition-colors">
              <UploadCloud className="h-4 w-4" />
              Upload CSV
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
