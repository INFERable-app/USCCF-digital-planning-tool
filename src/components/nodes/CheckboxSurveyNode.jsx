import '../shared/survey.css';
import { useState } from 'react';
import CompactHeader from '../shared/CompactHeader.jsx';
import CheckboxEdge from '../edges/CheckboxEdge.jsx';

export default function CheckboxSurveyNode({ node, edges, nodeEdges, advance, onBack }) {
	const [selected, setSelected] = useState(new Set());
	const submitEdge = edges[node.submitEdgeId];

	function handleToggle(edgeId) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(edgeId)) next.delete(edgeId);
			else next.add(edgeId);
			return next;
		});
	}

	return (
		<div className="screen screen-compact">
			<CompactHeader onBack={onBack} />
			<div className="survey-content">
				<p className="survey-question">{node.question}</p>
				<div className="checkbox-list">
					{nodeEdges.map((edge) => (
						<CheckboxEdge
							key={edge.id}
							edge={edge}
							checked={selected.has(edge.id)}
							onToggle={handleToggle}
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
					onClick={() => advance(node.submitEdgeId, [...selected])}
				>
					{submitEdge?.label ?? 'Submit'}
				</button>
			</div>
		</div>
	);
}
