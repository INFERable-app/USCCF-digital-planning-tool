// Ported from the legacy docs/index.html editor verbatim (isCompleteResource,
// missingResourceFieldLabel, sanitizeNodesForDeploy) — single source of truth for
// "is this resource resolvable," shared by the live in-editor warning and the
// Save-time filter, so the two never quietly disagree about what counts as complete.

export function isCompleteResource(res) {
	const type = res.type || 'link';
	if (type === 'prompt') return !!(res.label || '').trim() || !!(res.text || '').trim();
	if (!res.label || !res.label.trim()) return false;
	if (type === 'pdf') return !!(res.pages || '').trim();
	if (type === 'link') return !!(res.url || '').trim();
	return true; // reference only ever needs a label, already checked above
}

export function missingResourceFieldLabel(res) {
	const type = res.type || 'link';
	if (type === 'prompt') return 'a label or prompt text';
	if (!res.label || !res.label.trim()) return 'a label';
	if (type === 'pdf') return 'page numbers';
	if (type === 'link') return 'a URL';
	return '';
}

// Applied only to the outgoing Save payload — never mutates live editor state, so
// half-filled resolver rows stay visible/editable in the live editor.
export function sanitizeResolvers(resolvers) {
	return (resolvers || []).map((r) => {
		const when = {};
		Object.entries(r.when || {}).forEach(([key, values]) => {
			if (/^__new/.test(key)) return;
			if (!Array.isArray(values) || !values.length) return;
			when[key] = values;
		});

		const clean = { when };
		if (r.recommendation && r.recommendation.trim()) clean.recommendation = r.recommendation;
		if (r.bodyText && r.bodyText.trim()) clean.bodyText = r.bodyText;
		if (r.footer && r.footer.trim()) clean.footer = r.footer;

		const resources = (r.resources || []).filter(isCompleteResource).map((res) => {
			const cleanRes = { type: res.type, label: res.label.trim() };
			if (res.type === 'pdf') {
				cleanRes.pages = res.pages.trim();
				if (res.url && res.url.trim()) cleanRes.url = res.url.trim();
			} else if (res.type === 'link') {
				cleanRes.url = res.url.trim();
			}
			if (res.description && res.description.trim()) cleanRes.description = res.description.trim();
			return cleanRes;
		});
		if (resources.length) clean.resources = resources;

		if (
			r.promptBlock &&
			((r.promptBlock.label || '').trim() || (r.promptBlock.text || '').trim())
		) {
			clean.promptBlock = r.promptBlock;
		}

		return clean;
	});
}
