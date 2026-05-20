export default function CtaButtonEdge({ edge, advance, disabled }) {
	return (
		<button className="btn-primary" onClick={() => advance(edge.id)} disabled={disabled}>
			{edge.label}
		</button>
	);
}
