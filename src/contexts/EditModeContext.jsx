import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { diffGraph } from '../graph/diffGraph.js';
import { applyGraphOps } from '../graph/applyGraphOps.js';
import * as mutations from '../graph/editMutations.js';

const EditModeContext = createContext(null);

// Edit mode drives the wizard's own graph state, so every screen renders the
// draft exactly as a visitor would see it. `baseline` is the graph as last
// loaded or saved — Save diffs against it, Cancel restores it.
export function EditModeProvider({ children, graph, setGraph, currentNodeId, goToNode }) {
	const { user } = useAuth();
	const [editMode, setEditMode] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const baselineRef = useRef(null);

	const apply = useCallback(
		(next) => {
			setGraph(next);
			setDirty(true);
			setError(null);
		},
		[setGraph]
	);

	const enter = useCallback(() => {
		if (!user?.isAdmin || !graph) return;
		baselineRef.current = graph;
		setDirty(false);
		setError(null);
		setEditMode(true);
	}, [user, graph]);

	const cancel = useCallback(() => {
		if (!baselineRef.current) return;
		setGraph(baselineRef.current);
		setDirty(false);
		setError(null);
	}, [setGraph]);

	const save = useCallback(async () => {
		if (!baselineRef.current || !graph) return false;
		setSaving(true);
		setError(null);
		try {
			const ops = diffGraph(baselineRef.current, graph);
			await applyGraphOps(ops);
			baselineRef.current = graph;
			setDirty(false);
			return true;
		} catch (err) {
			const applied = err.applied ?? 0;
			setError(
				applied > 0
					? `Saved ${applied} change${applied === 1 ? '' : 's'}, then stopped: ${err.message} Your remaining edits are still here.`
					: err.message
			);
			return false;
		} finally {
			setSaving(false);
		}
	}, [graph]);

	const exit = useCallback(() => {
		baselineRef.current = null;
		setEditMode(false);
		setDirty(false);
		setError(null);
	}, []);

	const exitDiscarding = useCallback(() => {
		if (baselineRef.current) setGraph(baselineRef.current);
		exit();
	}, [setGraph, exit]);

	// ── draft mutators ────────────────────────────────────────────────────
	// Both take the updater form so rapid per-keystroke commits always build on
	// the latest draft rather than the graph captured when the callback was made.
	const setNodeField = useCallback(
		(nodeId, field, value) =>
			apply((prev) => mutations.updateNodeField(prev, nodeId, field, value)),
		[apply]
	);

	const setEdgeField = useCallback(
		(edgeId, field, value) =>
			apply((prev) => mutations.updateEdgeField(prev, edgeId, field, value)),
		[apply]
	);

	const addButton = useCallback(
		(sourceId, label, type) => {
			const { graph: next, newNodeId } = mutations.addButtonWithNewScreen(
				graph,
				sourceId,
				label,
				type
			);
			apply(next);
			return newNodeId;
		},
		[graph, apply]
	);

	const removeButton = useCallback(
		(sourceId, edgeId) => apply(mutations.deleteEdge(graph, sourceId, edgeId)),
		[graph, apply]
	);

	const reorderButtons = useCallback(
		(sourceId, orderedEdgeIds) => apply(mutations.reorderEdges(graph, sourceId, orderedEdgeIds)),
		[graph, apply]
	);

	const retargetButton = useCallback(
		(edgeId, targetNodeId) => apply(mutations.retargetEdge(graph, edgeId, targetNodeId)),
		[graph, apply]
	);

	const removeScreen = useCallback(
		(nodeId) => {
			apply(mutations.deleteNode(graph, nodeId));
			if (nodeId === currentNodeId) goToNode(graph.startNodeId);
		},
		[graph, apply, currentNodeId, goToNode]
	);

	const setScreenType = useCallback(
		(nodeId, type) => apply(mutations.changeNodeType(graph, nodeId, type)),
		[graph, apply]
	);

	const deletionImpact = useCallback(
		(nodeId) => mutations.countNodeDeletionImpact(graph, nodeId),
		[graph]
	);

	return (
		<EditModeContext.Provider
			value={{
				editMode,
				dirty,
				saving,
				error,
				canEdit: !!user?.isAdmin,
				enter,
				cancel,
				save,
				exit,
				exitDiscarding,
				setNodeField,
				setEdgeField,
				addButton,
				removeButton,
				reorderButtons,
				retargetButton,
				removeScreen,
				setScreenType,
				deletionImpact,
				goToNode
			}}
		>
			{children}
		</EditModeContext.Provider>
	);
}

export function useEditMode() {
	return useContext(EditModeContext) ?? { editMode: false, canEdit: false };
}
