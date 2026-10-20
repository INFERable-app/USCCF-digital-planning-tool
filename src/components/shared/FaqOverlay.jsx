import { useEffect, useRef, useState } from 'react';
import ConfirmPopover from './ConfirmPopover.jsx';
import ContentEditorFooter from './ContentEditorFooter.jsx';
import EditModeSwitch from '../edit/EditModeSwitch.jsx';
import ExitEditModeConfirm from '../edit/ExitEditModeConfirm.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { useContent } from '../../hooks/useContent.js';
import { useContentDraft } from '../../hooks/useContentDraft.js';
import { GripVertical, X } from 'lucide-react';
import './FaqOverlay.css';
import './ContentEditor.css';

function renderWithBold(text) {
  return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

// Trims every field and drops questions left empty; bullets are one per line.
function cleanFaq(draft) {
  return draft
    .filter((item) => (item.question || '').trim())
    .map((item) => {
      const clean = {
        id: item.id || crypto.randomUUID(),
        question: item.question.trim(),
        intro: (item.intro || '').trim()
      };
      const bullets = (item.bullets || []).map((b) => b.trim()).filter(Boolean);
      if (bullets.length) clean.bullets = bullets;
      if ((item.outro || '').trim()) clean.outro = item.outro.trim();
      return clean;
    });
}

function FaqEditor({ draft, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);

  function updateAt(index, patch) {
    onChange(draft.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function handleDrop(overIndex) {
    if (dragIndex === null || dragIndex === overIndex) return;
    const next = [...draft];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    onChange(next);
    setDragIndex(null);
  }

  function addItem() {
    onChange([
      ...draft,
      { _key: crypto.randomUUID(), id: crypto.randomUUID(), question: '', intro: '' }
    ]);
  }

  return (
    <div className="content-editor__body">
      {draft.map((item, i) => (
        <div
          key={item._key}
          className="content-editor__card"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
        >
          <span
            className="content-editor__handle"
            draggable
            onDragStart={() => setDragIndex(i)}
            aria-label="Reorder question"
          >
            <GripVertical size={14} />
          </span>
          <div className="content-editor__fields">
            <span className="content-editor__field-label">Question</span>
            <input
              type="text"
              value={item.question || ''}
              onChange={(e) => updateAt(i, { question: e.target.value })}
            />
            <span className="content-editor__field-label">Intro</span>
            <textarea
              rows={3}
              value={item.intro || ''}
              onChange={(e) => updateAt(i, { intro: e.target.value })}
            />
            <span className="content-editor__field-label">Bullets (one per line)</span>
            <textarea
              rows={3}
              value={(item.bullets || []).join('\n')}
              onChange={(e) =>
                updateAt(i, { bullets: e.target.value ? e.target.value.split('\n') : [] })
              }
            />
            <span className="content-editor__field-label">Outro</span>
            <textarea
              rows={2}
              value={item.outro || ''}
              onChange={(e) => updateAt(i, { outro: e.target.value })}
            />
            {!(item.question || '').trim() && (
              <p className="content-editor__warning">
                Missing a question — this item won't be saved until it has one.
              </p>
            )}
          </div>
          <button
            type="button"
            className="content-editor__remove"
            onClick={() => onChange(draft.filter((_, idx) => idx !== i))}
            aria-label="Remove question"
          >
            &minus;
          </button>
        </div>
      ))}
      <button type="button" className="content-editor__add" onClick={addItem}>
        + Add Question
      </button>
    </div>
  );
}

export default function FaqOverlay() {
  const { isFaqOpen, closeFaq } = useWizardNav();
  const { editMode, canEdit } = useEditMode();
  const { items, loading, error, save } = useContent('faq', isFaqOpen);
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
  } = useContentDraft({ items, save, close: closeFaq, closeButtonRef });

  useEffect(() => {
    if (!isFaqOpen) return;
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      if (confirmingExit) setConfirmingExit(false);
      else if (confirmAt) dismissConfirm();
      else requestClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isFaqOpen, requestClose, confirmingExit, setConfirmingExit, confirmAt, dismissConfirm]);

  if (!isFaqOpen) return null;

  function renderStatus() {
    if (error) return <p className="content-editor__status">Couldn't load the FAQ.</p>;
    return <p className="content-editor__status">Loading…</p>;
  }

  function renderList(faqItems) {
    return (
      <div className="faq-overlay__list">
        {faqItems.map((item, index) => (
          <section key={item.id} className="faq-overlay__item">
            <h3 className="faq-overlay__question">
              {index + 1}. {item.question}
            </h3>
            {item.intro && <p className="faq-overlay__text">{renderWithBold(item.intro)}</p>}
            {item.bullets && (
              <ul className="faq-overlay__bullets">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {item.outro && <p className="faq-overlay__text">{renderWithBold(item.outro)}</p>}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="faq-overlay-backdrop" onClick={requestClose}>
      <div
        className="faq-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Frequently asked questions"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="faq-overlay__heading-row">
          <h2 className="faq-overlay__title">Frequently Asked Questions</h2>
          {canEdit && <EditModeSwitch checked={editMode} onToggle={toggleEditMode} />}
          <button
            ref={closeButtonRef}
            className="faq-overlay__close"
            onClick={requestClose}
            aria-label="Close FAQ"
          >
            <X size={22} />
          </button>
        </div>

        {editMode && draft ? (
          <>
            {previewing ? (
              renderList(cleanFaq(draft))
            ) : (
              <FaqEditor draft={draft} onChange={setDraft} />
            )}
            <ContentEditorFooter
              dirty={dirty}
              saving={saving}
              saveError={saveError}
              previewing={previewing}
              onPreviewChange={setPreviewing}
              onSave={() => saveDraft(cleanFaq(draft))}
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
