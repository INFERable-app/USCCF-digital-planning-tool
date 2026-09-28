import './UserMenu.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { Pencil, RotateCcw } from 'lucide-react';
import ConfirmPopover from '../shared/ConfirmPopover.jsx';

export default function UserMenu() {
	const { user, signOut } = useAuth();
	const { openResourceLibrary, resetProgress } = useWizardNav();
	const { canEdit, editMode, enter } = useEditMode();
	const [open, setOpen] = useState(false);
	const [confirmAt, setConfirmAt] = useState(null);
	const ref = useRef(null);

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
				onClick={() => setOpen(o => !o)}
				aria-label="Account menu"
				aria-expanded={open}
			>
				<img
					src={user.picture}
					alt={user.name}
					className="user-avatar"
					onError={e => {
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
					<button
						className="user-dropdown-item"
						onClick={() => {
							openResourceLibrary();
							setOpen(false);
						}}
						role="menuitem"
					>
						Resource Library
					</button>
					<button
						className="user-dropdown-item user-dropdown-item--reset"
						onClick={(e) => {
							setConfirmAt({ x: e.clientX, y: e.clientY });
							setOpen(false);
						}}
						role="menuitem"
					>
						<RotateCcw size={15} />
						Start over
					</button>
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
					<button className="user-dropdown-signout" onClick={signOut} role="menuitem">
						Sign out
					</button>
				</div>
			)}
			{confirmAt && (
				<ConfirmPopover
					x={confirmAt.x}
					y={confirmAt.y}
					message="Start over? This clears your saved progress."
					confirmLabel="Start over"
					onConfirm={() => {
						setConfirmAt(null);
						resetProgress();
					}}
					onCancel={() => setConfirmAt(null)}
				/>
			)}
		</div>
	);
}
