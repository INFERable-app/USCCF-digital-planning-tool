export default function WhenConditionRow({
	conditionKey,
	values,
	onChangeKey,
	onChangeValues,
	onRemove
}) {
	const displayKey = /^__new/.test(conditionKey) ? '' : conditionKey;

	return (
		<div className="when-condition-row">
			<input
				type="text"
				defaultValue={displayKey}
				placeholder="Answer key (e.g. challenge)"
				onBlur={(e) => onChangeKey(e.target.value)}
			/>
			<input
				type="text"
				defaultValue={(values || []).join(', ')}
				placeholder="Accepted values (comma-separated)"
				onBlur={(e) => onChangeValues(e.target.value)}
			/>
			<button type="button" onClick={onRemove} aria-label="Remove condition">
				&minus;
			</button>
		</div>
	);
}
