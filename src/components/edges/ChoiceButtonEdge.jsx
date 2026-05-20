export default function ChoiceButtonEdge({ edge, advance }) {
	return (
		<button
			className="btn-choice"
			onClick={() => advance(edge.id)}
			disabled={!!edge.disabled}
		>
			{edge.label}
		</button>
	);
}
