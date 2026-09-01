import { useEditMode } from '../../contexts/EditModeContext.jsx';
import EditableText from '../edit/EditableText.jsx';

export default function CheckboxEdge({ edge, checked, onToggle }) {
	const { setEdgeField } = useEditMode();

	return (
		<label className="checkbox-option">
			<input type="checkbox" checked={checked} onChange={() => onToggle(edge.id)} />
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
