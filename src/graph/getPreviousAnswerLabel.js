// Finds the label of the edge that led from the previous screen to the
// current one, so the next screen can show what the user just selected.
// Only meaningful when the previous node was an actual question — multiChoice
// or radioSurvey — not a welcome CTA or a videoInfo continue button.
//
// Takes the structural path from getNodePath() rather than session history —
// jumpAlongPath() (sidebar navigation) only records wherever the user was
// standing before the jump, not the node that actually owns the edge being
// replayed, so deriving the previous node from session history silently
// breaks after a sidebar jump. The structural path is recomputed fresh from
// currentNodeId every time and is correct regardless of how the user got here.
const ANSWERED_NODE_TYPES = new Set(['multiChoice', 'radioSurvey']);

export function getPreviousAnswerLabel(nodes, edges, path) {
	if (path.length < 2) return null;

	const previousNode = nodes[path[path.length - 2].nodeId];
	if (!previousNode || !ANSWERED_NODE_TYPES.has(previousNode.type)) return null;

	const edgeId = path[path.length - 1].edgeId;
	return edges[edgeId]?.label ?? null;
}
