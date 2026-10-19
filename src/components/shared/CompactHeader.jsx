import './CompactHeader.css';
import UserMenu from '../auth/UserMenu.jsx';
import UseCaseNav from './UseCaseNav.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import FoundationLogo from './FoundationLogo.jsx';
import { useDrawer } from '../../contexts/DrawerContext.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { Menu } from 'lucide-react';
const IMG_TPM_MAN = '/images/tpm-man.jpg';

export default function CompactHeader({ onBack }) {
  const { toggle } = useDrawer();
  const { goHome } = useWizardNav();
  return (
    <div className="compact-header">
      <div className="header-bar">
        <div className="header-start">
          <button className="mobile-nav-btn" onClick={toggle} aria-label="Open navigation">
            <Menu size={22} />
          </button>
          {onBack && (
            <button className="btn-back" onClick={onBack}>
              ‹ Back
            </button>
          )}
          <button
            type="button"
            className="logo-home-btn"
            onClick={goHome}
            aria-label="U.S. Chamber of Commerce Foundation, Home"
          >
            <FoundationLogo />
          </button>
        </div>
        <UserMenu />
      </div>
      <p className="app-title">Digital Transformation Planning Tool</p>
      <Breadcrumb />
      <div className="compact-hero-wrap" aria-hidden="true">
        <img src={IMG_TPM_MAN} alt="" className="hero-image" />
      </div>
      <UseCaseNav />
      <button className="sidebar-open-btn" onClick={toggle} aria-label="Open resource panel">
        <Menu size={20} />
      </button>
    </div>
  );
}
