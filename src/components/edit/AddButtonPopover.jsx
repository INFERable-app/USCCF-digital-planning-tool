import './AddButtonPopover.css';
import { useRef, useState } from 'react';
import { NODE_TYPES, nodeTypeMeta } from '../../admin/components/nodes/nodeTypeMeta.js';
import { usePopoverFocus } from '../../hooks/usePopoverFocus.js';

export default function AddButtonPopover({ onAdd, onCancel }) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('multiChoice');
  const formRef = useRef(null);
  usePopoverFocus(formRef, onCancel);

  function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label.trim(), type);
  }

  return (
    <div className="add-button-popover-backdrop" onClick={onCancel}>
      <form
        ref={formRef}
        className="add-button-popover"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-button-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 id="add-button-title" className="add-button-popover__header">
          Add button
        </h2>

        <label htmlFor="add-button-label">Button text</label>
        <input
          id="add-button-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Workforce planning"
          autoFocus
        />

        <label htmlFor="add-button-type">New screen type</label>
        <select id="add-button-type" value={type} onChange={(e) => setType(e.target.value)}>
          {NODE_TYPES.map((t) => (
            <option key={t} value={t}>
              {nodeTypeMeta(t).label}
            </option>
          ))}
        </select>

        <p className="add-button-popover__hint">
          Creates a new screen with placeholder text, links this button to it, and opens it so you
          can fill it in.
        </p>

        <div className="add-button-popover__actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="add-button-popover__submit" disabled={!label.trim()}>
            Add &amp; open
          </button>
        </div>
      </form>
    </div>
  );
}
