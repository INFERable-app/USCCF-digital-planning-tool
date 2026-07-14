// Computes the path from the graph's start node to a given node by walking
// forward through edgeIds (breadth-first), independent of any session
// history — so it always reflects where a node sits in the tree, regardless
// of how the user actually navigated there. Disabled edges are skipped,
// matching how buildUseCaseTree treats them as non-navigable.
export function getNodePath(nodes, edges, startNodeId, currentNodeId) {
	if (!startNodeId || !currentNodeId || !nodes[startNodeId]) return [];

	const parentEdge = { [startNodeId]: null };
	const queue = [startNodeId];

	while (queue.length > 0) {
		const nodeId = queue.shift();
		if (nodeId === currentNodeId) break;

		const node = nodes[nodeId];
		for (const edgeId of node?.edgeIds ?? []) {
			const edge = edges[edgeId];
			if (!edge || edge.disabled) continue;
			if (edge.targetNodeId in parentEdge) continue;
			parentEdge[edge.targetNodeId] = { from: nodeId, edgeId };
			queue.push(edge.targetNodeId);
		}
	}

	if (!(currentNodeId in parentEdge)) return [];

	const path = [];
	let nodeId = currentNodeId;
	while (nodeId !== null) {
		const entry = parentEdge[nodeId];
		path.unshift({ nodeId, edgeId: entry ? entry.edgeId : null });
		nodeId = entry ? entry.from : null;
	}
	return path;
}
