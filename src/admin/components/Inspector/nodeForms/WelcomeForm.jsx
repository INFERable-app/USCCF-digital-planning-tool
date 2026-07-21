import { TextField } from '../Field.jsx';

export default function WelcomeForm({ node, onChange }) {
	return (
		<>
			<TextField
				label="Heading"
				value={node.data.heading}
				onChange={(v) => onChange({ heading: v })}
			/>
			<TextField label="Body" value={node.data.body} onChange={(v) => onChange({ body: v })} />
		</>
	);
}
