import '../shared/survey.css';
import CompactHeader from '../shared/CompactHeader.jsx';

export default function ResumeScreen({ user, onResume }) {
	return (
		<div className="screen screen-compact">
			<CompactHeader />
			<div className="survey-content">
				<h1 className="survey-question">Welcome back, {user.name.split(' ')[0]}.</h1>
				<p className="body-text">
					This tool saves your progress automatically, so you can always pick up right where you left off.
				</p>
			</div>
			<div className="bottom-cta">
				<button className="btn-primary" onClick={onResume}>
					Continue where you left off
				</button>
			</div>
		</div>
	);
}
