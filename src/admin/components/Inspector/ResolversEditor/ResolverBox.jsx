import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import WhenConditionRow from './WhenConditionRow.jsx';
import ResourceRow from './ResourceRow.jsx';
import { TextField, TextAreaField } from '../Field.jsx';

function nextPlaceholderKey(when) {
	let key = '__new';
	let n = 1;
	while (key in when) key = `__new_${n++}`;
	return key;
}

export default function ResolverBox({ resolver, index, onChange, onRemove }) {
	const when = resolver.when || {};
	const resources = resolver.resources || [];
	const [dragIndex, setDragIndex] = useState(null);

	function updateWhenKey(oldKey, rawNewKey) {
		const newKey = rawNewKey.trim();
		if (!newKey || newKey === oldKey) return;
		const entries = Object.entries(when).map(([k, v]) => (k === oldKey ? [newKey, v] : [k, v]));
		onChange({ ...resolver, when: Object.fromEntries(entries) });
	}

	function updateWhenValues(key, rawValues) {
		const values = rawValues
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		onChange({ ...resolver, when: { ...when, [key]: values } });
	}

	function addWhenCondition() {
		onChange({ ...resolver, when: { ...when, [nextPlaceholderKey(when)]: [] } });
	}

	function removeWhenCondition(key) {
		const { [key]: _removed, ...rest } = when;
		void _removed;
		onChange({ ...resolver, when: rest });
	}

	function updateResourceAt(index, patch) {
		const nextResources = [...resources];
		if ('type' in patch) {
			const current = resources[index];
			const base = { _key: current._key, type: patch.type, label: current.label || '' };
			nextResources[index] =
				patch.type === 'prompt'
					? { ...base, text: current.text || '' }
					: { ...base, description: current.description || '' };
		} else {
			nextResources[index] = { ...nextResources[index], ...patch };
		}
		onChange({ ...resolver, resources: nextResources });
	}

	function removeResourceAt(index) {
		onChange({ ...resolver, resources: resources.filter((_, i) => i !== index) });
	}

	function addResource() {
		onChange({
			...resolver,
			resources: [
				...resources,
				{ _key: crypto.randomUUID(), type: 'link', label: '', url: '', description: '' }
			]
		});
	}

	function moveResource(fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const nextResources = [...resources];
		const [moved] = nextResources.splice(fromIndex, 1);
		nextResources.splice(toIndex, 0, moved);
		onChange({ ...resolver, resources: nextResources });
	}

	function handleResourceDrop(overIndex) {
		if (dragIndex === null || dragIndex === overIndex) return;
		moveResource(dragIndex, overIndex);
		setDragIndex(null);
	}

	return (
		<div className="resolver-box">
			<div className="resolver-box__header">
				<span>Resolver {index + 1}</span>
				<button type="button" onClick={onRemove}>
					Remove Resolver
				</button>
			</div>

			<div className="resolver-box__when">
				<label>When (match conditions)</label>
				{Object.entries(when).map(([key, values]) => (
					<WhenConditionRow
						key={key}
						conditionKey={key}
						values={values}
						onChangeKey={(v) => updateWhenKey(key, v)}
						onChangeValues={(v) => updateWhenValues(key, v)}
						onRemove={() => removeWhenCondition(key)}
					/>
				))}
				<button type="button" className="resolver-box__add-link" onClick={addWhenCondition}>
					+ Add Condition
				</button>
				<p className="resolver-box__hint">
					Leave empty to always match (use as a fallback/default resolver).
				</p>
			</div>

			<TextField
				label="Recommendation"
				value={resolver.recommendation}
				onChange={(v) => onChange({ ...resolver, recommendation: v })}
			/>
			<TextAreaField
				label="Body Text"
				value={resolver.bodyText}
				onChange={(v) => onChange({ ...resolver, bodyText: v })}
			/>

			<div className="resolver-box__resources">
				<label>Resources</label>
				{resources.map((res, i) => (
					<div
						key={res._key ?? i}
						className="resolver-box__resource"
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleResourceDrop(i)}
					>
						<span
							className="resolver-box__resource-handle"
							draggable
							onDragStart={() => setDragIndex(i)}
							aria-label="Reorder resource"
						>
							<GripVertical size={13} />
						</span>
						<ResourceRow
							resource={res}
							onChange={(patch) => updateResourceAt(i, patch)}
							onRemove={() => removeResourceAt(i)}
						/>
					</div>
				))}
				<button type="button" className="resolver-box__add-link" onClick={addResource}>
					+ Add Resource
				</button>
			</div>

			<TextField
				label="Footer"
				value={resolver.footer}
				onChange={(v) => onChange({ ...resolver, footer: v })}
			/>
		</div>
	);
}
