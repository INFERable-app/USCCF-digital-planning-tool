import './SaveModal.css';
import { useRef, useState } from 'react';
import { usePopoverFocus } from '../../../hooks/usePopoverFocus.js';

export default function SaveModal({ onClose, onConfirm }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const dialogRef = useRef(null);
  usePopoverFocus(dialogRef, onClose);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await onConfirm();
      setMessage({ type: 'success', text: 'Graph saved to database successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
    } finally {
      setSaving(false);
    }
  }

  const saved = message?.type === 'success';

  return (
    <div className="save-modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="save-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="save-modal__header">
          <h2 id="save-modal-title">Save Graph to Database</h2>
          <button type="button" className="save-modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="save-modal__warning">
          <strong>This will replace the live graph in Neo4j.</strong>
          <p>All users will see the updated wizard immediately.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div role="status">
            {saved && (
              <div className="save-modal__message save-modal__message--success">{message.text}</div>
            )}
          </div>
          {message?.type === 'error' && (
            <div className="save-modal__message save-modal__message--error" role="alert">
              {message.text}
            </div>
          )}

          <div className="save-modal__footer">
            <button type="button" className="save-modal__cancel" onClick={onClose}>
              {saved ? 'Close' : 'Cancel'}
            </button>
            <button type="submit" className="save-modal__submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save to Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
