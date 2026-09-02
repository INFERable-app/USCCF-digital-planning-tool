import './ScreenActions.css';
import { useState } from 'react';
import { Lock, Trash2 } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { NODE_TYPES, nodeTypeMeta } from '../../admin/components/nodes/nodeTypeMeta.js';
import ConfirmPopover from '../shared/ConfirmPopover.jsx';

export default function ScreenActions({ node, isStartNode }) {
	const { editMode, setScreenType, removeScreen, deletionImpact } = useEditMode();
	const [confirmAt, setConfirmAt] = useState(null);

	if (!editMode) return null;

	const meta = nodeTypeMeta(node.type);
	const impact = confirmAt ? deletionImpact(node.id) : null;

	return (
		<div className="screen-actions">
			<span className="screen-actions__type" style={{ background: meta.color }}>
				{meta.label}
			</span>
			<span className="screen-actions__id">{node.id}</span>

			<select
				className="screen-actions__select"
				value={node.type}
				onChange={(e) => setScreenType(node.id, e.target.value)}
				aria-label="Change screen type"
			>
				{NODE_TYPES.map((t) => (
					<option key={t} value={t}>
						{nodeTypeMeta(t).label}
					</option>
				))}
			</select>

			{isStartNode ? (
				<span className="screen-actions__locked">
					<Lock size={12} />
					Start screen
				</span>
			) : (
				<button
					type="button"
					className="screen-actions__delete"
					onClick={(e) => setConfirmAt({ x: e.clientX, y: e.clientY })}
				>
					<Trash2 size={13} />
					Delete screen
				</button>
			)}

			{confirmAt && (
				<ConfirmPopover
					x={confirmAt.x}
					y={confirmAt.y}
					message={`Delete this screen? ${impact.incoming} button${impact.incoming === 1 ? '' : 's'} pointing at it and ${impact.outgoing} button${impact.outgoing === 1 ? '' : 's'} on it will be removed too.`}
					confirmLabel="Delete"
					onConfirm={() => {
						setConfirmAt(null);
						removeScreen(node.id);
					}}
					onCancel={() => setConfirmAt(null)}
				/>
			)}
		</div>
	);
}
