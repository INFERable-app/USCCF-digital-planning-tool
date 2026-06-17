export default function RadioEdge({ edge, selected, onSelect }) {
	return (
		<label className="radio-option">
			<input
				type="radio"
				name="radio-survey"
				checked={selected}
				onChange={() => onSelect(edge.id)}
			/>
			<span>{edge.label}</span>
		</label>
	);
}
