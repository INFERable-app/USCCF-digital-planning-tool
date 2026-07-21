import './InspectorPanel.css';
import { Trash2 } from 'lucide-react';
import NodeCommonFields from './NodeCommonFields.jsx';
import NodeOutgoingEdgesList from './NodeOutgoingEdgesList.jsx';
import EdgeForm from './EdgeForm.jsx';
import WelcomeForm from './nodeForms/WelcomeForm.jsx';
import MultiChoiceForm from './nodeForms/MultiChoiceForm.jsx';
import RadioSurveyForm from './nodeForms/RadioSurveyForm.jsx';
import CheckboxSurveyForm from './nodeForms/CheckboxSurveyForm.jsx';
import VideoInfoForm from './nodeForms/VideoInfoForm.jsx';
import ResultsForm from './nodeForms/ResultsForm.jsx';

const TYPE_FORMS = {
	welcome: WelcomeForm,
	multiChoice: MultiChoiceForm,
	radioSurvey: RadioSurveyForm,
	checkboxSurvey: CheckboxSurveyForm,
	videoInfo: VideoInfoForm,
	results: ResultsForm
};

export default function InspectorPanel({
	selection,
	node,
	edge,
	allNodeIds,
	outgoingEdges,
	onUpdateNodeData,
	onRenameNodeId,
	onReorderNodeEdges,
	onUpdateEdgeData,
	onRenameEdgeId,
	onSelectEdge,
	onClose,
	onRequestDelete
}) {
	if (selection.type === 'node' && node) {
		const TypeForm = TYPE_FORMS[node.data.type];
		return (
			<div className="inspector-panel">
				<div className="inspector-panel__header">
					<h2>NODE / {node.id}</h2>
					<button type="button" className="inspector-panel__close" onClick={onClose}>
						&times;
					</button>
				</div>
				<div className="inspector-panel__body">
					<NodeCommonFields
						node={node}
						onChange={(patch) => onUpdateNodeData(node.id, patch)}
						onRenameId={(newId) => onRenameNodeId(node.id, newId)}
					/>
					{TypeForm && (
						<TypeForm
							node={node}
							outgoingEdges={outgoingEdges}
							onChange={(patch) => onUpdateNodeData(node.id, patch)}
						/>
					)}
					<div>
						<p className="inspector-panel__section-title">Outgoing Edges</p>
						<NodeOutgoingEdgesList
							edges={outgoingEdges}
							onReorder={(orderedIds) => onReorderNodeEdges(node.id, orderedIds)}
							onSelectEdge={onSelectEdge}
						/>
					</div>
				</div>
				<div className="inspector-panel__footer">
					<button
						type="button"
						className="inspector-panel__delete-btn"
						onClick={(e) => onRequestDelete('node', node.id, e)}
					>
						<Trash2 size={13} />
						Delete Node
					</button>
				</div>
			</div>
		);
	}

	if (selection.type === 'edge' && edge) {
		return (
			<div className="inspector-panel">
				<div className="inspector-panel__header">
					<h2>EDGE / {edge.id}</h2>
					<button type="button" className="inspector-panel__close" onClick={onClose}>
						&times;
					</button>
				</div>
				<div className="inspector-panel__body">
					<EdgeForm
						edge={edge}
						nodeOptions={allNodeIds.map((id) => ({ value: id }))}
						onChange={(patch) => onUpdateEdgeData(edge.id, patch)}
						onRenameId={(newId) => onRenameEdgeId(edge.id, newId)}
					/>
				</div>
				<div className="inspector-panel__footer">
					<button
						type="button"
						className="inspector-panel__delete-btn"
						onClick={(e) => onRequestDelete('edge', edge.id, e)}
					>
						<Trash2 size={13} />
						Delete Edge
					</button>
				</div>
			</div>
		);
	}

	return null;
}
