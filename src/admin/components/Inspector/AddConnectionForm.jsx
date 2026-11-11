import { useState } from 'react';
import { SelectField, TextField } from '../../../components/editor/Field.jsx';

// Keyboard-operable alternative to dragging from a node's handle: picks a
// target node and a button label, then adds the edge.
export default function AddConnectionForm({ sourceId, nodeIds, onAdd }) {
  const targets = nodeIds.filter((id) => id !== sourceId);
  const [targetId, setTargetId] = useState(targets[0] ?? '');
  const [label, setLabel] = useState('Continue');

  if (targets.length === 0) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!targetId) return;
    onAdd(targetId, label.trim());
  }

  return (
    <form className="inspector-panel__add-connection" onSubmit={handleSubmit}>
      <SelectField
        label="Connect to node"
        value={targetId}
        onChange={setTargetId}
        options={targets.map((id) => ({ value: id }))}
      />
      <TextField label="Button label" value={label} onChange={setLabel} />
      <button type="submit" className="inspector-panel__add-connection-btn">
        Add connection
      </button>
    </form>
  );
}
