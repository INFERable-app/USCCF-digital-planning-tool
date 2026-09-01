import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function CtaButtonEdge({ edge, advance, disabled }) {
	const { editMode, setEdgeField } = useEditMode();
	if (!edge) return null;

	return (
		<button
			className="btn-primary"
			onClick={() => !editMode && advance(edge.id)}
			disabled={!editMode && disabled}
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
