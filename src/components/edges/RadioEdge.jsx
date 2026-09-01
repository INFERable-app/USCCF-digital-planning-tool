import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function RadioEdge({ edge, selected, onSelect }) {
	const { setEdgeField } = useEditMode();

	return (
		<label className="radio-option">
			<input
				type="radio"
				name="radio-survey"
				checked={selected}
				onChange={() => onSelect(edge.id)}
			/>
			<EditableText
				as="span"
				value={edge.label}
				multiline={false}
				placeholder="Option text"
				onCommit={(next) => setEdgeField(edge.id, 'label', next)}
			/>
		</label>
	);
}
