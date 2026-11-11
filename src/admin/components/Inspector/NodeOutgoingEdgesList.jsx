import './NodeOutgoingEdgesList.css';
import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import MoveButtons from '../../../components/edit/MoveButtons.jsx';

// Read-only, drag-reorderable list of a node's outgoing edges — replaces the
// legacy free-text "Edge IDs (comma-separated)" field. The capability (view/reorder
// outgoing edges) is preserved; the parallel hand-editable text box is removed since
// it could silently drift out of sync with canvas-driven edge ownership/order.
export default function NodeOutgoingEdgesList({ edges, onReorder, onSelectEdge }) {
  const [dragIndex, setDragIndex] = useState(null);

  if (edges.length === 0) {
    return <p className="node-outgoing-edges__empty">No outgoing edges yet.</p>;
  }

  function move(fromIndex, toIndex) {
    const reordered = [...edges];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onReorder(reordered.map((e) => e.id));
  }

  function handleDrop(overIndex) {
    if (dragIndex === null || dragIndex === overIndex) return;
    move(dragIndex, overIndex);
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
        >
          <GripVertical size={13} className="node-outgoing-edges__handle" aria-hidden="true" />
          <MoveButtons
            index={i}
            count={edges.length}
            itemLabel={`"${edge.label || edge.id}"`}
            onMove={move}
          />
          <button
            type="button"
            className="node-outgoing-edges__select"
            onClick={() => onSelectEdge(edge.id)}
          >
            <span className="node-outgoing-edges__label">{edge.label || '(no label)'}</span>
            <span className="node-outgoing-edges__target">
              <span aria-hidden="true">→</span>
              <span className="sr-only">to</span> {edge.targetNodeId}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
