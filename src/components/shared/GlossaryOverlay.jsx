import { useEffect, useRef } from 'react';
import ConfirmPopover from './ConfirmPopover.jsx';
import ContentEditorFooter from './ContentEditorFooter.jsx';
import EditModeSwitch from '../edit/EditModeSwitch.jsx';
import ExitEditModeConfirm from '../edit/ExitEditModeConfirm.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { useContent } from '../../hooks/useContent.js';
import { useContentDraft } from '../../hooks/useContentDraft.js';
import { X } from 'lucide-react';
import './GlossaryOverlay.css';
import './ContentEditor.css';

// Keeps only rows with both a term and a definition.
function cleanGlossary(draft) {
  return draft
    .filter((entry) => (entry.term || '').trim() && (entry.definition || '').trim())
    .map((entry) => ({ term: entry.term.trim(), definition: entry.definition.trim() }));
}

function GlossaryEditor({ draft, onChange }) {
  function updateAt(index, patch) {
    onChange(draft.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  }

  return (
    <div className="content-editor__body">
      {draft.map((entry, i) => (
        <div key={entry._key} className="content-editor__card">
          <div className="content-editor__fields">
            <span className="content-editor__field-label">Term</span>
            <input
              type="text"
              value={entry.term || ''}
              onChange={(e) => updateAt(i, { term: e.target.value })}
            />
            <span className="content-editor__field-label">Definition</span>
            <textarea
              rows={3}
              value={entry.definition || ''}
              onChange={(e) => updateAt(i, { definition: e.target.value })}
            />
            {!((entry.term || '').trim() && (entry.definition || '').trim()) && (
              <p className="content-editor__warning">
                Missing a term or definition — this entry won't be saved until both are filled in.
              </p>
            )}
          </div>
          <button
            type="button"
            className="content-editor__remove"
            onClick={() => onChange(draft.filter((_, idx) => idx !== i))}
            aria-label="Remove term"
          >
            &minus;
          </button>
        </div>
      ))}
      <button
        type="button"
        className="content-editor__add"
        onClick={() =>
          onChange([...draft, { _key: crypto.randomUUID(), term: '', definition: '' }])
        }
      >
        + Add Term
      </button>
    </div>
  );
}

export default function GlossaryOverlay() {
  const { isGlossaryOpen, closeGlossary } = useWizardNav();
  const { editMode, canEdit } = useEditMode();
  const { items, loading, error, save } = useContent('glossary', isGlossaryOpen);
  const closeButtonRef = useRef(null);
  const {
    draft,
    setDraft,
    dirty,
    saving,
    saveError,
    cancel,
    saveDraft,
    previewing,
    setPreviewing,
    requestClose,
    toggleEditMode,
    confirmAt,
    confirmDiscard,
    dismissConfirm,
    confirmingExit,
    setConfirmingExit
  } = useContentDraft({ items, save, close: closeGlossary, closeButtonRef });

  useEffect(() => {
    if (!isGlossaryOpen) return;
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      if (confirmingExit) setConfirmingExit(false);
      else if (confirmAt) dismissConfirm();
      else requestClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isGlossaryOpen, requestClose, confirmingExit, setConfirmingExit, confirmAt, dismissConfirm]);

  if (!isGlossaryOpen) return null;

  function renderStatus() {
    if (error) return <p className="content-editor__status">Couldn't load the glossary.</p>;
    return <p className="content-editor__status">Loading…</p>;
  }

  function renderList(entries) {
    return (
      <dl className="glossary-overlay__list">
        {entries.map((entry) => (
          <div key={entry.term} className="glossary-overlay__entry">
            <dt className="glossary-overlay__term">{entry.term}</dt>
            <dd className="glossary-overlay__definition">{entry.definition}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div className="glossary-overlay-backdrop" onClick={requestClose}>
      <div
        className="glossary-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Glossary of terms"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glossary-overlay__heading-row">
          <h2 className="glossary-overlay__title">Glossary of Terms</h2>
          {canEdit && <EditModeSwitch checked={editMode} onToggle={toggleEditMode} />}
          <button
            ref={closeButtonRef}
            className="glossary-overlay__close"
            onClick={requestClose}
            aria-label="Close glossary"
          >
            <X size={22} />
          </button>
        </div>

        {editMode && draft ? (
          <>
            {previewing ? (
              renderList(cleanGlossary(draft))
            ) : (
              <GlossaryEditor draft={draft} onChange={setDraft} />
            )}
            <ContentEditorFooter
              dirty={dirty}
              saving={saving}
              saveError={saveError}
              previewing={previewing}
              onPreviewChange={setPreviewing}
              onSave={() => saveDraft(cleanGlossary(draft))}
              onCancel={cancel}
            />
          </>
        ) : items && !loading ? (
          renderList(items)
        ) : (
          renderStatus()
        )}

        {confirmAt && (
          <ConfirmPopover
            x={confirmAt.x}
            y={confirmAt.y}
            message="Discard unsaved changes?"
            confirmLabel="Discard"
            onConfirm={confirmDiscard}
            onCancel={dismissConfirm}
          />
        )}

        {confirmingExit && <ExitEditModeConfirm onClose={() => setConfirmingExit(false)} />}
      </div>
    </div>
  );
}
