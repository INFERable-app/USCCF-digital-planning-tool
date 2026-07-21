import './ResolversEditor.css';
import ResolverBox from './ResolverBox.jsx';

export default function ResolversEditor({ resolvers, onChange }) {
	const list = resolvers || [];

	function updateAt(index, updated) {
		const next = [...list];
		next[index] = updated;
		onChange(next);
	}

	function removeAt(index) {
		onChange(list.filter((_, i) => i !== index));
	}

	function add() {
		onChange([...list, { when: {} }]);
	}

	return (
		<div className="resolvers-editor">
			{list.length === 0 && (
				<p className="resolvers-editor__empty">No resolvers yet — add one below.</p>
			)}
			{list.map((resolver, i) => (
				<ResolverBox
					key={i}
					resolver={resolver}
					index={i}
					onChange={(updated) => updateAt(i, updated)}
					onRemove={() => removeAt(i)}
				/>
			))}
			<button type="button" className="resolvers-editor__add" onClick={add}>
				+ Add Resolver
			</button>
		</div>
	);
}
