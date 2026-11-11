import { useEffect } from 'react';

// While a modal dialog is open: makes the rest of the page inert, focuses the
// dialog's close button, and on close returns focus to whatever opened it.
export function useModalFocus(isOpen, closeButtonRef) {
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    const backdrop = closeButtonRef.current?.closest('[role="dialog"]')?.parentElement;
    const siblings = backdrop?.parentElement
      ? Array.from(backdrop.parentElement.children).filter(
          (el) => el !== backdrop && !el.hasAttribute('inert')
        )
      : [];
    siblings.forEach((el) => el.setAttribute('inert', ''));
    closeButtonRef.current?.focus();

    return () => {
      siblings.forEach((el) => el.removeAttribute('inert'));
      if (opener?.isConnected) opener.focus();
    };
  }, [isOpen, closeButtonRef]);
}
