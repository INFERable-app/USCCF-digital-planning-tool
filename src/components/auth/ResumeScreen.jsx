import './SignInScreen.css';

const IMG_LOGO = '/images/uscoc-logo.png';

export default function ResumeScreen({ user, onResume }) {
	return (
		<div className="signin-screen">
			<div className="signin-card">
				<div className="signin-header">
					<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="signin-logo" />
				</div>

				<div className="signin-body">
					<h1 className="signin-title">Welcome back, {user.name.split(' ')[0]}.</h1>

					<p className="signin-disclaimer">
						This tool saves your progress automatically, so you can always pick up right where you left off.
					</p>

					<div className="signin-providers">
						<button className="signin-provider-btn" onClick={onResume}>
							<span>Continue where you left off</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
