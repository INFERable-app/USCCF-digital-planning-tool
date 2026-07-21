import './CreateConnectedNodePopover.css';
import { useState } from 'react';
import { NODE_TYPES, nodeTypeMeta } from '../nodes/nodeTypeMeta.js';
import { useClampedPopoverPosition } from '../shared/useClampedPopoverPosition.js';

export default function CreateConnectedNodePopover({ x, y, onConfirm, onCancel }) {
	const [label, setLabel] = useState('');
	const { ref, style } = useClampedPopoverPosition(x, y);

	function handleSubmit(type) {
		onConfirm({ type, label: label.trim() || 'Continue' });
	}

	return (
		<div className="connect-popover-backdrop" onClick={onCancel}>
			<div ref={ref} className="connect-popover" style={style} onClick={(e) => e.stopPropagation()}>
				<label htmlFor="connect-popover-label">Edge label</label>
				<input
					id="connect-popover-label"
					type="text"
					autoFocus
					placeholder="e.g. Yes, continue"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSubmit('multiChoice');
						if (e.key === 'Escape') onCancel();
					}}
				/>
				<div className="connect-popover__types">
					{NODE_TYPES.map((type) => {
						const meta = nodeTypeMeta(type);
						const Icon = meta.icon;
						return (
							<button
								key={type}
								type="button"
								className="connect-popover__type-btn"
								style={{ '--type-color': meta.color }}
								onClick={() => handleSubmit(type)}
							>
								<Icon size={14} />
								{meta.label}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
