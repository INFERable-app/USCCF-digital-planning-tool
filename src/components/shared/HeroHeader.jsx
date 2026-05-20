const IMG_LOGO = '/images/uscoc-logo.png';
const IMG_PROFILE = '/images/profile-icon.png';
const IMG_TPM_MAN = '/images/tpm-man.jpg';

export default function HeroHeader() {
	return (
		<div className="top-hero">
			<div className="header-bar">
				<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="logo" />
				<img src={IMG_PROFILE} alt="Profile" className="profile-icon" />
			</div>
			<p className="app-title">Digital Transformation Planning Tool</p>
			<div className="hero-image-wrap">
				<img src={IMG_TPM_MAN} alt="" className="hero-image" />
			</div>
		</div>
	);
}
