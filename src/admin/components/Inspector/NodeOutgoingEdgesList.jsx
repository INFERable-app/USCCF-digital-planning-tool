import './NodeOutgoingEdgesList.css';
import { useState } from 'react';
import { GripVertical } from 'lucide-react';

// Read-only, drag-reorderable list of a node's outgoing edges — replaces the
// legacy free-text "Edge IDs (comma-separated)" field. The capability (view/reorder
// outgoing edges) is preserved; the parallel hand-editable text box is removed since
// it could silently drift out of sync with canvas-driven edge ownership/order.
export default function NodeOutgoingEdgesList({ edges, onReorder, onSelectEdge }) {
	const [dragIndex, setDragIndex] = useState(null);

	if (edges.length === 0) {
		return <p className="node-outgoing-edges__empty">No outgoing edges yet.</p>;
	}

	function handleDrop(overIndex) {
		if (dragIndex === null || dragIndex === overIndex) return;
		const reordered = [...edges];
		const [moved] = reordered.splice(dragIndex, 1);
		reordered.splice(overIndex, 0, moved);
		onReorder(reordered.map((e) => e.id));
		setDragIndex(null);
	}

	return (
		<ul className="node-outgoing-edges">
			{edges.map((edge, i) => (
				<li
					key={edge.id}
					draggable
					onDragStart={() => setDragIndex(i)}
					onDragOver={(e) => e.preventDefault()}
					onDrop={() => handleDrop(i)}
					onClick={() => onSelectEdge(edge.id)}
				>
					<GripVertical size={13} className="node-outgoing-edges__handle" />
					<span className="node-outgoing-edges__label">{edge.label || '(no label)'}</span>
					<span className="node-outgoing-edges__target">→ {edge.targetNodeId}</span>
				</li>
			))}
		</ul>
	);
}
