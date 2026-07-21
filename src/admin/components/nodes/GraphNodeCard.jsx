import { Handle, Position } from '@xyflow/react';
import './GraphNodeCard.css';
import { nodeTypeMeta } from './nodeTypeMeta.js';

export default function GraphNodeCard({ id, data, selected }) {
	const meta = nodeTypeMeta(data.type);
	const Icon = meta.icon;
	const canHaveOutgoing = data.type !== 'results';

	return (
		<div
			className={`graph-node-card${selected ? ' graph-node-card--selected' : ''}`}
			style={{ '--node-accent': meta.color }}
		>
			<Handle
				type="target"
				position={Position.Left}
				className="graph-node-handle graph-node-handle--target"
			/>
			<div className="graph-node-card__face">
				<div className="graph-node-card__accent" />
				<div className="graph-node-card__body">
					<div className="graph-node-card__type">
						<Icon size={13} />
						<span>{meta.label}</span>
					</div>
					<div className="graph-node-card__label">{data.label || id}</div>
					<div className="graph-node-card__id">{id}</div>
				</div>
			</div>
			{canHaveOutgoing && (
				<Handle
					type="source"
					position={Position.Right}
					className="graph-node-handle graph-node-handle--source"
					title="Drag to connect"
				/>
			)}
		</div>
	);
}
