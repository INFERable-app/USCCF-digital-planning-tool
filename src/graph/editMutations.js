// Pure mutations over the wizard graph's record shape ({ nodes, edges } keyed by
// id). The graph editor's src/admin/state/graphMutations.js operates on React
// Flow's node/edge arrays instead, so it cannot be reused here — but the id
// conventions below match it so ids stay consistent across both tools.

import { NODE_TYPE_DEFAULTS } from '../admin/components/nodes/nodeTypeMeta.js';

export function generateNodeId(nodes) {
	let n = 1;
	let id = `node-${n}`;
	while (nodes[id]) id = `node-${++n}`;
	return id;
}

export function generateEdgeId(edges, sourceId, targetId) {
	let id = `e_${sourceId}_${targetId}`;
	let n = 1;
	while (edges[id]) id = `e_${sourceId}_${targetId}_${n++}`;
	return id;
}

export function updateNodeField(graph, nodeId, field, value) {
	const node = graph.nodes[nodeId];
	if (!node) return graph;
	return {
		...graph,
		nodes: { ...graph.nodes, [nodeId]: { ...node, [field]: value } }
	};
}

export function updateEdgeField(graph, edgeId, field, value) {
	const edge = graph.edges[edgeId];
	if (!edge) return graph;
	return {
		...graph,
		edges: { ...graph.edges, [edgeId]: { ...edge, [field]: value } }
	};
}

// Creates a new screen of `type` and a button on `sourceId` pointing at it.
export function addButtonWithNewScreen(graph, sourceId, label, type) {
	const source = graph.nodes[sourceId];
	if (!source) return { graph, newNodeId: null, newEdgeId: null };

	const newNodeId = generateNodeId(graph.nodes);
	const newEdgeId = generateEdgeId(graph.edges, sourceId, newNodeId);

	const newNode = {
		id: newNodeId,
		type,
		layout: 'compact',
		challengeBar: true,
		edgeIds: [],
		...(NODE_TYPE_DEFAULTS[type] ?? {})
	};

	return {
		graph: {
			...graph,
			nodes: {
				...graph.nodes,
				[newNodeId]: newNode,
				[sourceId]: { ...source, edgeIds: [...source.edgeIds, newEdgeId] }
			},
			edges: {
				...graph.edges,
				[newEdgeId]: { id: newEdgeId, label, targetNodeId: newNodeId }
			}
		},
		newNodeId,
		newEdgeId
	};
}

export function deleteEdge(graph, sourceId, edgeId) {
	const source = graph.nodes[sourceId];
	const edges = { ...graph.edges };
	delete edges[edgeId];
	return {
		...graph,
		nodes: source
			? {
					...graph.nodes,
					[sourceId]: { ...source, edgeIds: source.edgeIds.filter((id) => id !== edgeId) }
				}
			: graph.nodes,
		edges
	};
}

export function reorderEdges(graph, sourceId, orderedEdgeIds) {
	const source = graph.nodes[sourceId];
	if (!source) return graph;
	return {
		...graph,
		nodes: { ...graph.nodes, [sourceId]: { ...source, edgeIds: orderedEdgeIds } }
	};
}

export function retargetEdge(graph, edgeId, targetNodeId) {
	return updateEdgeField(graph, edgeId, 'targetNodeId', targetNodeId);
}

// Removes the screen plus every button on it and every button pointing at it.
export function deleteNode(graph, nodeId) {
	const nodes = { ...graph.nodes };
	const edges = { ...graph.edges };

	for (const edgeId of nodes[nodeId]?.edgeIds ?? []) delete edges[edgeId];
	delete nodes[nodeId];

	for (const [edgeId, edge] of Object.entries(edges)) {
		if (edge.targetNodeId === nodeId) delete edges[edgeId];
	}
	for (const [id, node] of Object.entries(nodes)) {
		const kept = node.edgeIds.filter((edgeId) => edges[edgeId]);
		if (kept.length !== node.edgeIds.length) nodes[id] = { ...node, edgeIds: kept };
	}

	return { ...graph, nodes, edges };
}

export function countNodeDeletionImpact(graph, nodeId) {
	const outgoing = graph.nodes[nodeId]?.edgeIds.length ?? 0;
	const incoming = Object.values(graph.edges).filter((edge) => edge.targetNodeId === nodeId).length;
	return { outgoing, incoming };
}

export function changeNodeType(graph, nodeId, type) {
	const node = graph.nodes[nodeId];
	if (!node) return graph;
	return {
		...graph,
		nodes: {
			...graph.nodes,
			[nodeId]: { ...node, type, ...(NODE_TYPE_DEFAULTS[type] ?? {}) }
		}
	};
}
