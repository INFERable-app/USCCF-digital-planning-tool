import { TextField } from '../Field.jsx';

export default function RadioSurveyForm({ node, onChange }) {
	return (
		<>
			<TextField
				label="Question"
				value={node.data.question}
				onChange={(v) => onChange({ question: v })}
			/>
			<TextField
				label="Submit Label"
				placeholder="Next"
				value={node.data.submitLabel}
				onChange={(v) => onChange({ submitLabel: v })}
			/>
		</>
	);
}
