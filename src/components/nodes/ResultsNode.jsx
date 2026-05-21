import CompactHeader from '../shared/CompactHeader.jsx';
import ChallengeTitleBar from '../shared/ChallengeTitleBar.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import PromptBlock from '../shared/PromptBlock.jsx';
import ResourceItem from '../shared/ResourceItem.jsx';
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
				{result.recommendation && (
					<>
						<p className="results-label">Recommended next step:</p>
						<p className="results-recommendation">{result.recommendation}</p>
					</>
				)}
				{result.promptBlock && (
					<PromptBlock label={result.promptBlock.label} text={result.promptBlock.text} />
				)}
				{result.videoUrl && <VideoCard url={result.videoUrl} alt={result.videoAlt} />}
				{result.bodyText && <p className="body-text">{result.bodyText}</p>}
				{result.resources && result.resources.map((item, i) => (
					<ResourceItem key={i} item={item} />
				))}
				{result.cta && (
					<a href={result.cta.url} className="btn-primary" target="_blank" rel="noopener noreferrer">
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
