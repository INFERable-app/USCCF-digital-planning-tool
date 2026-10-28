import './EditModeBar.css';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

// Asks whether to save or discard unsaved screen changes before leaving edit mode.
export default function ExitEditModeConfirm({
  onClose,
  onExited,
  message = 'You have unsaved changes. Save them before leaving edit mode?',
  discardLabel = 'Discard',
  saveLabel = 'Save & exit'
}) {
  const { saving, save, exit, exitDiscarding } = useEditMode();

  async function handleSaveAndExit() {
    if (await save()) {
      onClose();
      exit();
      onExited?.();
    } else {
      onClose();
    }
  }

  return (
    <div className="edit-bar__confirm-backdrop" onClick={onClose}>
      <div className="edit-bar__confirm" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="edit-bar__confirm-actions">
          <button type="button" onClick={onClose}>
            Keep editing
          </button>
          <button
            type="button"
            className="edit-bar__confirm-discard"
            onClick={() => {
              onClose();
              exitDiscarding();
              onExited?.();
            }}
          >
            {discardLabel}
          </button>
          <button
            type="button"
            className="edit-bar__confirm-save"
            onClick={handleSaveAndExit}
            disabled={saving}
          >
            {saving ? 'Saving…' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
