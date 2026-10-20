import './EditModeBar.css';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

// Asks whether to save or discard unsaved screen changes before leaving edit mode.
export default function ExitEditModeConfirm({ onClose }) {
  const { saving, save, exit, exitDiscarding } = useEditMode();

  async function handleSaveAndExit() {
    if (await save()) {
      onClose();
      exit();
    } else {
      onClose();
    }
  }

  return (
    <div className="edit-bar__confirm-backdrop" onClick={onClose}>
      <div className="edit-bar__confirm" onClick={(e) => e.stopPropagation()}>
        <p>You have unsaved changes. Save them before leaving edit mode?</p>
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
  );
}
