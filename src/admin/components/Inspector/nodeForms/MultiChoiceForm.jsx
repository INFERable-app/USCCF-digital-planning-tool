import { TextField } from '../Field.jsx';

export default function MultiChoiceForm({ node, onChange }) {
	return (
		<TextField
			label="Question"
			value={node.data.question}
			onChange={(v) => onChange({ question: v })}
		/>
	);
}
