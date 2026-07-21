export function TextField({ label, value, onChange, placeholder, mono }) {
	return (
		<div className={`inspector-field${mono ? ' inspector-field--mono' : ''}`}>
			<label>{label}</label>
			<input
				type="text"
				value={value ?? ''}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
	return (
		<div className="inspector-field">
			<label>{label}</label>
			<textarea
				rows={rows}
				value={value ?? ''}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}

export function SelectField({ label, value, onChange, options }) {
	return (
		<div className="inspector-field">
			<label>{label}</label>
			<select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
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
	return (
		<div className="inspector-field inspector-field--checkbox">
			<input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
			<label>{label}</label>
		</div>
	);
}
