import { TextField, SelectField } from '../Field.jsx';

export default function CheckboxSurveyForm({ node, onChange, outgoingEdges }) {
	const edgeOptions = [
		{ value: '', label: '— none —' },
		...outgoingEdges.map((e) => ({ value: e.id, label: `${e.id} ("${e.label || 'untitled'}")` }))
	];

	return (
		<>
			<TextField
				label="Question"
				value={node.data.question}
				onChange={(v) => onChange({ question: v })}
			/>
			<TextField
				label="Submit Label"
				placeholder="Submit"
				value={node.data.submitLabel}
				onChange={(v) => onChange({ submitLabel: v })}
			/>
			<SelectField
				label="Submit Edge ID"
				value={node.data.submitEdgeId}
				onChange={(v) => onChange({ submitEdgeId: v || undefined })}
				options={edgeOptions}
			/>
		</>
	);
}
