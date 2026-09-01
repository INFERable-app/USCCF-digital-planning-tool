import '../shared/survey.css';
import { useState } from 'react';
import CompactHeader from '../shared/CompactHeader.jsx';
import CheckboxEdge from '../edges/CheckboxEdge.jsx';
import EditableText from '../edit/EditableText.jsx';
import EditableEdgeList from '../edit/EditableEdgeList.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function CheckboxSurveyNode({
	node,
	nodes,
	edges,
	nodeEdges,
	advance,
	onBack,
	isStartNode
}) {
	const [selected, setSelected] = useState(new Set());
	const { editMode, setNodeField, setEdgeField } = useEditMode();
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
				<ScreenActions node={node} isStartNode={isStartNode} />
				<EditableText
					className="survey-question"
					value={node.question}
					placeholder="Question"
					onCommit={(v) => setNodeField(node.id, 'question', v)}
				/>
				<EditableEdgeList
					className="checkbox-list"
					nodeId={node.id}
					nodeEdges={nodeEdges}
					nodes={nodes}
				>
					{nodeEdges.map((edge) => (
						<CheckboxEdge
							key={edge.id}
							edge={edge}
							checked={selected.has(edge.id)}
							onToggle={handleToggle}
						/>
					))}
				</EditableEdgeList>
			</div>
			<div className="bottom-cta">
				{onBack && (
					<button className="btn-secondary cta-back" onClick={onBack}>
						‹ Back
					</button>
				)}
				<button
					className="btn-primary"
					onClick={() => !editMode && advance(node.submitEdgeId, [...selected])}
				>
					<EditableText
						as="span"
						value={submitEdge?.label ?? 'Submit'}
						multiline={false}
						placeholder="Submit"
						onCommit={(v) => submitEdge && setEdgeField(submitEdge.id, 'label', v)}
					/>
				</button>
			</div>
		</div>
	);
}
