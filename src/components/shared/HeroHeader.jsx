import './HeroHeader.css';
import UserMenu from '../auth/UserMenu.jsx';
import ResourceSidebar from './ResourceSidebar.jsx';
import { useDrawer } from '../../contexts/DrawerContext.jsx';
import { Menu } from 'lucide-react';
const IMG_LOGO = '/images/uscoc-logo.png';
const IMG_TPM_MAN = '/images/tpm-man.jpg';

export default function HeroHeader({ onBack }) {
	const { toggle } = useDrawer();
	return (
		<div className="top-hero">
			<div className="header-bar">
				<div className="header-start">
					{onBack && <button className="btn-back" onClick={onBack}>‹ Back</button>}
					<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="logo" />
				</div>
				<UserMenu />
			</div>
			<p className="app-title">Digital Transformation Planning Tool</p>
			<div className="hero-image-wrap">
				<img src={IMG_TPM_MAN} alt="" className="hero-image" />
			</div>
			<ResourceSidebar />
			<button className="sidebar-open-btn" onClick={toggle} aria-label="Open resource panel">
				<Menu size={20} />
			</button>
		</div>
	);
}
