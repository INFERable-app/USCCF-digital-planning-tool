import CompactHeader from '../shared/CompactHeader.jsx';
import ChallengeTitleBar from '../shared/ChallengeTitleBar.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import PromptBlock from '../shared/PromptBlock.jsx';
import { challengeLabels } from '../../graph/wizardGraph.js';
import { resolveResult } from '../../graph/resolveResult.js';

export default function ResultsNode({ node, answers, onBack, onRestart }) {
	const challengeLabel = challengeLabels[answers.challenge] ?? '';
	const result = resolveResult(node.resolvers, answers);

	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			{node.challengeBar && <ChallengeTitleBar challengeLabel={challengeLabel} />}
			<div className="survey-content">
				<p className="results-label">Recommended next step:</p>
				<p className="results-recommendation">{result.recommendation}</p>
				{result.promptBlock && (
					<PromptBlock label={result.promptBlock.label} text={result.promptBlock.text} />
				)}
				{result.videoUrl && <VideoCard url={result.videoUrl} alt={result.videoAlt} />}
				{result.bodyText && <p className="body-text">{result.bodyText}</p>}
				{result.links && result.links.map((item, i) => (
					item.url
						? <a key={i} href={item.url} className="btn-primary" target="_blank" rel="noopener noreferrer">{item.label}</a>
						: <p key={i} className="results-recommendation">{item.label}</p>
				))}
				{result.cta && (
					<a
						href={result.cta.url}
						className="btn-primary"
						target="_blank"
						rel="noopener noreferrer"
					>
						{result.cta.label}
					</a>
				)}
				{result.footer && <p className="results-footer">{result.footer}</p>}
				<button className="btn-secondary" onClick={onRestart}>
					Start Over
				</button>
			</div>
		</div>
	);
}
