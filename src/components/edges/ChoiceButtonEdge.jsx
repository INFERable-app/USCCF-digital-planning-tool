export default function ChoiceButtonEdge({ edge, advance }) {
	return (
		<button className="btn-choice" onClick={() => advance(edge.id)}>
			{edge.label}
		</button>
	);
}
