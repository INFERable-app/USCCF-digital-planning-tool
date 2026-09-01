import './EditableEdgeList.css';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EdgeControls from './EdgeControls.jsx';
import AddButtonPopover from './AddButtonPopover.jsx';

// Wraps a screen's option list in edit mode: each option keeps its normal
// appearance and gains a reorder grip, a "go to destination" chip and an
// overflow menu, with an Add button underneath.
export default function EditableEdgeList({ nodeId, nodeEdges, nodes, className, children }) {
	const { editMode, reorderButtons, addButton, goToNode } = useEditMode();
	const [dragId, setDragId] = useState(null);
	const [adding, setAdding] = useState(false);

	if (!editMode) return <div className={className}>{children}</div>;

	function handleDrop(overId) {
		if (!dragId || dragId === overId) return;
		const ordered = nodeEdges.map((e) => e.id);
		const from = ordered.indexOf(dragId);
		const to = ordered.indexOf(overId);
		if (from === -1 || to === -1) return;
		ordered.splice(to, 0, ordered.splice(from, 1)[0]);
		reorderButtons(nodeId, ordered);
		setDragId(null);
	}

	const rendered = Array.isArray(children) ? children : [children];

	return (
		<div className={`${className ?? ''} edge-list--editing`.trim()}>
			{nodeEdges.map((edge, i) => (
				<div
					key={edge.id}
					className="edge-list__row"
					onDragOver={(e) => e.preventDefault()}
					onDrop={() => handleDrop(edge.id)}
				>
					<EdgeControls edge={edge} sourceId={nodeId} nodes={nodes} onDragStart={setDragId}>
						{rendered[i]}
					</EdgeControls>
				</div>
			))}

			<button type="button" className="edge-list__add" onClick={() => setAdding(true)}>
				<Plus size={16} />
				Add button
			</button>

			{adding && (
				<AddButtonPopover
					onCancel={() => setAdding(false)}
					onAdd={(label, type) => {
						setAdding(false);
						const newNodeId = addButton(nodeId, label, type);
						if (newNodeId) goToNode(newNodeId);
					}}
				/>
			)}
		</div>
	);
}
