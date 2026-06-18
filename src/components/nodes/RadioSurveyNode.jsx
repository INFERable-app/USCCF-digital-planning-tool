import '../shared/survey.css';
import { useState } from 'react';
import CompactHeader from '../shared/CompactHeader.jsx';
import ChallengeTitleBar from '../shared/ChallengeTitleBar.jsx';
import RadioEdge from '../edges/RadioEdge.jsx';
import { challengeLabels } from '../../graph/wizardGraph.js';

export default function RadioSurveyNode({ node, nodeEdges, answers, advance, onBack }) {
	const [selectedEdgeId, setSelectedEdgeId] = useState(null);
	const challengeLabel = challengeLabels[answers.challenge] ?? '';

	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			<div className="survey-content">
				{node.challengeBar && <ChallengeTitleBar challengeLabel={challengeLabel} />}
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
