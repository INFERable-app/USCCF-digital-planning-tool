import { flushSync } from 'react-dom';

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
        aria-label="Answer key"
        onBlur={(e) => flushSync(() => onChangeKey(e.target.value))}
      />
      <input
        type="text"
        defaultValue={(values || []).join(', ')}
        placeholder="Accepted values (comma-separated)"
        aria-label="Accepted values (comma-separated)"
        onBlur={(e) => flushSync(() => onChangeValues(e.target.value))}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove condition ${displayKey ? `"${displayKey}"` : ''}`.trim()}
      >
        &minus;
      </button>
    </div>
  );
}
