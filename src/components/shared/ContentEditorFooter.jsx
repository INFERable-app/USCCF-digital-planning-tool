import './ContentEditor.css';

// Edit / Preview switch and Save / Cancel row at the bottom of a help-content overlay in Edit Mode.
export default function ContentEditorFooter({
  dirty,
  saving,
  saveError,
  previewing,
  onPreviewChange,
  onSave,
  onCancel
}) {
  return (
    <div className="content-editor__footer">
      {saveError && <p className="content-editor__error">Couldn't save: {saveError}</p>}
      <div className="content-editor__views" role="group" aria-label="Editor view">
        <button
          type="button"
          className="content-editor__view"
          aria-pressed={!previewing}
          onClick={() => onPreviewChange(false)}
        >
          Edit
        </button>
        <button
          type="button"
          className="content-editor__view"
          aria-pressed={previewing}
          onClick={() => onPreviewChange(true)}
        >
          Preview
        </button>
      </div>
      <div className="content-editor__actions">
        <button
          type="button"
          className="content-editor__btn"
          onClick={onCancel}
          disabled={!dirty || saving}
        >
          Cancel
        </button>
        <button
          type="button"
          className="content-editor__btn content-editor__btn--save"
          onClick={onSave}
          disabled={!dirty || saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
