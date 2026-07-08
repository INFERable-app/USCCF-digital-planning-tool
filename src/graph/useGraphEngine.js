import { useState, useEffect } from 'react';

export function useGraphEngine() {
	const [graph, setGraph] = useState(null);
	const [currentNodeId, setCurrentNodeId] = useState(null);
	const [answers, setAnswers] = useState({});
	const [history, setHistory] = useState([]);

	useEffect(() => {
		fetch('/api/graph', { credentials: 'include' })
			.then(r => { if (!r.ok) throw new Error(`Graph fetch failed: ${r.status}`); return r.json(); })
			.then(data => {
				setGraph(data);
				setCurrentNodeId(prev => prev === null ? data.startNodeId : prev);
			})
			.catch(console.error);
	}, []);

	const nodes = graph?.nodes ?? {};
	const edges = graph?.edges ?? {};
	const startNodeId = graph?.startNodeId ?? null;
	const node = currentNodeId ? nodes[currentNodeId] : null;

	function advance(edgeId, dynamicValue) {
		const edge = edges[edgeId];
		if (!edge) throw new Error(`useGraphEngine: unknown edge id "${edgeId}"`);

		setAnswers((prev) => {
			if (!edge.storeKey) return prev;
			const val = edge.value !== undefined ? edge.value : dynamicValue;
			return { ...prev, [edge.storeKey]: val };
		});

		setHistory((prev) => [...prev, currentNodeId]);
		setCurrentNodeId(edge.targetNodeId);
		window.history.pushState({}, '');
		window.scrollTo(0, 0);
	}

	function back() {
		if (history.length === 0) return;
		const prev = history[history.length - 1];
		setHistory((h) => h.slice(0, -1));
		setCurrentNodeId(prev);
		window.scrollTo(0, 0);
	}

	function jumpTo(nodeId) {
		const idx = history.indexOf(nodeId);
		if (idx === -1) return;
		setHistory(history.slice(0, idx));
		setCurrentNodeId(nodeId);
		window.scrollTo(0, 0);
	}

	// Walks the accumulated answers/history that would result from actually
	// having taken this exact chain of edges, then jumps to the last edge's
	// target — lets the use-case nav tree jump forward to nodes not yet in
	// history. Takes an explicit ordered edge id path (rather than searching
	// for one by target node id) so it replays the specific branch the user
	// clicked, not just any path that happens to reach the same node.
	function jumpAlongPath(edgePath) {
		if (!edgePath || edgePath.length === 0) return false;
		const path = edgePath.map((edgeId) => edges[edgeId]);
		if (path.some((edge) => !edge)) return false;

		setAnswers((prev) => {
			const next = { ...prev };
			for (const edge of path) {
				if (!edge.storeKey) continue;
				if (edge.value === undefined) continue; // no dynamicValue available on a jump
				next[edge.storeKey] = edge.value;
			}
			return next;
		});

		const historyNodeIds = [startNodeId, ...path.slice(0, -1).map((e) => e.targetNodeId)];
		const targetNodeId = path[path.length - 1].targetNodeId;
		setHistory(historyNodeIds);
		setCurrentNodeId(targetNodeId);
		window.history.pushState({}, '');
		window.scrollTo(0, 0);
		return true;
	}

	function restart() {
		setCurrentNodeId(startNodeId);
		setAnswers({});
		setHistory([]);
		window.scrollTo(0, 0);
	}

	function restore(progress) {
		setCurrentNodeId(progress.currentNodeId);
		setAnswers(progress.answers);
		setHistory(progress.history);
	}

	// No dependency array — always registers a fresh closure so back() sees
	// the latest history state without stale capture issues.
	useEffect(() => {
		function onPopState() { back(); }
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	});

	return { node, nodes, edges, startNodeId, currentNodeId, answers, history, advance, back, jumpTo, jumpAlongPath, restart, restore };
}
