import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function CtaButtonEdge({ edge, advance, disabled }) {
  const { editMode, setEdgeField } = useEditMode();
  if (!edge) return null;

  // In edit mode the button is only a styled frame around its label field, so
  // the field isn't nested inside an interactive control
  if (editMode) {
    return (
      <div className="btn-primary">
        <EditableText
          as="span"
          value={edge.label}
          multiline={false}
          placeholder="Button text"
          onCommit={(next) => setEdgeField(edge.id, 'label', next)}
        />
      </div>
    );
  }

  return (
    <button className="btn-primary" onClick={() => advance(edge.id)} disabled={disabled}>
      {edge.label}
    </button>
  );
}
