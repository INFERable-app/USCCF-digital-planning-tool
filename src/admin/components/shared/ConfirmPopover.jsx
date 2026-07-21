import './ConfirmPopover.css';
import { useClampedPopoverPosition } from './useClampedPopoverPosition.js';

// Small inline confirm anchored at a screen position — replaces window.confirm().
export default function ConfirmPopover({ x, y, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
	const { ref, style } = useClampedPopoverPosition(x, y);

	return (
		<div className="confirm-popover-backdrop" onClick={onCancel}>
			<div ref={ref} className="confirm-popover" style={style} onClick={(e) => e.stopPropagation()}>
				<p>{message}</p>
				<div className="confirm-popover__actions">
					<button type="button" className="confirm-popover__cancel" onClick={onCancel}>
						Cancel
					</button>
					<button type="button" className="confirm-popover__confirm" onClick={onConfirm}>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
