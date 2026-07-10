import '../shared/survey.css';
import { useState } from 'react';
import CompactHeader from '../shared/CompactHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import RadioEdge from '../edges/RadioEdge.jsx';

export default function RadioSurveyNode({ node, nodeEdges, advance, onBack, previousAnswerLabel }) {
	const [selectedEdgeId, setSelectedEdgeId] = useState(null);

	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			<div className="survey-content">
				<PreviousAnswerHeading label={previousAnswerLabel} />
				{node.intro && <p className="body-text">{node.intro}</p>}
				<p className="survey-question">{node.question}</p>
				<div className="radio-list">
					{nodeEdges.map((edge) => (
						<RadioEdge
							key={edge.id}
							edge={edge}
							selected={selectedEdgeId === edge.id}
							onSelect={setSelectedEdgeId}
						/>
					))}
				</div>
			</div>
			<div className="bottom-cta">
				{onBack && (
					<button className="btn-secondary cta-back" onClick={onBack}>
						‹ Back
					</button>
				)}
				<button
					className="btn-primary"
					onClick={() => selectedEdgeId && advance(selectedEdgeId)}
					disabled={!selectedEdgeId}
				>
					{node.submitLabel ?? 'Next'}
				</button>
			</div>
		</div>
	);
}
