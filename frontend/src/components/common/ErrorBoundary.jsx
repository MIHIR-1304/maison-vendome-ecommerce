import React from 'react';
import { Sparkles, RefreshCw, ArrowLeft } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Maison Vendôme Uncaught Component Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6 text-slate-900 font-sans">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-amber-900/15 p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center mx-auto shadow-md font-serif text-xl font-bold">
              MV
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-800 block">
                Maison Vendôme Paris
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-slate-950">
                Atelier System Notice
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                An unexpected condition was encountered while loading the client salon. Please refresh to restore connection to our archival catalogue.
              </p>
            </div>

            {/* Error detail for debugging */}
            {this.state.error && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-[11px] font-mono text-slate-600 overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-950 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-colors shadow flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Salon
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-amber-900/20 text-slate-800 text-xs uppercase tracking-widest font-semibold hover:bg-amber-100/40 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
