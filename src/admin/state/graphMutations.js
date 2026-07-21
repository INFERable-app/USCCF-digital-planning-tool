// Pure functions operating on React Flow's { nodes, edges } arrays. Each returns
// a new { nodes, edges } pair rather than mutating in place.

import { NODE_TYPE_DEFAULTS } from '../components/nodes/nodeTypeMeta.js';

let nextId = 1;

function generateNodeId(nodes) {
	const existing = new Set(nodes.map((n) => n.id));
	let id = `node-${nextId}`;
	while (existing.has(id)) id = `node-${++nextId}`;
	nextId += 1;
	return id;
}

function generateEdgeId(edges, sourceId, targetId) {
	const existing = new Set(edges.map((e) => e.id));
	let id = `e_${sourceId}_${targetId}`;
	let n = 1;
	while (existing.has(id)) id = `e_${sourceId}_${targetId}_${n++}`;
	return id;
}

export function addNode(nodes, edges, { type, position }) {
	const id = generateNodeId(nodes);
	const defaults = NODE_TYPE_DEFAULTS[type] ?? {};
	const newNode = {
		id,
		type: 'graphNode',
		position,
		data: {
			id,
			type,
			layout: 'compact',
			challengeBar: true,
			edgeIds: [],
			hasPosition: true,
			...defaults
		}
	};
	return { nodes: [...nodes, newNode], edges, newNodeId: id };
}

export function addEdge(nodes, edges, { sourceId, targetId, label = '' }) {
	const id = generateEdgeId(edges, sourceId, targetId);
	const order = edges.filter((e) => e.source === sourceId).length;
	const newEdge = {
		id,
		source: sourceId,
		target: targetId,
		label,
		type: 'graphEdge',
		style: { stroke: '#94a3b8', strokeWidth: 2 },
		data: { id, label, targetNodeId: targetId, order }
	};
	return { nodes, edges: [...edges, newEdge], newEdgeId: id };
}

export function addConnectedNode(nodes, edges, { sourceId, type, position, label }) {
	const { nodes: withNode, newNodeId } = addNode(nodes, edges, { type, position });
	const { edges: withEdge, newEdgeId } = addEdge(withNode, edges, {
		sourceId,
		targetId: newNodeId,
		label
	});
	return { nodes: withNode, edges: withEdge, newNodeId, newEdgeId };
}

// Cascade-deletes only the edges directly touching the deleted node: its own
// outgoing edges, and any other node's edge that targeted it. Does not delete
// other nodes, even if that leaves them disconnected ("islands").
export function deleteNode(nodes, edges, nodeId) {
	const remainingNodes = nodes.filter((n) => n.id !== nodeId);
	const remainingEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
	return { nodes: remainingNodes, edges: remainingEdges };
}

export function deleteEdge(nodes, edges, edgeId) {
	return { nodes, edges: edges.filter((e) => e.id !== edgeId) };
}

export function countNodeDeletionImpact(edges, nodeId) {
	const outgoing = edges.filter((e) => e.source === nodeId).length;
	const incoming = edges.filter((e) => e.target === nodeId).length;
	return { outgoing, incoming };
}

export function renameNodeId(nodes, edges, oldId, newId) {
	if (!newId || newId === oldId) return { nodes, edges };
	if (nodes.some((n) => n.id === newId)) throw new Error(`Node ID "${newId}" already exists.`);

	const renamedNodes = nodes.map((n) =>
		n.id === oldId ? { ...n, id: newId, data: { ...n.data, id: newId } } : n
	);
	const renamedEdges = edges.map((e) => ({
		...e,
		source: e.source === oldId ? newId : e.source,
		target: e.target === oldId ? newId : e.target,
		data: { ...e.data, targetNodeId: e.target === oldId ? newId : e.data.targetNodeId }
	}));
	return { nodes: renamedNodes, edges: renamedEdges };
}

export function renameEdgeId(nodes, edges, oldId, newId) {
	if (!newId || newId === oldId) return { nodes, edges };
	if (edges.some((e) => e.id === newId)) throw new Error(`Edge ID "${newId}" already exists.`);

	const renamedEdges = edges.map((e) =>
		e.id === oldId ? { ...e, id: newId, data: { ...e.data, id: newId } } : e
	);
	return { nodes, edges: renamedEdges };
}

export function retargetEdge(nodes, edges, edgeId, newTargetId) {
	const renamedEdges = edges.map((e) =>
		e.id === edgeId
			? { ...e, target: newTargetId, data: { ...e.data, targetNodeId: newTargetId } }
			: e
	);
	return { nodes, edges: renamedEdges };
}

// Reorders a node's outgoing edges (drag-reorder in the inspector) by rewriting
// the `order` field on each of that node's edges to match `orderedEdgeIds`.
export function reorderNodeEdges(nodes, edges, sourceId, orderedEdgeIds) {
	const orderIndex = new Map(orderedEdgeIds.map((id, i) => [id, i]));
	const reordered = edges.map((e) =>
		e.source === sourceId && orderIndex.has(e.id)
			? { ...e, data: { ...e.data, order: orderIndex.get(e.id) } }
			: e
	);
	return { nodes, edges: reordered };
}
