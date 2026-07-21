import ResolversEditor from '../ResolversEditor/ResolversEditor.jsx';

export default function ResultsForm({ node, onChange }) {
	return (
		<ResolversEditor
			resolvers={node.data.resolvers}
			onChange={(resolvers) => onChange({ resolvers })}
		/>
	);
}
