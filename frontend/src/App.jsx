import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-secondary)',
        }}
      >
        <Loader2 size={44} className="spinner" style={{ color: 'var(--accent-gold)' }} />
        <p style={{ fontWeight: 600 }}>Initialisation de CinemApp...</p>
      </div>
    );
  }

  return (
    <FavoritesProvider onNotify={addToast}>
      {!isAuthenticated ? (
        <AuthPage onNotify={addToast} />
      ) : (
        <div className="app-layout">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
      <Toast toasts={toasts} onClose={removeToast} />
    </FavoritesProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
