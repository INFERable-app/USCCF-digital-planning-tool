import { TextField, SelectField, CheckboxField } from './Field.jsx';

export default function EdgeForm({ edge, nodeOptions, onChange, onRenameId }) {
	return (
		<>
			<TextField label="Edge ID" mono value={edge.id} onChange={onRenameId} />
			<TextField label="Label" value={edge.data.label} onChange={(v) => onChange({ label: v })} />
			<SelectField
				label="Target Node"
				value={edge.target}
				onChange={(v) => onChange({ targetNodeId: v })}
				options={nodeOptions}
			/>
			<TextField
				label="Store Key"
				mono
				value={edge.data.storeKey}
				onChange={(v) => onChange({ storeKey: v || undefined })}
			/>
			<TextField
				label="Value"
				mono
				value={edge.data.value}
				onChange={(v) => onChange({ value: v || undefined })}
			/>
			<CheckboxField
				label="Disabled"
				checked={edge.data.disabled}
				onChange={(v) => onChange({ disabled: v || undefined })}
			/>
		</>
	);
}
