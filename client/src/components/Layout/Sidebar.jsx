import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  ClipboardList,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/dependents', label: 'Dependents', icon: UserPlus },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const adminItems = [
  { to: '/admin/users', label: 'Manage Users', icon: Shield },
  { to: '/admin/integrity', label: 'Data Integrity', icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarStyle = {
    width: collapsed ? '72px' : 'var(--sidebar-width)',
    minHeight: '100vh',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width var(--transition-slow)',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    overflow: 'hidden',
  };

  const logoStyle = {
    padding: collapsed ? '20px 0' : '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    minHeight: 'var(--header-height)',
  };

  const navStyle = {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const linkBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: collapsed ? '12px 0' : '12px 16px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all var(--transition-normal)',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
  };

  const activeLinkStyle = {
    background: 'var(--accent-gradient-glow)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-glow)',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={logoStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0,
          }}>
            <Zap size={20} color="#fff" />
          </div>
          {!collapsed && (
            <span style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}>
              Creeps Co.
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {collapsed && (
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav style={navStyle}>
        <div style={{ marginBottom: '8px' }}>
          {!collapsed && (
            <p style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              padding: '8px 16px 4px',
              fontWeight: 600,
            }}>
              Main
            </p>
          )}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </div>

        {/* Admin Section */}
        {isAdmin() && (
          <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            {!collapsed && (
              <p style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                padding: '8px 16px 4px',
                fontWeight: 600,
              }}>
                Admin
              </p>
            )}
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  ...linkBaseStyle,
                  ...(isActive ? activeLinkStyle : {}),
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                {!collapsed && item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Footer / Logout */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={handleLogout}
          style={{
            ...linkBaseStyle,
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            color: 'var(--danger)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
