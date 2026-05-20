import { useState } from 'react';
import { startNodeId, nodes, edges } from './wizardGraph.js';

export function useGraphEngine() {
	const [currentNodeId, setCurrentNodeId] = useState(startNodeId);
	const [answers, setAnswers] = useState({});
	const [history, setHistory] = useState([]);

	const node = nodes[currentNodeId];

	// advance(edgeId, dynamicValue?)
	// - Resolves the edge, optionally stores a value in answers, then navigates.
	// - dynamicValue is used when the component collects a value at runtime
	//   (e.g. selected radio edge id, array of checked checkbox edge ids).
	//   If the edge already carries a static `value`, that wins.
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
		window.scrollTo(0, 0);
	}

	function back() {
		if (history.length === 0) return;
		const prev = history[history.length - 1];
		setHistory((h) => h.slice(0, -1));
		setCurrentNodeId(prev);
		window.scrollTo(0, 0);
	}

	function restart() {
		setCurrentNodeId(startNodeId);
		setAnswers({});
		setHistory([]);
		window.scrollTo(0, 0);
	}

	return { node, answers, history, advance, back, restart };
}
