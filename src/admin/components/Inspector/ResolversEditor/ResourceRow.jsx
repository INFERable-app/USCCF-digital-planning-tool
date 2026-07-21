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
						onBlur={(e) => onChange({ label: e.target.value })}
					/>
				)}
				{type === 'pdf' && (
					<div className="resource-row__inline">
						<input
							type="text"
							defaultValue={resource.pages || ''}
							placeholder="Pages (e.g. 57–58)"
							onBlur={(e) => onChange({ pages: e.target.value })}
						/>
						<input
							type="text"
							defaultValue={resource.url || ''}
							placeholder="URL (optional)"
							onBlur={(e) => onChange({ url: e.target.value })}
						/>
					</div>
				)}
				{type === 'link' && (
					<input
						type="text"
						defaultValue={resource.url || ''}
						placeholder="URL"
						onBlur={(e) => onChange({ url: e.target.value })}
					/>
				)}
				{type === 'prompt' && (
					<>
						<input
							type="text"
							defaultValue={resource.label || ''}
							placeholder="Prompt label"
							onBlur={(e) => onChange({ label: e.target.value })}
						/>
						<textarea
							rows={3}
							defaultValue={resource.text || ''}
							placeholder="Prompt text"
							onBlur={(e) => onChange({ text: e.target.value })}
						/>
					</>
				)}
				{type !== 'prompt' && (
					<textarea
						rows={2}
						defaultValue={resource.description || ''}
						placeholder="Description (optional) — shown inside the card"
						onBlur={(e) => onChange({ description: e.target.value })}
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
