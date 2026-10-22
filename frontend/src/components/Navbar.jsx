import React, { useState, useRef, useEffect } from 'react';
import { Film, Heart, LogOut, ChevronDown, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { count } = useFavorites();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user) return 'FA';
    const first = user.prenom ? user.prenom.charAt(0).toUpperCase() : '';
    const last = user.nom ? user.nom.charAt(0).toUpperCase() : '';
    return `${first}${last}` || 'U';
  };

  const fullName = user ? `${user.prenom} ${user.nom}` : 'Utilisateur';

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('explore')}>
          <div className="brand-icon">
            <Film size={22} />
          </div>
          <span>CinemApp</span>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Sparkles size={16} />
            <span>Explorer</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={16} />
            <span>Favoris</span>
            <span className="counter-pill">{count}</span>
          </button>
        </div>

        {/* User Dropdown Profile (Required in specification) */}
        <div className="user-menu-wrapper" ref={dropdownRef}>
          <button
            className="user-dropdown-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            id="user-profile-dropdown"
          >
            <div className="avatar-badge">{getInitials()}</div>
            <span className="user-name-text">{fullName}</span>
            <ChevronDown
              size={16}
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                color: 'var(--text-muted)',
              }}
            />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-header-name">{fullName}</div>
                <div className="dropdown-header-email">{user?.email}</div>
              </div>

              <button
                className="dropdown-item"
                onClick={() => {
                  setActiveTab('favorites');
                  setDropdownOpen(false);
                }}
              >
                <Heart size={16} color="var(--accent-gold)" />
                <span>Mes films favoris ({count})</span>
              </button>

              <button
                className="dropdown-item danger"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                id="logout-btn"
              >
                <LogOut size={16} />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
