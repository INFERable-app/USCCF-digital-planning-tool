// Builds a navigable tree of use cases by walking forward from the wizard's
// start node through its live graph data. Nodes with a single edge and no
// real choice (e.g. "welcome") are passed through silently; the first
// multiChoice node(s) reached become the top of the tree. Every edge on a
// multiChoice node becomes a row — disabled edges render but don't recurse
// or resolve to a jump target, matching how disabled choices already render
// elsewhere in the wizard. An edge targeting another multiChoice node nests
// further as long as maxDepth allows; once maxDepth is reached the row is
// terminal (navigable, no further children) regardless of its target's type.
// Every row carries its own edgePath — the ordered edge ids from the start
// node down to that row — so a jump can replay the exact chain the user
// clicked instead of guessing a path by target node id alone.
//
// No node IDs are hardcoded, so the tree automatically reflects whatever the
// live graph contains (new roles/challenges appear with no code change).
const MAX_TREE_DEPTH = 2;

export function buildUseCaseTree(nodes, edges, startNodeId, maxDepth = MAX_TREE_DEPTH) {
	if (!startNodeId || !nodes[startNodeId]) return [];
	return walk(startNodeId, new Set([startNodeId]), 0, []);

	function walk(nodeId, visited, depth, edgePath) {
		const node = nodes[nodeId];
		if (!node) return [];

		if (node.type !== 'multiChoice') {
			const [firstEdgeId] = node.edgeIds ?? [];
			const edge = firstEdgeId ? edges[firstEdgeId] : null;
			if (!edge || visited.has(edge.targetNodeId)) return [];
			return walk(edge.targetNodeId, new Set(visited).add(edge.targetNodeId), depth, [...edgePath, edge.id]);
		}

		return (node.edgeIds ?? [])
			.map((edgeId) => edges[edgeId])
			.filter(Boolean)
			.map((edge) => buildRow(edge, visited, depth, edgePath));
	}

	function buildRow(edge, visited, depth, edgePath) {
		const disabled = !!edge.disabled;
		const targetNode = nodes[edge.targetNodeId];
		const path = [...edgePath, edge.id];
		const row = {
			id: edge.id,
			label: edge.label,
			disabled,
			storeKey: edge.storeKey,
			value: edge.value,
			children: null,
			targetNodeId: null,
			edgePath: path,
		};

		if (disabled || !targetNode || visited.has(edge.targetNodeId)) return row;

		row.targetNodeId = edge.targetNodeId;

		const isBranch = targetNode.type === 'multiChoice' && depth + 1 < maxDepth;
		if (isBranch) {
			row.children = walk(edge.targetNodeId, new Set(visited).add(edge.targetNodeId), depth + 1, path);
		}
		return row;
	}
}
