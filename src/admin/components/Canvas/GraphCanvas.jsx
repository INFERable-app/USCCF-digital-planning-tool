import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './GraphCanvas.css';
import GraphNodeCard from '../nodes/GraphNodeCard.jsx';
import GraphEdge from '../edges/GraphEdge.jsx';
import { nodeTypeMeta } from '../nodes/nodeTypeMeta.js';

const nodeTypes = { graphNode: GraphNodeCard };
const edgeTypes = { graphEdge: GraphEdge };

export default function GraphCanvas({
	nodes,
	edges,
	onNodesChange,
	onEdgesChange,
	onConnect,
	onConnectStart,
	onConnectEnd,
	onPaneClick,
	nodesDraggable = true
}) {
	const minimapNodeColor = useMemo(() => (node) => nodeTypeMeta(node.data.type).color, []);

	// Multiple edges between the same source/target render an identical path by
	// default (the path shape only depends on the shared handle positions), so
	// stack a parallelIndex/parallelCount onto each edge's data — GraphEdge uses
	// these to fan duplicate edges out into distinct, non-overlapping paths.
	const edgesWithParallelInfo = useMemo(() => {
		const groups = new Map();
		edges.forEach((edge) => {
			const key = `${edge.source}->${edge.target}`;
			(groups.get(key) ?? groups.set(key, []).get(key)).push(edge);
		});
		return edges.map((edge) => {
			const group = groups.get(`${edge.source}->${edge.target}`);
			return group.length > 1
				? {
						...edge,
						data: {
							...edge.data,
							parallelIndex: group.indexOf(edge),
							parallelCount: group.length
						}
					}
				: edge;
		});
	}, [edges]);

	return (
		<div className="graph-canvas">
			<ReactFlow
				nodes={nodes}
				edges={edgesWithParallelInfo}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				onConnectEnd={onConnectEnd}
				onPaneClick={onPaneClick}
				nodesDraggable={nodesDraggable}
				deleteKeyCode={null}
				fitView
				minZoom={0.1}
				maxZoom={2}
			>
				<Background gap={24} size={1.5} color="#e2e8f0" />
				<Controls />
				<MiniMap nodeColor={minimapNodeColor} pannable zoomable />
			</ReactFlow>
		</div>
	);
}
