const IMG_LOGO = '/images/uscoc-logo.png';
const IMG_PROFILE = '/images/profile-icon.png';

export default function CompactHeader() {
	return (
		<div className="compact-header">
			<div className="header-bar">
				<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="logo" />
				<img src={IMG_PROFILE} alt="Profile" className="profile-icon" />
			</div>
			<p className="app-title">Digital Transformation Planning Tool</p>
		</div>
	);
}
