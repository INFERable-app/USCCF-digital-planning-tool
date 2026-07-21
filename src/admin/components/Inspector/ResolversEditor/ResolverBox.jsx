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
	const hasPrompt = !!resolver.promptBlock;

	const combinedResources = hasPrompt
		? [
				{
					type: 'prompt',
					label: resolver.promptBlock.label || 'AI Prompt Template',
					text: resolver.promptBlock.text || ''
				},
				...resources
			]
		: resources;

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

	function updateResourceAt(displayIndex, patch) {
		const isPromptSlot = hasPrompt && displayIndex === 0;
		const resourceIndex = displayIndex - (hasPrompt ? 1 : 0);

		if ('type' in patch) {
			const newType = patch.type;
			if (newType === 'prompt') {
				const current = isPromptSlot ? resolver.promptBlock : resources[resourceIndex];
				const nextResources = isPromptSlot
					? resources
					: resources.filter((_, i) => i !== resourceIndex);
				onChange({
					...resolver,
					promptBlock: { label: current.label || '', text: current.text || '' },
					resources: nextResources
				});
			} else if (isPromptSlot) {
				const { promptBlock: _dropped, ...rest } = resolver;
				void _dropped;
				onChange({
					...rest,
					resources: [
						{ type: newType, label: resolver.promptBlock.label || '', description: '' },
						...resources
					]
				});
			} else {
				const nextResources = [...resources];
				nextResources[resourceIndex] = {
					type: newType,
					label: resources[resourceIndex].label || '',
					description: resources[resourceIndex].description || ''
				};
				onChange({ ...resolver, resources: nextResources });
			}
			return;
		}

		if (isPromptSlot) {
			onChange({ ...resolver, promptBlock: { ...resolver.promptBlock, ...patch } });
		} else {
			const nextResources = [...resources];
			nextResources[resourceIndex] = { ...nextResources[resourceIndex], ...patch };
			onChange({ ...resolver, resources: nextResources });
		}
	}

	function removeResourceAt(displayIndex) {
		if (hasPrompt && displayIndex === 0) {
			const { promptBlock: _dropped, ...rest } = resolver;
			void _dropped;
			onChange(rest);
		} else {
			const resourceIndex = displayIndex - (hasPrompt ? 1 : 0);
			onChange({ ...resolver, resources: resources.filter((_, i) => i !== resourceIndex) });
		}
	}

	function addResource() {
		onChange({
			...resolver,
			resources: [...resources, { type: 'link', label: '', url: '', description: '' }]
		});
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
				{combinedResources.map((res, i) => (
					<ResourceRow
						key={i}
						resource={res}
						onChange={(patch) => updateResourceAt(i, patch)}
						onRemove={() => removeResourceAt(i)}
					/>
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
