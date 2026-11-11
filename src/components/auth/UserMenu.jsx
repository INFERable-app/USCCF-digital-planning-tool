import './UserMenu.css';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { Pencil, ShieldCheck } from 'lucide-react';
import ExitEditModeConfirm from '../edit/ExitEditModeConfirm.jsx';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { canEdit, editMode, dirty, enter, exit } = useEditMode();
  const [open, setOpen] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [position, setPosition] = useState(null);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Leaves edit mode before signing out, asking first when there are unsaved changes
  function handleSignOut() {
    setOpen(false);
    if (editMode && dirty) {
      setConfirmingSignOut(true);
      return;
    }
    if (editMode) exit();
    signOut();
  }

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e) {
      if (ref.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  // Places the menu below the avatar button and limits its height to the space left in the viewport
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const rect = buttonRef.current.getBoundingClientRect();
      const top = rect.bottom + 8;
      setPosition({
        top,
        right: window.innerWidth - rect.right,
        maxHeight: window.innerHeight - top - 8
      });
    }
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open]);

  // Moves focus to the first item once the menu is placed
  useEffect(() => {
    if (open && position) menuItems()[0]?.focus();
  }, [open, position]);

  function menuItems() {
    return Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? []);
  }

  function closeAndFocusButton() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  // Arrow keys, Home, End and Tab move between items; Escape, or Tab past either end, closes the menu
  function handleMenuKeyDown(e) {
    const items = menuItems();
    const index = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      const leaving = e.shiftKey ? index <= 0 : index === items.length - 1;
      if (!leaving) return;
      e.preventDefault();
      closeAndFocusButton();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeAndFocusButton();
    }
  }

  return (
    <div className="user-menu" ref={ref}>
      <button
        ref={buttonRef}
        className="user-avatar-btn"
        onClick={() => {
          setPosition(null);
          setOpen((o) => !o);
        }}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={user.picture}
          alt={user.name}
          className="user-avatar"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextSibling.style.display = 'flex';
          }}
        />
        <span className="user-avatar-fallback" aria-hidden="true">
          {user.name?.[0]?.toUpperCase()}
        </span>
      </button>
      {/* Rendered into body so the header's overflow can't clip it */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="user-dropdown"
            role="menu"
            aria-label="Account"
            style={position ?? { visibility: 'hidden' }}
            onKeyDown={handleMenuKeyDown}
          >
            <div className="user-dropdown-info">
              <span className="user-dropdown-name">{user.name}</span>
              <span className="user-dropdown-email">{user.email}</span>
            </div>
            {canEdit && !editMode && (
              <button
                className="user-dropdown-item user-dropdown-item--edit"
                onClick={() => {
                  enter();
                  setOpen(false);
                }}
                role="menuitem"
              >
                <Pencil size={15} />
                Edit Mode
              </button>
            )}
            {canEdit && (
              <a
                className="user-dropdown-item user-dropdown-item--edit"
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck size={15} />
                Admin
              </a>
            )}
            <button className="user-dropdown-signout" onClick={handleSignOut} role="menuitem">
              Sign out
            </button>
          </div>,
          document.body
        )}
      {/* Rendered into body so the header's transform and overflow don't clip it */}
      {confirmingSignOut &&
        createPortal(
          <ExitEditModeConfirm
            message="You have unsaved changes. Save them before signing out?"
            discardLabel="Discard & sign out"
            saveLabel="Save & sign out"
            onExited={signOut}
            onClose={() => setConfirmingSignOut(false)}
          />,
          document.body
        )}
    </div>
  );
}
