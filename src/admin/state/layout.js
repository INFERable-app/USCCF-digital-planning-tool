import dagre from '@dagrejs/dagre';
import { measureLabel } from './measureLabel.js';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 60;

function runDagre(nodes, edges, { rankdir = 'LR', nodesep = 70, ranksep = 100 } = {}) {
	const g = new dagre.graphlib.Graph();
	g.setGraph({ rankdir, nodesep, ranksep });
	g.setDefaultEdgeLabel(() => ({}));

	nodes.forEach((node) => {
		g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
	});
	edges.forEach((edge) => {
		if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
			g.setEdge(edge.source, edge.target, measureLabel(edge.label));
		}
	});

	dagre.layout(g);

	const positions = {};
	nodes.forEach((node) => {
		const { x, y } = g.node(node.id);
		// dagre positions are node-center; React Flow positions are top-left.
		positions[node.id] = { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 };
	});
	return positions;
}

// Explicit "Auto-arrange" action — re-lays out every node left-to-right.
export function layoutAll(nodes, edges) {
	const positions = runDagre(nodes, edges);
	return nodes.map((node) => ({ ...node, position: positions[node.id] }));
}

// Runs once per graph load. Only positions nodes that have no saved position yet
// (brand-new nodes, or the whole graph before any manual arrangement has ever been
// saved) — uses the full graph's edges for rank context so a newly-placed node still
// lands in a sensible column relative to its neighbors, but never touches a node
// that already has a saved positionX/positionY.
export function layoutMissing(nodes, edges) {
	const missingIds = new Set(nodes.filter((node) => !node.data.hasPosition).map((node) => node.id));
	if (missingIds.size === 0) return nodes;

	const positions = runDagre(nodes, edges);
	return nodes.map((node) =>
		missingIds.has(node.id) ? { ...node, position: positions[node.id] } : node
	);
}
