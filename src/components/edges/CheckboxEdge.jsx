export default function CheckboxEdge({ edge, checked, onToggle }) {
	return (
		<label className="checkbox-option">
			<input
				type="checkbox"
				checked={checked}
				onChange={() => onToggle(edge.id)}
			/>
			<span>{edge.label}</span>
		</label>
	);
}
