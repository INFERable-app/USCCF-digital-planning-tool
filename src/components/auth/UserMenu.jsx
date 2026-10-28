import './UserMenu.css';
import { useState, useEffect, useRef } from 'react';
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
  const ref = useRef(null);

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
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div className="user-menu" ref={ref}>
      <button
        className="user-avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
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
      {open && (
        <div className="user-dropdown" role="menu">
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
        </div>
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
