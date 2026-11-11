import { useEffect, useRef, useState } from 'react';

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea';

// For small modal popovers: puts focus inside on open (unless something inside
// already has it), keeps Tab cycling within, closes on Escape, and returns
// focus to whatever opened it once it closes.
export function usePopoverFocus(containerRef, onClose) {
  // Captured on first render, before any autoFocus moves focus inside
  const [opener] = useState(() => document.activeElement);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!container.contains(document.activeElement)) {
      container.querySelector(FOCUSABLE)?.focus();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(container.querySelectorAll(FOCUSABLE));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      const active = document.activeElement;
      const focusLost = !active || active === document.body || container.contains(active);
      if (focusLost && opener?.isConnected) opener.focus();
    };
  }, [containerRef, opener]);
}
