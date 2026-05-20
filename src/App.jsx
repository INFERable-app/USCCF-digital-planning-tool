import { useState } from 'react';

const IMG_TPM_MAN = '/images/tpm-man.jpg';
const IMG_LOGO = '/images/uscoc-logo.png';
const IMG_PROFILE = '/images/profile-icon.png';
const IMG_VIDEO_THUMB = '/images/video-thumbnail.jpg';
const VIDEO_URL = 'https://youtu.be/IzN76ccR0ZA?si=kBpfhzgGsTBBmEY8';

const CHALLENGES = [
	{ id: 'translating', label: 'Translating employer needs into skill requirements' },
	{ id: 'aggregating', label: 'Aggregating skill requirements across employer collaborative' },
	{ id: 'training', label: 'Training providers use different systems and credentials' }
];

const CHALLENGE_LABELS = Object.fromEntries(CHALLENGES.map((c) => [c.id, c.label]));

function HeroHeader() {
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

function CompactHeader() {
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

function ChallengeTitleBar({ challenge }) {
	return (
		<div className="challenge-title-bar">
			<p className="challenge-title">{CHALLENGE_LABELS[challenge]}</p>
			<div className="challenge-divider" />
		</div>
	);
}

function VideoCard({ alt }) {
	return (
		<a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="video-card">
			<img src={IMG_VIDEO_THUMB} alt={alt} className="video-thumb" />
			<div className="play-overlay">
				<svg viewBox="0 0 48 48" className="play-icon" aria-hidden="true">
					<circle cx="24" cy="24" r="24" fill="#FF0000" />
					<path d="M20 16l12 8-12 8V16z" fill="white" />
				</svg>
			</div>
		</a>
	);
}

export default function App() {
	const [step, setStep] = useState('welcome');
	const [challenge, setChallenge] = useState('');
	const [contextOption, setContextOption] = useState('');
	const [tpmAnswer, setTpmAnswer] = useState('');
	const [checkboxAnswers, setCheckboxAnswers] = useState([]);

	function go(next) {
		setStep(next);
		window.scrollTo(0, 0);
	}

	function pickChallenge(val) {
		setChallenge(val);
		go(val === 'aggregating' ? 'checkbox-survey-2' : 'context-survey');
	}

	function submitContext() {
		if (contextOption) go('tpm-certification');
	}

	function submitTpm() {
		if (tpmAnswer) go(tpmAnswer === 'no' ? 'tpm-video' : 'checkbox-survey');
	}

	function toggleCheckbox(val) {
		setCheckboxAnswers((prev) =>
			prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
		);
	}

	function restart() {
		setStep('welcome');
		setChallenge('');
		setContextOption('');
		setTpmAnswer('');
		setCheckboxAnswers([]);
		window.scrollTo(0, 0);
	}

	return (
		<div className="app-shell">
			<div className="phone-frame">

				{step === 'welcome' && (
					<div className="screen">
						<HeroHeader />
						<div className="bottom-section">
							<h1 className="welcome-heading">Welcome to the planning tool.</h1>
							<p className="welcome-body">
								After answering a few quick questions we can get you started on your digital
								transformation.
							</p>
							<button className="btn-primary" onClick={() => go('category')}>
								Let's get started!
							</button>
						</div>
					</div>
				)}

				{step === 'category' && (
					<div className="screen">
						<HeroHeader />
						<div className="bottom-section">
							<p className="question-text">What category best describes your organization?</p>
							<div className="choice-list">
								{['Employer', 'Education Providers', 'Workforce Intermediary', 'Workforce Board', 'State Agency'].map(
									(label) => (
										<button key={label} className="btn-choice" onClick={() => go('role')}>
											{label}
										</button>
									)
								)}
							</div>
						</div>
					</div>
				)}

				{step === 'role' && (
					<div className="screen">
						<HeroHeader />
						<div className="bottom-section">
							<p className="question-text">What is your primary role?</p>
							<div className="choice-list">
								{[
									'Coordinating employer demand',
									'Aligning training with industry needs',
									'Tracking talent pipeline outcomes',
									'Other'
								].map((label) => (
									<button key={label} className="btn-choice" onClick={() => go('challenge')}>
										{label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{step === 'challenge' && (
					<div className="screen">
						<HeroHeader />
						<div className="bottom-section">
							<p className="question-text">
								What challenge do you want to address through digital transformation?
							</p>
							<div className="choice-list">
								{CHALLENGES.map((c) => (
									<button key={c.id} className="btn-choice" onClick={() => pickChallenge(c.id)}>
										{c.label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{step === 'context-survey' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="body-text">
								Helping employers understand and define high-demand skills is a key step in moving
								towards aligning training with industry needs.
							</p>
							<p className="survey-question">What is your current context?</p>
							<div className="radio-list">
								{[
									{
										value: 'few-employers',
										label:
											'We have identified a few employers, but we do not have much collaboration'
									},
									{
										value: 'collaborative-no-tools',
										label:
											"We have formed an employer collaborative, but we don't have many technology tools"
									},
									{
										value: 'collaborative-with-platforms',
										label:
											'We have an employer collaborative that has software platforms to support gathering and sharing information'
									}
								].map((opt) => (
									<label key={opt.value} className="radio-option">
										<input
											type="radio"
											name="context"
											value={opt.value}
											checked={contextOption === opt.value}
											onChange={(e) => setContextOption(e.target.value)}
										/>
										<span>{opt.label}</span>
									</label>
								))}
							</div>
						</div>
						<div className="bottom-cta">
							<button className="btn-primary" onClick={submitContext} disabled={!contextOption}>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 'tpm-certification' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="survey-question">Are you practicing TPM?</p>
							<div className="radio-list">
								{[
									{ value: 'yes', label: 'Yes' },
									{ value: 'no', label: 'No' }
								].map((opt) => (
									<label key={opt.value} className="radio-option">
										<input
											type="radio"
											name="tpm"
											value={opt.value}
											checked={tpmAnswer === opt.value}
											onChange={(e) => setTpmAnswer(e.target.value)}
										/>
										<span>{opt.label}</span>
									</label>
								))}
							</div>
						</div>
						<div className="bottom-cta">
							<button className="btn-primary" onClick={submitTpm} disabled={!tpmAnswer}>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 'tpm-video' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="body-text">
								Before continuing, we recommend watching this video on the TPM program.
							</p>
							<VideoCard alt="TPM Program video thumbnail" />
							<p className="body-text link-label">
								Watch video on the TPM program:
								<br />
								<a
									href={VIDEO_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-link"
								>
									https://youtu.be/IzN76ccR0ZA
								</a>
							</p>
						</div>
						<div className="bottom-cta">
							<button className="btn-primary" onClick={() => go('checkbox-survey')}>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 'checkbox-survey' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="survey-question">
								How do employers provide information? (Check all that apply)
							</p>
							<div className="checkbox-list">
								{[
									{
										value: 'frameworks',
										label: 'Some of our employers use industry-defined skills frameworks'
									},
									{
										value: 'job-descriptions',
										label:
											'Employers often provide job descriptions that do not include skill definitions and how skills differ for entry-level, journeyman, and supervisor'
									},
									{
										value: 'no-language',
										label: 'No common skills language across employer partners'
									}
								].map((opt) => (
									<label key={opt.value} className="checkbox-option">
										<input
											type="checkbox"
											value={opt.value}
											checked={checkboxAnswers.includes(opt.value)}
											onChange={() => toggleCheckbox(opt.value)}
										/>
										<span>{opt.label}</span>
									</label>
								))}
							</div>
						</div>
						<div className="bottom-cta">
							<button className="btn-primary" onClick={() => go('results')}>
								Submit
							</button>
						</div>
					</div>
				)}

				{step === 'results' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="results-label">Recommended next step:</p>
							<p className="results-recommendation">
								Watch video on the importance of communicating skill and credential requirements.
							</p>
							<VideoCard alt="Video thumbnail" />
							<p className="body-text">
								Use a template to capture competencies from employers in a standard way.
							</p>
							<button className="btn-primary">View Template</button>
							<p className="results-footer">
								Return to this tool when you are ready to explore the next step.
							</p>
							<button className="btn-secondary" onClick={restart}>
								Start Over
							</button>
						</div>
					</div>
				)}

				{step === 'checkbox-survey-2' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="survey-question">
								How do you share information with employers? (Check all that apply)
							</p>
							<div className="checkbox-list">
								{[
									{ value: 'meetings', label: 'Collaborative meetings' },
									{ value: 'dashboards', label: 'Dashboards' },
									{ value: 'shared-files', label: 'Shared files' }
								].map((opt) => (
									<label key={opt.value} className="checkbox-option">
										<input
											type="checkbox"
											value={opt.value}
											checked={checkboxAnswers.includes(opt.value)}
											onChange={() => toggleCheckbox(opt.value)}
										/>
										<span>{opt.label}</span>
									</label>
								))}
							</div>
						</div>
						<div className="bottom-cta">
							<button className="btn-primary" onClick={() => go('results-2')}>
								Submit
							</button>
						</div>
					</div>
				)}

				{step === 'results-2' && (
					<div className="screen screen-compact">
						<CompactHeader />
						<ChallengeTitleBar challenge={challenge} />
						<div className="survey-content">
							<p className="results-label">Recommended next step:</p>
							<p className="results-recommendation">Watch video on TPM Web Tools</p>
							<VideoCard alt="TPM Web Tools video thumbnail" />
							<p className="results-footer">
								Return to this tool when you are ready to explore the next step.
							</p>
							<button className="btn-secondary" onClick={restart}>
								Start Over
							</button>
						</div>
					</div>
				)}

			</div>
		</div>
	);
}
