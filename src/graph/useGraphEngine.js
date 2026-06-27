import { useState, useEffect } from 'react';
import { startNodeId, nodes, edges } from './wizardGraph.js';

export function useGraphEngine() {
	const [currentNodeId, setCurrentNodeId] = useState(startNodeId);
	const [answers, setAnswers] = useState({});
	const [history, setHistory] = useState([]);

	const node = nodes[currentNodeId];

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

	return { node, currentNodeId, answers, history, advance, back, jumpTo, restart, restore };
}
