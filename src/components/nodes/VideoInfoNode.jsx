import '../shared/survey.css';
import CompactHeader from '../shared/CompactHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import CtaButtonEdge from '../edges/CtaButtonEdge.jsx';

export default function VideoInfoNode({ node, nodeEdges, advance, onBack, previousAnswerLabel }) {
	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			<div className="survey-content">
				<PreviousAnswerHeading label={previousAnswerLabel} />
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
