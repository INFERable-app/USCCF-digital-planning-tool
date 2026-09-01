import '../shared/survey.css';
import '../edit/EditResultsButton.css';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import CompactHeader from '../shared/CompactHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import ResourceItem from '../shared/ResourceItem.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import ResultsEditSheet from '../edit/ResultsEditSheet.jsx';
import { resolveResult } from '../../graph/resolveResult.js';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function ResultsNode({ node, answers, onBack, previousAnswerLabel, isStartNode }) {
	const { editMode, setNodeField } = useEditMode();
	const [editingResults, setEditingResults] = useState(false);
	const result = resolveResult(node.resolvers, answers);
	const matchedIndex = (node.resolvers ?? []).indexOf(result);

	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			<div className="survey-content">
				<ScreenActions node={node} isStartNode={isStartNode} />
				<PreviousAnswerHeading label={previousAnswerLabel} />
				<p className="results-label">Recommended next step:</p>
				{result.recommendation && (
					<>
						<p className="results-recommendation">{result.recommendation}</p>
					</>
				)}
				{result.bodyText && <p className="body-text">{result.bodyText}</p>}
				{result.videoUrl && <VideoCard url={result.videoUrl} alt={result.videoAlt} />}
				{result.resources &&
					result.resources.map((item, i) => <ResourceItem key={i} item={item} />)}
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
				<p className="recommendation-next-text">
					After you perform the recommended step, return to the tool when you need more guidance.
				</p>
				{editMode && (
					<button
						type="button"
						className="edit-results-btn"
						onClick={() => setEditingResults(true)}
					>
						<Pencil size={14} />
						Edit results content
					</button>
				)}
			</div>
			<div className="bottom-cta">
				{onBack && (
					<button className="btn-secondary cta-back" onClick={onBack}>
						‹ Back
					</button>
				)}
			</div>
			{editingResults && (
				<ResultsEditSheet
					node={node}
					matchedIndex={matchedIndex}
					onChange={(resolvers) => setNodeField(node.id, 'resolvers', resolvers)}
					onClose={() => setEditingResults(false)}
				/>
			)}
		</div>
	);
}
