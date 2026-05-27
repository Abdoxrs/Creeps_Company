import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, title = 'Dashboard' }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: 'var(--success)', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: 'var(--danger)', secondary: '#fff' },
          },
        }}
      />
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left var(--transition-slow)',
        minHeight: '100vh',
      }}>
        <Header title={title} />
        <main style={{
          flex: 1,
          padding: '32px',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
