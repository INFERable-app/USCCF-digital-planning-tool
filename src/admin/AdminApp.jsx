import './AdminApp.css';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAdminGraph } from './state/useAdminGraph.js';
import {
	toFlowNodes,
	toFlowEdges,
	toWizardGraph,
	findOrphanEdges
} from './state/graphFlowAdapter.js';
import { layoutMissing, layoutAll } from './state/layout.js';
import * as mutations from './state/graphMutations.js';
import GraphCanvas from './components/Canvas/GraphCanvas.jsx';
import CreateConnectedNodePopover from './components/Canvas/CreateConnectedNodePopover.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import SaveModal from './components/shared/SaveModal.jsx';
import ConfirmPopover from './components/shared/ConfirmPopover.jsx';
import InspectorPanel from './components/Inspector/InspectorPanel.jsx';

function GraphEditorInner({ graph, userLabel, save }) {
	const initialEdges = useMemo(() => toFlowEdges(graph), [graph]);
	const initialNodes = useMemo(
		() => layoutMissing(toFlowNodes(graph), initialEdges),
		[graph, initialEdges]
	);
	const orphanEdges = useMemo(() => findOrphanEdges(graph), [graph]);

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [dirty, setDirty] = useState(false);
	const [showSaveModal, setShowSaveModal] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(null);
	const [connectDraft, setConnectDraft] = useState(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const { fitView, screenToFlowPosition } = useReactFlow();

	const selection = useMemo(() => {
		const selectedNode = nodes.find((n) => n.selected);
		if (selectedNode) return { type: 'node', id: selectedNode.id };
		const selectedEdge = edges.find((e) => e.selected);
		if (selectedEdge) return { type: 'edge', id: selectedEdge.id };
		return null;
	}, [nodes, edges]);

	function selectOnly(type, id) {
		setNodes((current) => current.map((n) => ({ ...n, selected: type === 'node' && n.id === id })));
		setEdges((current) => current.map((e) => ({ ...e, selected: type === 'edge' && e.id === id })));
	}

	function clearSelection() {
		setNodes((current) => current.map((n) => ({ ...n, selected: false })));
		setEdges((current) => current.map((e) => ({ ...e, selected: false })));
	}

	const handleNodesChange = useCallback(
		(changes) => {
			onNodesChange(changes);
			if (changes.some((change) => change.type === 'position')) setDirty(true);
		},
		[onNodesChange]
	);

	function handleAutoArrange() {
		setNodes((current) => layoutAll(current, edges));
		setDirty(true);
	}

	async function handleConfirmSave() {
		await save(toWizardGraph(nodes, edges, graph.startNodeId, orphanEdges));
		setDirty(false);
	}

	function handleAddNode(type) {
		const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
		const { nodes: nextNodes, newNodeId } = mutations.addNode(nodes, edges, { type, position });
		setNodes(nextNodes);
		setDirty(true);
		selectOnly('node', newNodeId);
	}

	function handleConnect(connection) {
		const { edges: nextEdges, newEdgeId } = mutations.addEdge(nodes, edges, {
			sourceId: connection.source,
			targetId: connection.target,
			label: 'Continue'
		});
		setEdges(nextEdges);
		setDirty(true);
		selectOnly('edge', newEdgeId);
	}

	function handleConnectStart() {
		setIsConnecting(true);
	}

	function handleConnectEnd(event, connectionState) {
		setIsConnecting(false);
		if (connectionState.isValid || !connectionState.fromNode) return;
		const point = 'changedTouches' in event ? event.changedTouches[0] : event;
		const sourceId = connectionState.fromNode.id;

		// The target handle's hit area is intentionally small (see GraphNodeCard),
		// so treat a drop anywhere on another node's card as "connect to that node"
		// rather than requiring pixel-precise handle targeting.
		const droppedNodeEl = document
			.elementFromPoint(point.clientX, point.clientY)
			?.closest('.react-flow__node');
		const droppedNodeId = droppedNodeEl?.getAttribute('data-id');
		if (droppedNodeId && droppedNodeId !== sourceId) {
			handleConnect({ source: sourceId, target: droppedNodeId });
			return;
		}

		setConnectDraft({
			sourceId,
			screenX: point.clientX,
			screenY: point.clientY,
			flowPosition: screenToFlowPosition({ x: point.clientX, y: point.clientY })
		});
	}

	function handleConfirmConnectedNode({ type, label }) {
		const {
			nodes: nextNodes,
			edges: nextEdges,
			newNodeId
		} = mutations.addConnectedNode(nodes, edges, {
			sourceId: connectDraft.sourceId,
			type,
			position: connectDraft.flowPosition,
			label
		});
		setNodes(nextNodes);
		setEdges(nextEdges);
		setDirty(true);
		setConnectDraft(null);
		selectOnly('node', newNodeId);
	}

	function handleRequestDelete(type, id, event) {
		setPendingDelete({ type, id, x: event.clientX, y: event.clientY });
	}

	function handleConfirmDelete() {
		const { type, id } = pendingDelete;
		if (type === 'node') {
			const { nodes: nextNodes, edges: nextEdges } = mutations.deleteNode(nodes, edges, id);
			setNodes(nextNodes);
			setEdges(nextEdges);
		} else {
			const { edges: nextEdges } = mutations.deleteEdge(nodes, edges, id);
			setEdges(nextEdges);
		}
		setDirty(true);
		setPendingDelete(null);
	}

	useEffect(() => {
		function handleKeyDown(e) {
			if (!selection) return;
			const tag = document.activeElement?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
			if (e.key === 'Delete' || e.key === 'Backspace') {
				setPendingDelete({
					type: selection.type,
					id: selection.id,
					x: window.innerWidth - 220,
					y: 80
				});
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selection]);

	function updateNodeData(nodeId, patch) {
		setNodes((current) =>
			current.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n))
		);
		setDirty(true);
	}

	function renameNodeId(oldId, newId) {
		try {
			const { nodes: nextNodes, edges: nextEdges } = mutations.renameNodeId(
				nodes,
				edges,
				oldId,
				newId
			);
			setNodes(nextNodes);
			setEdges(nextEdges);
			setDirty(true);
			selectOnly('node', newId);
		} catch (err) {
			alert(err.message);
		}
	}

	function reorderNodeEdges(nodeId, orderedIds) {
		const { edges: nextEdges } = mutations.reorderNodeEdges(nodes, edges, nodeId, orderedIds);
		setEdges(nextEdges);
		setDirty(true);
	}

	function updateEdgeData(edgeId, patch) {
		setEdges((current) =>
			current.map((e) => {
				if (e.id !== edgeId) return e;
				const next = { ...e, data: { ...e.data, ...patch } };
				if ('targetNodeId' in patch) next.target = patch.targetNodeId;
				if ('label' in patch) next.label = patch.label;
				if ('disabled' in patch) {
					next.style = patch.disabled
						? { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '4 4', opacity: 0.5 }
						: { stroke: '#94a3b8', strokeWidth: 2 };
				}
				return next;
			})
		);
		setDirty(true);
	}

	function renameEdgeId(oldId, newId) {
		try {
			const { edges: nextEdges } = mutations.renameEdgeId(nodes, edges, oldId, newId);
			setEdges(nextEdges);
			setDirty(true);
			selectOnly('edge', newId);
		} catch (err) {
			alert(err.message);
		}
	}

	const selectedNode = selection?.type === 'node' ? nodes.find((n) => n.id === selection.id) : null;
	const selectedEdge = selection?.type === 'edge' ? edges.find((e) => e.id === selection.id) : null;
	const outgoingEdges = useMemo(() => {
		if (!selectedNode) return [];
		return edges
			.filter((e) => e.source === selectedNode.id)
			.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
			.map((e) => ({ id: e.id, label: e.data.label, targetNodeId: e.target }));
	}, [edges, selectedNode]);

	return (
		<div className="admin-shell">
			<Toolbar
				userLabel={userLabel}
				dirty={dirty}
				onAddNode={handleAddNode}
				onAutoArrange={handleAutoArrange}
				onFitView={() => fitView({ duration: 300 })}
				onSaveClick={() => setShowSaveModal(true)}
			/>
			<div className="admin-shell__main">
				<GraphCanvas
					nodes={nodes}
					edges={edges}
					onNodesChange={handleNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={handleConnect}
					onConnectStart={handleConnectStart}
					onConnectEnd={handleConnectEnd}
					onPaneClick={clearSelection}
					nodesDraggable={!isConnecting}
				/>
				{selection && (
					<InspectorPanel
						selection={selection}
						node={selectedNode}
						edge={selectedEdge}
						allNodeIds={nodes.map((n) => n.id)}
						outgoingEdges={outgoingEdges}
						onUpdateNodeData={updateNodeData}
						onRenameNodeId={renameNodeId}
						onReorderNodeEdges={reorderNodeEdges}
						onUpdateEdgeData={updateEdgeData}
						onRenameEdgeId={renameEdgeId}
						onSelectEdge={(edgeId) => selectOnly('edge', edgeId)}
						onClose={clearSelection}
						onRequestDelete={handleRequestDelete}
					/>
				)}
			</div>
			{showSaveModal && (
				<SaveModal onClose={() => setShowSaveModal(false)} onConfirm={handleConfirmSave} />
			)}
			{connectDraft && (
				<CreateConnectedNodePopover
					x={connectDraft.screenX}
					y={connectDraft.screenY}
					onConfirm={handleConfirmConnectedNode}
					onCancel={() => setConnectDraft(null)}
				/>
			)}
			{pendingDelete && (
				<ConfirmPopover
					x={pendingDelete.x}
					y={pendingDelete.y}
					message={
						pendingDelete.type === 'node'
							? (() => {
									const { outgoing, incoming } = mutations.countNodeDeletionImpact(
										edges,
										pendingDelete.id
									);
									return `Delete node "${pendingDelete.id}"? This will also remove ${outgoing} outgoing and ${incoming} incoming edge(s).`;
								})()
							: `Delete edge "${pendingDelete.id}"?`
					}
					onConfirm={handleConfirmDelete}
					onCancel={() => setPendingDelete(null)}
				/>
			)}
		</div>
	);
}

function GraphEditor(props) {
	return (
		<ReactFlowProvider>
			<GraphEditorInner {...props} />
		</ReactFlowProvider>
	);
}

export default function AdminApp() {
	const { user, loading } = useAuth();
	const { graph, loading: graphLoading, error, save } = useAdminGraph();

	if (loading) return null;

	if (!user) {
		window.location.href = '/auth/login';
		return null;
	}

	if (!user.isAdmin) {
		return (
			<div className="admin-forbidden">
				<h1>403 Forbidden</h1>
				<p>You do not have admin access.</p>
			</div>
		);
	}

	if (graphLoading || !graph) return null;
	if (error) {
		return (
			<div className="admin-forbidden">
				<h1>Failed to load graph</h1>
				<p>{error.message}</p>
			</div>
		);
	}

	return <GraphEditor graph={graph} userLabel={user.name || user.email} save={save} />;
}
