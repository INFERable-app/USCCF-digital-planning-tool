// Converts between the server's WizardGraph shape ({ startNodeId, nodes, edges })
// and React Flow's { nodes, edges } shape.
//
// GraphEdge has no explicit "source" — ownership is implicit: edge e1 belongs to
// node n1 iff n1.edgeIds includes e1, and array order is display order. React Flow
// edges need an explicit { source, target }, so each flow edge carries an `order`
// field (its index within the owning node's edgeIds at conversion time) that
// toWizardGraph() sorts by when reconstructing edgeIds — reordering (drag-reorder
// in the inspector) updates this field rather than relying on array/render order.

export function toFlowNodes(wizardGraph) {
	return Object.values(wizardGraph.nodes).map((node) => ({
		id: node.id,
		type: 'graphNode',
		position: {
			x: node.positionX ?? 0,
			y: node.positionY ?? 0
		},
		data: {
			...node,
			hasPosition: node.positionX !== undefined && node.positionY !== undefined
		}
	}));
}

export function toFlowEdges(wizardGraph) {
	const flowEdges = [];
	Object.values(wizardGraph.nodes).forEach((node) => {
		(node.edgeIds || []).forEach((edgeId, order) => {
			const edge = wizardGraph.edges[edgeId];
			if (!edge) return;
			flowEdges.push({
				id: edge.id,
				source: node.id,
				target: edge.targetNodeId,
				label: edge.label,
				type: 'graphEdge',
				style: edge.disabled
					? { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '4 4', opacity: 0.5 }
					: { stroke: '#94a3b8', strokeWidth: 2 },
				data: { ...edge, order }
			});
		});
	});
	return flowEdges;
}

// `orphanEdges` are entries from the originally-loaded graph's `edges` map that no
// node's `edgeIds` referenced (e.g. disabled/not-yet-wired-up options) — React Flow
// can't render an edge with no source node, but a save still shouldn't silently
// delete them, so they're passed through unchanged here.
export function toWizardGraph(flowNodes, flowEdges, startNodeId, orphanEdges = {}) {
	const nodes = {};
	flowNodes.forEach((flowNode) => {
		const { hasPosition, ...node } = flowNode.data;
		void hasPosition;
		nodes[flowNode.id] = {
			...node,
			id: flowNode.id,
			positionX: flowNode.position.x,
			positionY: flowNode.position.y,
			edgeIds: []
		};
	});

	const edgesBySource = {};
	flowEdges.forEach((flowEdge) => {
		(edgesBySource[flowEdge.source] ??= []).push(flowEdge);
	});

	const edges = {};
	Object.entries(edgesBySource).forEach(([sourceId, sourceEdges]) => {
		const ordered = [...sourceEdges].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
		if (!nodes[sourceId]) return;
		nodes[sourceId].edgeIds = ordered.map((flowEdge) => flowEdge.id);
		ordered.forEach((flowEdge) => {
			const { order, ...edge } = flowEdge.data;
			void order;
			edges[flowEdge.id] = { ...edge, id: flowEdge.id, targetNodeId: flowEdge.target };
		});
	});

	return { startNodeId, nodes, edges: { ...orphanEdges, ...edges } };
}

// Edges present in wizardGraph.edges but not referenced by any node's edgeIds.
export function findOrphanEdges(wizardGraph) {
	const referenced = new Set();
	Object.values(wizardGraph.nodes).forEach((node) => {
		(node.edgeIds || []).forEach((edgeId) => referenced.add(edgeId));
	});
	const orphans = {};
	Object.entries(wizardGraph.edges).forEach(([id, edge]) => {
		if (!referenced.has(id)) orphans[id] = edge;
	});
	return orphans;
}
