import { sanitizeResolvers } from '../components/editor/ResolversEditor/resolverSanitize.js';

const REQUESTS = {
	createNode: (op) => ['/api/graph/nodes', 'POST', { node: cleanNode(op.node) }],
	updateNode: (op) => [
		`/api/graph/nodes/${encodeURIComponent(op.id)}`,
		'PATCH',
		cleanNode(op.fields)
	],
	deleteNode: (op) => [`/api/graph/nodes/${encodeURIComponent(op.id)}`, 'DELETE', null],
	createEdge: (op) => ['/api/graph/edges', 'POST', { sourceId: op.sourceId, edge: op.edge }],
	updateEdge: (op) => [`/api/graph/edges/${encodeURIComponent(op.id)}`, 'PATCH', op.fields],
	deleteEdge: (op) => [`/api/graph/edges/${encodeURIComponent(op.id)}`, 'DELETE', null]
};

// Drops the client-only _key markers the resolver editor uses for list identity
// and discards incomplete resource rows, the same way the graph editor does on
// its own save.
function cleanNode(node) {
	if (!node || node.resolvers === undefined) return node;
	return { ...node, resolvers: node.resolvers === null ? null : sanitizeResolvers(node.resolvers) };
}

// Sends the ops in order and stops at the first failure so a later write can
// never depend on an earlier one that did not land. The caller keeps the draft,
// so the admin can fix the problem and press Save again.
export async function applyGraphOps(ops) {
	let applied = 0;
	for (const op of ops) {
		const build = REQUESTS[op.op];
		if (!build) throw new Error(`Unknown graph op "${op.op}"`);
		const [url, method, body] = build(op);

		const res = await fetch(url, {
			method,
			credentials: 'include',
			...(body === null
				? {}
				: { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
		});

		if (!res.ok) {
			if (res.status === 403) {
				throw Object.assign(new Error('You do not have permission to save changes.'), { applied });
			}
			const err = await res.json().catch(() => ({}));
			throw Object.assign(new Error(err.error || `Request failed (${res.status})`), { applied });
		}
		applied += 1;
	}
	return applied;
}
