// Finds the label of the edge that led from the previous screen to the
// current one, so the next screen can show what the user just selected.
// Only meaningful when the previous node was an actual question — multiChoice
// or radioSurvey — not a welcome CTA or a videoInfo continue button.
const ANSWERED_NODE_TYPES = new Set(['multiChoice', 'radioSurvey']);

export function getPreviousAnswerLabel(nodes, edges, history, currentNodeId) {
	const previousNode = nodes[history[history.length - 1]];
	if (!previousNode || !ANSWERED_NODE_TYPES.has(previousNode.type)) return null;

	const edge = (previousNode.edgeIds ?? [])
		.map((edgeId) => edges[edgeId])
		.find((e) => e?.targetNodeId === currentNodeId);
	return edge?.label ?? null;
}
