import { useState } from 'react';
import { flushSync } from 'react-dom';
import { isCompleteResource, missingResourceFieldLabel } from './resolverSanitize.js';

const TYPE_OPTIONS = [
	{ value: 'pdf', label: 'pdf' },
	{ value: 'link', label: 'link' },
	{ value: 'reference', label: 'reference' },
	{ value: 'prompt', label: 'AI Prompt' }
];

export default function ResourceRow({ resource, onChange, onRemove }) {
	const type = resource.type || 'link';
	const complete = isCompleteResource(resource);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	async function handleFileUpload(e) {
		const file = e.target.files[0];
		e.target.value = '';
		if (!file) return;
		setUploading(true);
		setUploadError(null);
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/resources/upload', {
				method: 'POST',
				credentials: 'include',
				body: formData
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || `${res.status}`);
			}
			const data = await res.json();
			onChange({ url: data.url });
		} catch (err) {
			setUploadError(err.message);
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className={`resource-row${complete ? '' : ' resource-row--incomplete'}`}>
			<select value={type} onChange={(e) => onChange({ type: e.target.value })}>
				{TYPE_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			<div className="resource-row__fields">
				{type !== 'prompt' && (
					<input
						type="text"
						defaultValue={resource.label || ''}
						placeholder="Label"
						onBlur={(e) => flushSync(() => onChange({ label: e.target.value }))}
					/>
				)}
				{type === 'pdf' && (
					<div className="resource-row__inline">
						<label className="resource-row__checkbox">
							<input
								type="checkbox"
								checked={!!resource.wholeDocument}
								onChange={(e) => onChange({ wholeDocument: e.target.checked })}
							/>
							Whole document (no specific page)
						</label>
						{!resource.wholeDocument && (
							<input
								type="text"
								defaultValue={resource.pages || ''}
								placeholder="Pages (e.g. 57–58)"
								onBlur={(e) => flushSync(() => onChange({ pages: e.target.value }))}
							/>
						)}
						<input
							key={resource.url || 'empty'}
							type="text"
							defaultValue={resource.url || ''}
							placeholder="URL (optional)"
							onBlur={(e) => flushSync(() => onChange({ url: e.target.value }))}
						/>
						<input
							type="file"
							accept="application/pdf"
							disabled={uploading}
							onChange={handleFileUpload}
						/>
						{uploading && <span className="resource-row__uploading">Uploading&hellip;</span>}
						{uploadError && <p className="resource-row__warning">Upload failed: {uploadError}</p>}
					</div>
				)}
				{type === 'link' && (
					<input
						type="text"
						defaultValue={resource.url || ''}
						placeholder="URL"
						onBlur={(e) => flushSync(() => onChange({ url: e.target.value }))}
					/>
				)}
				{type === 'prompt' && (
					<>
						<input
							type="text"
							defaultValue={resource.label || ''}
							placeholder="Prompt label"
							onBlur={(e) => flushSync(() => onChange({ label: e.target.value }))}
						/>
						<textarea
							rows={3}
							defaultValue={resource.text || ''}
							placeholder="Prompt text"
							onBlur={(e) => flushSync(() => onChange({ text: e.target.value }))}
						/>
					</>
				)}
				{type !== 'prompt' && (
					<textarea
						rows={2}
						defaultValue={resource.description || ''}
						placeholder="Description (optional) — shown inside the card"
						onBlur={(e) => flushSync(() => onChange({ description: e.target.value }))}
					/>
				)}
				{!complete && (
					<p className="resource-row__warning">
						Missing {missingResourceFieldLabel(resource)} — this resource won't be saved until it's
						filled in.
					</p>
				)}
			</div>
			<button type="button" onClick={onRemove} aria-label="Remove resource">
				&minus;
			</button>
		</div>
	);
}
