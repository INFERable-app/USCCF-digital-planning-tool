import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function ChoiceButtonEdge({ edge, advance }) {
  const { editMode, setEdgeField } = useEditMode();

  // In edit mode the button is only a styled frame around its label field, so
  // the field isn't nested inside an interactive control
  if (editMode) {
    return (
      <div className="btn-choice">
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
    <button className="btn-choice" onClick={() => advance(edge.id)} disabled={!!edge.disabled}>
      {edge.label}
    </button>
  );
}
