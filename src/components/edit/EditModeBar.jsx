import './EditModeBar.css';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function EditModeBar() {
	const { editMode, dirty, saving, error, cancel, save, exit, exitDiscarding } = useEditMode();
	const [confirmingExit, setConfirmingExit] = useState(false);

	if (!editMode) return null;

	function handleExit() {
		if (dirty) setConfirmingExit(true);
		else exit();
	}

	async function handleSaveAndExit() {
		if (await save()) {
			setConfirmingExit(false);
			exit();
		} else {
			setConfirmingExit(false);
		}
	}

	return (
		<div className="edit-bar">
			<div className="edit-bar__status">
				<span className="edit-bar__label">
					<Pencil size={16} />
					Edit mode
				</span>
				{dirty && (
					<span className="edit-bar__dirty">
						<span className="edit-bar__dot" aria-hidden="true" />
						Unsaved changes
					</span>
				)}
			</div>

			<div className="edit-bar__actions">
				<button
					type="button"
					className="edit-bar__btn"
					onClick={cancel}
					disabled={!dirty || saving}
				>
					Cancel
				</button>
				<button
					type="button"
					className="edit-bar__btn edit-bar__btn--save"
					onClick={save}
					disabled={!dirty || saving}
				>
					{saving ? 'Saving…' : 'Save'}
				</button>
				<span className="edit-bar__divider" aria-hidden="true" />
				<button
					type="button"
					className="edit-bar__btn edit-bar__btn--exit"
					onClick={handleExit}
					disabled={saving}
				>
					Exit edit mode
				</button>
			</div>

			{error && <div className="edit-bar__error">{error}</div>}

			{confirmingExit && (
				<div className="edit-bar__confirm-backdrop" onClick={() => setConfirmingExit(false)}>
					<div className="edit-bar__confirm" onClick={(e) => e.stopPropagation()}>
						<p>You have unsaved changes. Save them before leaving edit mode?</p>
						<div className="edit-bar__confirm-actions">
							<button type="button" onClick={() => setConfirmingExit(false)}>
								Keep editing
							</button>
							<button
								type="button"
								className="edit-bar__confirm-discard"
								onClick={() => {
									setConfirmingExit(false);
									exitDiscarding();
								}}
							>
								Discard
							</button>
							<button
								type="button"
								className="edit-bar__confirm-save"
								onClick={handleSaveAndExit}
								disabled={saving}
							>
								{saving ? 'Saving…' : 'Save & exit'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
