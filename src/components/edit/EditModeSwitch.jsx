import './EditModeSwitch.css';

// On/off switch for the global edit mode, shown in panels that cover the edit-mode bar.
export default function EditModeSwitch({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`edit-switch${checked ? ' edit-switch--on' : ''}`}
      onClick={onToggle}
    >
      <span className="edit-switch__label">Edit mode</span>
      <span className="edit-switch__track" aria-hidden="true">
        <span className="edit-switch__knob" />
      </span>
    </button>
  );
}
