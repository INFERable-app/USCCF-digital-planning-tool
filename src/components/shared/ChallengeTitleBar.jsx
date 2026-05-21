import './ChallengeTitleBar.css';
export default function ChallengeTitleBar({ challengeLabel }) {
	return (
		<div className="challenge-title-bar">
			<p className="challenge-title">{challengeLabel}</p>
			<div className="challenge-divider" />
		</div>
	);
}
