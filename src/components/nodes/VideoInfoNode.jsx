import CompactHeader from '../shared/CompactHeader.jsx';
import ChallengeTitleBar from '../shared/ChallengeTitleBar.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import CtaButtonEdge from '../edges/CtaButtonEdge.jsx';
import { challengeLabels } from '../../graph/wizardGraph.js';

export default function VideoInfoNode({ node, nodeEdges, answers, advance }) {
	const challengeLabel = challengeLabels[answers.challenge] ?? '';

	return (
		<div className="screen screen-compact">
			<CompactHeader />
			{node.challengeBar && <ChallengeTitleBar challengeLabel={challengeLabel} />}
			<div className="survey-content">
				{node.intro && <p className="body-text">{node.intro}</p>}
				<VideoCard url={node.videoUrl} alt={node.videoAlt} />
				{node.linkLabel && (
					<p className="body-text link-label">
						{node.linkLabel}
						<br />
						<a
							href={node.videoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-link"
						>
							{node.linkDisplay}
						</a>
					</p>
				)}
			</div>
			<div className="bottom-cta">
				<CtaButtonEdge edge={nodeEdges[0]} advance={advance} />
			</div>
		</div>
	);
}
