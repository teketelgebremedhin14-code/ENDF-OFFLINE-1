import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#ef4444', background: '#020617', height: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Critical Failure</h1>
          <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '20px' }}>The Nexus command interface encountered an unrecoverable error.</p>
          <pre style={{ overflow: 'auto', background: '#0f172a', padding: '20px', borderRadius: '4px', border: '1px solid #1e293b', maxWidth: '800px', width: '90%', fontSize: '12px', textAlign: 'left' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '30px', padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '2px', color: 'white', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);