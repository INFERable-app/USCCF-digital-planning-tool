import '../shared/survey.css';
import CompactHeader from '../shared/CompactHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import CtaButtonEdge from '../edges/CtaButtonEdge.jsx';
import EditableText from '../edit/EditableText.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function VideoInfoNode({
	node,
	nodeEdges,
	advance,
	onBack,
	previousAnswerLabel,
	isStartNode
}) {
	const { editMode, setNodeField } = useEditMode();

	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			<div className="survey-content">
				<ScreenActions node={node} isStartNode={isStartNode} />
				<PreviousAnswerHeading label={previousAnswerLabel} />
				<EditableText
					className="body-text"
					value={node.intro}
					placeholder="Intro text (optional)"
					onCommit={(v) => setNodeField(node.id, 'intro', v)}
				/>
				<VideoCard url={node.videoUrl} alt={node.videoAlt} />
				{editMode && (
					<div className="video-edit-fields">
						<EditableText
							className="video-edit-field"
							value={node.videoUrl}
							multiline={false}
							placeholder="Video URL"
							onCommit={(v) => setNodeField(node.id, 'videoUrl', v)}
						/>
						<EditableText
							className="video-edit-field"
							value={node.videoAlt}
							multiline={false}
							placeholder="Video alt text"
							onCommit={(v) => setNodeField(node.id, 'videoAlt', v)}
						/>
					</div>
				)}
				{(editMode || node.linkLabel) && (
					<p className="body-text link-label">
						<EditableText
							as="span"
							value={node.linkLabel}
							multiline={false}
							placeholder="Link label (optional)"
							onCommit={(v) => setNodeField(node.id, 'linkLabel', v)}
						/>
						<br />
						{editMode ? (
							<EditableText
								as="span"
								className="inline-link"
								value={node.linkDisplay}
								multiline={false}
								placeholder="Link display text"
								onCommit={(v) => setNodeField(node.id, 'linkDisplay', v)}
							/>
						) : (
							<a
								href={node.videoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-link"
							>
								{node.linkDisplay}
							</a>
						)}
					</p>
				)}
			</div>
			<div className="bottom-cta">
				<CtaButtonEdge edge={nodeEdges[0]} advance={advance} />
			</div>
		</div>
	);
}
