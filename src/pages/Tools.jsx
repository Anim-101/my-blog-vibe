import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cloud, Sparkles, Network, Terminal, GitBranch, Globe } from 'lucide-react';
import './Tools.css';

const Tools = () => {
  const { t } = useTranslation();

  return (
    <div className="tools-page container">
      {/* Sub Navbar */}
      <div className="tools-subnav" data-testid="tools-subnav">
        <NavLink 
          to="/tools/designer" 
          className={({ isActive }) => `tools-subnav-btn ${isActive ? 'active' : ''}`}
        >
          <Cloud size={16} />
          <span>{t('nav.designer')}</span>
        </NavLink>
        <NavLink 
          to="/tools/agents" 
          className={({ isActive }) => `tools-subnav-btn ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          <span>{t('nav.agents')}</span>
        </NavLink>
        <NavLink 
          to="/tools/systems" 
          className={({ isActive }) => `tools-subnav-btn ${isActive ? 'active' : ''}`}
        >
          <Network size={16} />
          <span>{t('nav.systems')}</span>
        </NavLink>
        <NavLink 
          to="/tools/compiler" 
          className={({ isActive }) => `tools-subnav-btn ${isActive ? 'active' : ''}`}
        >
          <Terminal size={16} />
          <span>{t('nav.compiler')}</span>
        </NavLink>
        <NavLink 
          to="/tools/git" 
          className={({ isActive }) => `tools-subnav-btn ${isActive ? 'active' : ''}`}
        >
          <GitBranch size={16} />
          <span>{t('nav.git')}</span>
        </NavLink>
        <NavLink 
          to="/tools/api" 
          className={({ isActive }) => `tools-subnav-btn ${isActive ? 'active' : ''}`}
        >
          <Globe size={16} />
          <span>{t('nav.apiClient')}</span>
        </NavLink>
      </div>

      {/* Main Content Area */}
      <div className="tools-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Tools;
