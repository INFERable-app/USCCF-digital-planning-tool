import './SignInScreen.css';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext.jsx';

const IMG_LOGO = '/images/uscoc-logo.png';

function GoogleIcon() {
	return (
		<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
			<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
			<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
			<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
			<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
		</svg>
	);
}

function MicrosoftIcon() {
	return (
		<svg viewBox="0 0 21 21" width="22" height="22" aria-hidden="true">
			<rect x="1" y="1" width="9" height="9" fill="#F25022" />
			<rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
			<rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
			<rect x="11" y="11" width="9" height="9" fill="#FFB900" />
		</svg>
	);
}

function AppleIcon() {
	return (
		<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
			<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04l-.06.27zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
		</svg>
	);
}

export default function SignInScreen() {
	const { signIn } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [staySignedIn, setStaySignedIn] = useState(true);

	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
				}).then(r => r.json());
				signIn(profile, staySignedIn);
			} catch {
				setError('Sign-in failed. Please try again.');
			} finally {
				setLoading(false);
			}
		},
		onError: () => {
			setError('Sign-in failed. Please try again.');
			setLoading(false);
		},
	});

	return (
		<div className="signin-screen">
			<div className="signin-card">
				<div className="signin-header">
					<img src={IMG_LOGO} alt="U.S. Chamber of Commerce Foundation" className="signin-logo" />
				</div>

				<div className="signin-body">
					<h1 className="signin-title">Digital Transformation Planning Tool</h1>

					<div className="signin-providers">
						<button
							className="signin-provider-btn"
							onClick={() => { setError(null); setLoading(true); googleLogin(); }}
							disabled={loading}
						>
							<GoogleIcon />
							<span>{loading ? 'Signing in…' : 'Continue with Google'}</span>
						</button>
						<button className="signin-provider-btn" disabled>
							<MicrosoftIcon />
							<span>Continue with Microsoft</span>
						</button>
						<button className="signin-provider-btn" disabled>
							<AppleIcon />
							<span>Continue with Apple</span>
						</button>
					</div>

					{error && <p className="signin-error">{error}</p>}

					<label className="signin-stay">
						<input
							type="checkbox"
							checked={staySignedIn}
							onChange={e => setStaySignedIn(e.target.checked)}
						/>
						<span>Stay signed in</span>
					</label>

					<hr className="signin-divider" />

					<p className="signin-disclaimer">
						Log in using one of the providers above to access the tool. We store your authenticated email address to allow you to return to the tool in the future and pick up where you left off.
					</p>
					<p className="signin-disclaimer">
						(If using Apple's "Hide My Email" feature, the tool only stores a unique hidden forwarding email created by apple rather than your primary email.)
					</p>
				</div>
			</div>
		</div>
	);
}
