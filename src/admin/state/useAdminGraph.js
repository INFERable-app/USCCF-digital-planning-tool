import { useState, useEffect, useCallback } from 'react';

export function useAdminGraph() {
	const [graph, setGraph] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const reload = useCallback(() => {
		setLoading(true);
		return fetch('/api/graph', { credentials: 'include' })
			.then((r) => {
				if (!r.ok) throw new Error(`Graph fetch failed: ${r.status}`);
				return r.json();
			})
			.then((data) => {
				setGraph(data);
				setError(null);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		reload();
	}, [reload]);

	const save = useCallback(async (wizardGraph) => {
		const res = await fetch('/api/graph', {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(wizardGraph)
		});
		if (!res.ok) {
			if (res.status === 403) throw new Error('You do not have permission to save the graph.');
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error || `${res.status}`);
		}
	}, []);

	return { graph, loading, error, reload, save };
}
