// Compares an edited draft against the graph as it was loaded and returns the
// ordered list of writes needed to make the server match. Only touched screens
// and buttons produce a request, so two admins editing different screens do not
// overwrite each other.

const NODE_IGNORED_FIELDS = new Set(['id']);

function sameValue(a, b) {
	if (a === b) return true;
	if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
	return JSON.stringify(a) === JSON.stringify(b);
}

function changedFields(before, after, ignored) {
	const fields = {};
	const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
	for (const key of keys) {
		if (ignored.has(key)) continue;
		if (!sameValue(before[key], after[key])) {
			// A key present before but gone now is cleared, not left alone.
			fields[key] = after[key] === undefined ? null : after[key];
		}
	}
	return fields;
}

// A persisted edge carries no source — ownership is implicit in the source
// node's edgeIds array, so it has to be recovered by search.
function findSourceId(graph, edgeId) {
	for (const node of Object.values(graph.nodes)) {
		if (node.edgeIds.includes(edgeId)) return node.id;
	}
	return null;
}

export function diffGraph(baseline, draft) {
	const ops = [];

	// 1. New screens first, so buttons can point at them.
	for (const node of Object.values(draft.nodes)) {
		if (!baseline.nodes[node.id]) ops.push({ op: 'createNode', node });
	}

	// 2. New buttons.
	for (const edge of Object.values(draft.edges)) {
		if (baseline.edges[edge.id]) continue;
		const sourceId = findSourceId(draft, edge.id);
		if (sourceId) ops.push({ op: 'createEdge', sourceId, edge });
	}

	// 3. Screen edits, including edgeIds order (which the server writes as the
	//    relationship order, so it must land after the new buttons exist).
	for (const node of Object.values(draft.nodes)) {
		const before = baseline.nodes[node.id];
		if (!before) continue;
		const fields = changedFields(before, node, NODE_IGNORED_FIELDS);
		if (Object.keys(fields).length > 0) ops.push({ op: 'updateNode', id: node.id, fields });
	}

	// 4. Button edits.
	for (const edge of Object.values(draft.edges)) {
		const before = baseline.edges[edge.id];
		if (!before) continue;
		const fields = changedFields(before, edge, new Set(['id']));
		if (Object.keys(fields).length > 0) ops.push({ op: 'updateEdge', id: edge.id, fields });
	}

	// 5. Removals last, buttons before the screens they hang off.
	for (const edgeId of Object.keys(baseline.edges)) {
		if (!draft.edges[edgeId]) ops.push({ op: 'deleteEdge', id: edgeId });
	}
	for (const nodeId of Object.keys(baseline.nodes)) {
		if (!draft.nodes[nodeId]) ops.push({ op: 'deleteNode', id: nodeId });
	}

	return ops;
}
