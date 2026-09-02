import '../editor/ResolversEditor/ResolversEditor.css';
import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import ResourceRow from '../editor/ResolversEditor/ResourceRow.jsx';

export default function ResourceListEditor({ resources = [], onChange }) {
	const [dragIndex, setDragIndex] = useState(null);

	function updateResourceAt(index, patch) {
		const nextResources = [...resources];
		if ('type' in patch) {
			const current = resources[index];
			const base = { _key: current._key, type: patch.type, label: current.label || '' };
			nextResources[index] =
				patch.type === 'prompt'
					? { ...base, text: current.text || '' }
					: { ...base, description: current.description || '' };
		} else {
			nextResources[index] = { ...nextResources[index], ...patch };
		}
		onChange(nextResources);
	}

	function removeResourceAt(index) {
		onChange(resources.filter((_, i) => i !== index));
	}

	function addResource() {
		onChange([
			...resources,
			{ _key: crypto.randomUUID(), type: 'link', label: '', url: '', description: '' }
		]);
	}

	function moveResource(fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const nextResources = [...resources];
		const [moved] = nextResources.splice(fromIndex, 1);
		nextResources.splice(toIndex, 0, moved);
		onChange(nextResources);
	}

	function handleResourceDrop(overIndex) {
		if (dragIndex === null || dragIndex === overIndex) return;
		moveResource(dragIndex, overIndex);
		setDragIndex(null);
	}

	return (
		<div className="resolver-box__resources">
			<label>Resources</label>
			{resources.map((res, i) => (
				<div
					key={res._key ?? i}
					className="resolver-box__resource"
					onDragOver={(e) => e.preventDefault()}
					onDrop={() => handleResourceDrop(i)}
				>
					<span
						className="resolver-box__resource-handle"
						draggable
						onDragStart={() => setDragIndex(i)}
						aria-label="Reorder resource"
					>
						<GripVertical size={13} />
					</span>
					<ResourceRow
						resource={res}
						onChange={(patch) => updateResourceAt(i, patch)}
						onRemove={() => removeResourceAt(i)}
					/>
				</div>
			))}
			<button type="button" className="resolver-box__add-link" onClick={addResource}>
				+ Add Resource
			</button>
		</div>
	);
}
