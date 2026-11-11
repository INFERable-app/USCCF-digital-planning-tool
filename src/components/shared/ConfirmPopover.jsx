import './ConfirmPopover.css';
import { useEffect, useId, useState } from 'react';
import { useClampedPopoverPosition } from './useClampedPopoverPosition.js';

// Small inline confirm anchored at a screen position — replaces window.confirm().
export default function ConfirmPopover({
  x,
  y,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel
}) {
  const { ref, style } = useClampedPopoverPosition(x, y);
  const messageId = useId();
  // Captured on first render, before autoFocus moves focus to Cancel
  const [opener] = useState(() => document.activeElement);

  // Returns focus to whatever opened the popover once it closes
  useEffect(() => {
    const popover = ref.current;
    return () => {
      const active = document.activeElement;
      const focusLost = !active || active === document.body || popover?.contains(active);
      if (focusLost && opener?.isConnected) opener.focus();
    };
  }, [ref, opener]);

  // Escape cancels; Tab and Shift+Tab cycle between the two buttons
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      onCancel();
      return;
    }
    if (e.key !== 'Tab') return;
    const buttons = Array.from(ref.current.querySelectorAll('button'));
    const index = buttons.indexOf(document.activeElement);
    const next = e.shiftKey
      ? (index - 1 + buttons.length) % buttons.length
      : (index + 1) % buttons.length;
    e.preventDefault();
    buttons[next].focus();
  }

  return (
    <div className="confirm-popover-backdrop" onClick={onCancel}>
      <div
        ref={ref}
        className="confirm-popover"
        style={style}
        role="alertdialog"
        aria-modal="true"
        aria-describedby={messageId}
        aria-label="Confirm"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <p id={messageId}>{message}</p>
        <div className="confirm-popover__actions">
          <button type="button" className="confirm-popover__cancel" onClick={onCancel} autoFocus>
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
