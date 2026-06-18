import './CompactHeader.css';
import UserMenu from '../auth/UserMenu.jsx';
import ResourceSidebar from './ResourceSidebar.jsx';
const IMG_LOGO = '/images/uscoc-logo.png';
const IMG_TPM_MAN = '/images/tpm-man.jpg';

export default function CompactHeader({ onBack }) {
	return (
		<div className="compact-header">
			<div className="header-bar">
				<div className="header-start">
					{onBack && <button className="btn-back" onClick={onBack}>‹ Back</button>}
					<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="logo" />
				</div>
				<UserMenu />
			</div>
			<p className="app-title">Digital Transformation Planning Tool</p>
			<div className="compact-hero-wrap" aria-hidden="true">
				<img src={IMG_TPM_MAN} alt="" className="hero-image" />
			</div>
			<ResourceSidebar />
		</div>
	);
}
