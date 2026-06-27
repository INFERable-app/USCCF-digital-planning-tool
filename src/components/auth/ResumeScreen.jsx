import './SignInScreen.css';

const IMG_LOGO = '/images/uscoc-logo.png';

export default function ResumeScreen({ user, nodeLabel, onResume, onStartOver }) {
	return (
		<div className="signin-screen">
			<div className="signin-card">
				<div className="signin-header">
					<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="signin-logo" />
				</div>

				<div className="signin-body">
					<h1 className="signin-title">Welcome back, {user.name.split(' ')[0]}.</h1>

					<p className="signin-disclaimer">
						You were last at: <strong>{nodeLabel}</strong>
					</p>

					<div className="signin-providers">
						<button className="signin-provider-btn" onClick={onResume}>
							<span>Continue where you left off</span>
						</button>
						<button className="signin-provider-btn" onClick={onStartOver}>
							<span>Start over</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
