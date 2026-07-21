import './AddNodeMenu.css';
import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { NODE_TYPES, nodeTypeMeta } from '../nodes/nodeTypeMeta.js';

export default function AddNodeMenu({ onAdd }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		if (!open) return;
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [open]);

	return (
		<div className="add-node-menu" ref={ref}>
			<button type="button" className="admin-toolbar__btn" onClick={() => setOpen((v) => !v)}>
				<Plus size={14} />
				Add Node
			</button>
			{open && (
				<div className="add-node-menu__dropdown">
					{NODE_TYPES.map((type) => {
						const meta = nodeTypeMeta(type);
						const Icon = meta.icon;
						return (
							<button
								key={type}
								type="button"
								className="add-node-menu__item"
								style={{ '--type-color': meta.color }}
								onClick={() => {
									onAdd(type);
									setOpen(false);
								}}
							>
								<Icon size={14} />
								{meta.label}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
