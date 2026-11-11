import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function CheckboxEdge({ edge, checked, onToggle }) {
  const { editMode, setEdgeField } = useEditMode();

  // In edit mode the checkbox is a visual preview only, so the label field isn't
  // inside a <label> that already names another control
  if (editMode) {
    return (
      <div className="checkbox-option">
        <input type="checkbox" tabIndex={-1} aria-hidden="true" checked={false} readOnly />
        <EditableText
          as="span"
          value={edge.label}
          multiline={false}
          placeholder="Option text"
          onCommit={(next) => setEdgeField(edge.id, 'label', next)}
        />
      </div>
    );
  }

  return (
    <label className="checkbox-option">
      <input type="checkbox" checked={checked} onChange={() => onToggle(edge.id)} />
      <span>{edge.label}</span>
    </label>
  );
}
