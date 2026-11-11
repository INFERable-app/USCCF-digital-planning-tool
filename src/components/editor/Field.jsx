import './Field.css';
import { useId } from 'react';

export function TextField({ label, value, onChange, placeholder, mono }) {
  const id = useId();
  return (
    <div className={`inspector-field${mono ? ' inspector-field--mono' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  const id = useId();
  return (
    <div className="inspector-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className="inspector-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({ label, checked, onChange }) {
  const id = useId();
  return (
    <div className="inspector-field inspector-field--checkbox">
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
