// Ported from the legacy docs/index.html editor verbatim (isCompleteResource,
// missingResourceFieldLabel, sanitizeNodesForDeploy) — single source of truth for
// "is this resource resolvable," shared by the live in-editor warning and the
// Save-time filter, so the two never quietly disagree about what counts as complete.

function anchorPageFromUrl(url) {
	if (!url) return null;
	const hash = url.split('#')[1];
	const match = hash && hash.match(/^page=(\d+)$/);
	return match ? Number(match[1]) : null;
}

// Strips any anchor already on the URL and re-derives it from `pageStart` (source of truth
// going forward), or backfills `pageStart` from an existing anchor if it's empty.
function reconcilePdfPageAnchor(res) {
	if (res.wholeDocument) return res;
	let pageStart = res.pageStart;
	const url = (res.url || '').trim();
	if (!pageStart && url) {
		const anchorPage = anchorPageFromUrl(url);
		if (anchorPage) pageStart = anchorPage;
	}
	let nextUrl = url;
	if (pageStart && url) {
		nextUrl = `${url.split('#')[0]}#page=${pageStart}`;
	}
	return { ...res, pageStart, url: nextUrl };
}

export function isCompleteResource(res) {
	const type = res.type || 'link';
	if (type === 'prompt') return !!(res.label || '').trim() || !!(res.text || '').trim();
	if (!res.label || !res.label.trim()) return false;
	if (type === 'pdf') {
		if (res.wholeDocument) return true;
		return !!res.pageStart || !!anchorPageFromUrl(res.url);
	}
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

		// ResultsNode renders these three, so they must survive a save even
		// though no editor form exposes them yet.
		if (r.videoUrl && r.videoUrl.trim()) clean.videoUrl = r.videoUrl;
		if (r.videoAlt && r.videoAlt.trim()) clean.videoAlt = r.videoAlt;
		if (r.cta && r.cta.label && r.cta.url) {
			clean.cta = { label: r.cta.label, url: r.cta.url };
		}

		const resources = (r.resources || [])
			.map((res) => (res.type === 'pdf' ? reconcilePdfPageAnchor(res) : res))
			.filter(isCompleteResource)
			.map((res) => {
				const cleanRes = { type: res.type, label: (res.label || '').trim() };
				if (res.type === 'pdf') {
					if (res.wholeDocument) {
						cleanRes.wholeDocument = true;
					} else {
						cleanRes.pageStart = res.pageStart;
						if (res.pageEnd) cleanRes.pageEnd = res.pageEnd;
					}
					if (res.url && res.url.trim()) cleanRes.url = res.url.trim();
				} else if (res.type === 'link') {
					cleanRes.url = res.url.trim();
				} else if (res.type === 'prompt') {
					cleanRes.text = (res.text || '').trim();
				}
				if (res.description && res.description.trim())
					cleanRes.description = res.description.trim();
				return cleanRes;
			});
		if (resources.length) clean.resources = resources;

		return clean;
	});
}
