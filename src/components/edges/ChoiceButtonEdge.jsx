import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function ChoiceButtonEdge({ edge, advance }) {
	const { editMode, setEdgeField } = useEditMode();

	return (
		<button
			className="btn-choice"
			onClick={() => !editMode && advance(edge.id)}
			disabled={!editMode && !!edge.disabled}
		>
			<EditableText
				as="span"
				value={edge.label}
				multiline={false}
				placeholder="Button text"
				onCommit={(next) => setEdgeField(edge.id, 'label', next)}
			/>
		</button>
	);
}
