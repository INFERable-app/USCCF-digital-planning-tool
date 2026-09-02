import WhenConditionRow from './WhenConditionRow.jsx';
import ResourceListEditor from '../../edit/ResourceListEditor.jsx';
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

			<ResourceListEditor
				resources={resources}
				onChange={(next) => onChange({ ...resolver, resources: next })}
			/>

			<TextField
				label="Footer"
				value={resolver.footer}
				onChange={(v) => onChange({ ...resolver, footer: v })}
			/>
		</div>
	);
}
