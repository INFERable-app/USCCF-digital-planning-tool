// Builds a navigable tree of use cases by walking forward from the wizard's
// start node through its live graph data. Nodes with a single edge and no
// real choice (e.g. "welcome") are passed through silently; the first
// multiChoice node(s) reached become the top of the tree. Every edge on a
// multiChoice node becomes a row — disabled edges render but don't recurse
// or resolve to a jump target, matching how disabled choices already render
// elsewhere in the wizard. An edge targeting another multiChoice node nests
// further; anything else is a leaf pointing at the node to jump to.
//
// No node IDs are hardcoded, so the tree automatically reflects whatever the
// live graph contains (new roles/challenges appear with no code change).
export function buildUseCaseTree(nodes, edges, startNodeId) {
	if (!startNodeId || !nodes[startNodeId]) return [];
	return walk(startNodeId, new Set([startNodeId]));

	function walk(nodeId, visited) {
		const node = nodes[nodeId];
		if (!node) return [];

		if (node.type !== 'multiChoice') {
			const [firstEdgeId] = node.edgeIds ?? [];
			const edge = firstEdgeId ? edges[firstEdgeId] : null;
			if (!edge || visited.has(edge.targetNodeId)) return [];
			return walk(edge.targetNodeId, new Set(visited).add(edge.targetNodeId));
		}

		return (node.edgeIds ?? [])
			.map((edgeId) => edges[edgeId])
			.filter(Boolean)
			.map((edge) => buildRow(edge, visited));
	}

	function buildRow(edge, visited) {
		const disabled = !!edge.disabled;
		const targetNode = nodes[edge.targetNodeId];
		const isBranch = targetNode?.type === 'multiChoice';
		const row = {
			id: edge.id,
			label: edge.label,
			disabled,
			storeKey: edge.storeKey,
			value: edge.value,
			children: null,
			leafNodeId: null,
		};

		if (disabled || !targetNode || visited.has(edge.targetNodeId)) return row;

		if (isBranch) {
			row.children = walk(edge.targetNodeId, new Set(visited).add(edge.targetNodeId));
		} else {
			row.leafNodeId = edge.targetNodeId;
		}
		return row;
	}
}
