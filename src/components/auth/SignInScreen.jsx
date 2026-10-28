import { useState } from 'react';
import './SignInScreen.css';
import FoundationLogo from '../shared/FoundationLogo.jsx';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
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

function LockIcon() {
  return (
    <svg
      className="signin-privacy-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="1.5" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      className="signin-privacy-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h4l2.5-7 5 14L17 12h4" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      className="signin-privacy-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="5" x2="5" y2="19" />
      <circle cx="5" cy="9" r="2.3" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <circle cx="12" cy="15" r="2.3" />
      <line x1="19" y1="5" x2="19" y2="19" />
      <circle cx="19" cy="7.5" r="2.3" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      className="signin-privacy-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.8 6.2l-1.7 1.7M7.9 16.1l-1.7 1.7M17.8 17.8l-1.7-1.7M7.9 7.9 6.2 6.2" />
    </svg>
  );
}

export default function SignInScreen() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="signin-screen">
      <div className="signin-card">
        <div className="signin-header">
          <div className="signin-logo" role="img" aria-label="U.S. Chamber of Commerce Foundation">
            <FoundationLogo />
          </div>
        </div>

        <div className="signin-body">
          <h1 className="signin-title">Digital Transformation Planning Tool</h1>

          <div className="signin-intro">
            <p>
              This tool helps workforce intermediaries identify practical next steps for building
              employer collaboratives, aligning skills and training, and strengthening talent
              pipelines. Choose what you are trying to accomplish, then use the recommended
              guidance, tools, and resources to take action.
            </p>
            <p className="signin-tpm-note">
              This tool draws on Talent Pipeline Management&reg; (TPM) principles. If you're new to
              TPM, start with this{' '}
              <a
                href="https://www.uschamberfoundation.org/workforce/tpm-resource-videos"
                target="_blank"
                rel="noopener noreferrer"
              >
                quick overview
              </a>
              .
            </p>
          </div>

          <div className="signin-privacy">
            <span className="signin-privacy-eyebrow">Before you continue</span>
            <h2 className="signin-privacy-title">Data Privacy Notice</h2>

            <div className="signin-privacy-scroll">
              <h3>What Information We Collect</h3>
              <div className="signin-privacy-row">
                <LockIcon />
                <p>
                  <strong>Account Verification:</strong> Your Google account ID is never stored by
                  this app. When you sign in, it is converted into a one-way keyed hash, and only
                  that hash is saved with your progress.
                </p>
              </div>
              <div className="signin-privacy-row">
                <ActivityIcon />
                <p>
                  <strong>Your Progress:</strong> We save your answers and where you are in the
                  tool, so you can pick up where you left off.
                </p>
              </div>

              <h3>How We Use Your Information</h3>
              <div className="signin-privacy-row">
                <SlidersIcon />
                <p>
                  <strong>To Resume Your Plan:</strong> Your saved answers are used only to restore
                  your progress and show the guidance that matches your choices.
                </p>
              </div>
              <div className="signin-privacy-row">
                <GearIcon />
                <p>
                  <strong>While You Are Signed In:</strong> Your name, email address and profile
                  picture are used only during your session, to show who is signed in. They are
                  never written to the database.
                </p>
              </div>

              <h3>Data Storage &amp; Security</h3>
              <p>
                The key used to make the hash is held separately from the database, so your saved
                progress cannot be traced back to your Google account from the stored data.
              </p>
              <p>
                If you are an administrator of this tool, your email address is stored encrypted so
                that admin access can be managed.
              </p>

              <p className="signin-privacy-beta">
                Note: This is a beta test version of the software and is not yet hosted by USCCF.
              </p>

              <h3>Acknowledgement</h3>
              <p>
                By clicking "I Agree", you acknowledge that you understand how this tool uses a
                hashed account ID and your saved progress to let you resume your plan.
              </p>
            </div>

            <label className="signin-stay">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I Agree</span>
            </label>
          </div>

          <div className="signin-providers">
            <button
              className="signin-provider-btn"
              disabled={!agreed}
              onClick={() => {
                window.location.href = '/auth/login';
              }}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
            <button className="signin-provider-btn" disabled hidden>
              <MicrosoftIcon />
              <span>Continue with Microsoft</span>
            </button>
            <button className="signin-provider-btn" disabled hidden>
              <AppleIcon />
              <span>Continue with Apple</span>
            </button>
            <p className={`signin-privacy-hint${agreed ? ' signin-privacy-hint--hidden' : ''}`}>
              Accept the notice above to continue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
