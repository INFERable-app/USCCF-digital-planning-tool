import './EdgeControls.css';
import { useState } from 'react';
import { ArrowRight, GripVertical, MoreHorizontal, Search } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { nodeTypeMeta } from '../../admin/components/nodes/nodeTypeMeta.js';

function NodePicker({ nodes, currentTargetId, onPick, onClose }) {
	const [query, setQuery] = useState('');
	const term = query.trim().toLowerCase();
	const matches = Object.values(nodes).filter((node) => {
		if (!term) return true;
		const text = `${node.id} ${node.question ?? ''} ${node.heading ?? ''}`.toLowerCase();
		return text.includes(term);
	});

	return (
		<div className="edge-picker-backdrop" onClick={onClose}>
			<div className="edge-picker" onClick={(e) => e.stopPropagation()}>
				<div className="edge-picker__search">
					<Search size={14} />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search screens…"
						autoFocus
					/>
				</div>
				<div className="edge-picker__list">
					{matches.map((node) => (
						<button
							key={node.id}
							type="button"
							className={`edge-picker__row${node.id === currentTargetId ? ' edge-picker__row--current' : ''}`}
							onClick={() => onPick(node.id)}
						>
							<span
								className="edge-picker__swatch"
								style={{ background: nodeTypeMeta(node.type).color }}
							/>
							<span className="edge-picker__text">
								<span className="edge-picker__title">
									{node.question ?? node.heading ?? nodeTypeMeta(node.type).label}
								</span>
								<span className="edge-picker__id">
									{node.id}
									{node.id === currentTargetId ? ' · current' : ''}
								</span>
							</span>
						</button>
					))}
					{matches.length === 0 && <p className="edge-picker__empty">No screens match.</p>}
				</div>
			</div>
		</div>
	);
}

// The controls that wrap a single option in edit mode: reorder grip, a chip
// that walks into the destination screen, and the overflow menu.
export default function EdgeControls({ edge, sourceId, nodes, onDragStart, children }) {
	const { removeButton, retargetButton, setEdgeField, goToNode } = useEditMode();
	const [menuOpen, setMenuOpen] = useState(false);
	const [picking, setPicking] = useState(false);

	return (
		<>
			<span
				className="edge-controls__grip"
				draggable
				onDragStart={() => onDragStart(edge.id)}
				aria-label="Reorder button"
			>
				<GripVertical size={14} />
			</span>

			<div className="edge-controls__option">{children}</div>

			<button
				type="button"
				className="edge-controls__chip"
				onClick={() => goToNode(edge.targetNodeId)}
				title={`Go to ${edge.targetNodeId}`}
				aria-label={`Go to ${edge.targetNodeId}`}
			>
				<ArrowRight size={15} />
			</button>

			<div className="edge-controls__menu-wrap">
				<button
					type="button"
					className="edge-controls__chip"
					onClick={() => setMenuOpen((o) => !o)}
					aria-label="Button options"
					aria-expanded={menuOpen}
				>
					<MoreHorizontal size={15} />
				</button>
				{menuOpen && (
					<>
						<div className="edge-controls__menu-scrim" onClick={() => setMenuOpen(false)} />
						<div className="edge-controls__menu" role="menu">
							<button
								type="button"
								role="menuitem"
								onClick={() => {
									setMenuOpen(false);
									setPicking(true);
								}}
							>
								Change destination…
							</button>
							<button
								type="button"
								role="menuitem"
								onClick={() => {
									setEdgeField(edge.id, 'disabled', !edge.disabled);
									setMenuOpen(false);
								}}
							>
								{edge.disabled ? 'Enable button' : 'Disable button'}
							</button>
							<button
								type="button"
								role="menuitem"
								className="edge-controls__menu-danger"
								onClick={() => {
									setMenuOpen(false);
									removeButton(sourceId, edge.id);
								}}
							>
								Delete button
							</button>
						</div>
					</>
				)}
			</div>

			{picking && (
				<NodePicker
					nodes={nodes}
					currentTargetId={edge.targetNodeId}
					onPick={(nodeId) => {
						retargetButton(edge.id, nodeId);
						setPicking(false);
					}}
					onClose={() => setPicking(false)}
				/>
			)}
		</>
	);
}
