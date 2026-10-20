import { useEffect, useRef, useState } from 'react';
import ResourceItem from './ResourceItem.jsx';
import ConfirmPopover from './ConfirmPopover.jsx';
import ContentEditorFooter from './ContentEditorFooter.jsx';
import ResourceListEditor from '../edit/ResourceListEditor.jsx';
import EditModeSwitch from '../edit/EditModeSwitch.jsx';
import ExitEditModeConfirm from '../edit/ExitEditModeConfirm.jsx';
import {
  isCompleteResource,
  sanitizeResources
} from '../editor/ResolversEditor/resolverSanitize.js';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { useContent } from '../../hooks/useContent.js';
import { useContentDraft } from '../../hooks/useContentDraft.js';
import { X } from 'lucide-react';
import './ResourceLibraryOverlay.css';
import './ContentEditor.css';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'start', label: 'Start here' },
  { id: 'demand', label: 'Coordinating employer demand' },
  { id: 'skills', label: 'Skills & training alignment' },
  { id: 'providers', label: 'Finding training providers' },
  { id: 'tracking', label: 'Tracking talent pipelines' },
  { id: 'templates', label: 'Templates & AI prompts' }
];

const SECTION_LABELS = {
  start: 'Start here',
  demand: 'Coordinating employer demand',
  skills: 'Skills & training alignment',
  providers: 'Finding training providers',
  tracking: 'Tracking talent pipelines',
  templates: 'Templates & AI prompts'
};

function ResourceEntry({ item }) {
  return (
    <div className="resource-overlay__entry">
      <ResourceItem item={item} showDescription={false} />
      {item.description && <p className="resource-overlay__description">{item.description}</p>}
    </div>
  );
}

// Category checkboxes shown under each resource row in the editor.
function CategoryPicker({ resource, onChange }) {
  const categories = resource.categories || [];

  function toggle(id, checked) {
    const next = checked ? [...categories, id] : categories.filter((c) => c !== id);
    onChange({ categories: Object.keys(SECTION_LABELS).filter((c) => next.includes(c)) });
  }

  return (
    <div>
      <div className="content-editor__categories">
        {Object.entries(SECTION_LABELS).map(([id, label]) => (
          <label key={id} className="content-editor__category">
            <input
              type="checkbox"
              checked={categories.includes(id)}
              onChange={(e) => toggle(id, e.target.checked)}
            />
            {label}
          </label>
        ))}
      </div>
      {!categories.length && (
        <p className="content-editor__warning">
          Pick at least one category — this resource won't be saved until it has one.
        </p>
      )}
    </div>
  );
}

// Keeps complete resources that have a category, cleaned the same way as results-screen resources.
function cleanResources(draft) {
  return draft
    .filter((res) => isCompleteResource(res) && res.categories && res.categories.length)
    .map((res) => ({
      id: res.id || crypto.randomUUID(),
      ...sanitizeResources([res])[0],
      categories: res.categories
    }));
}

export default function ResourceLibraryOverlay() {
  const { isResourceLibraryOpen, closeResourceLibrary } = useWizardNav();
  const { editMode, canEdit } = useEditMode();
  const { items, loading, error, save } = useContent('resources', isResourceLibraryOpen);
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
  } = useContentDraft({ items, save, close: closeResourceLibrary, closeButtonRef });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isResourceLibraryOpen) return;
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      if (confirmingExit) setConfirmingExit(false);
      else if (confirmAt) dismissConfirm();
      else requestClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [
    isResourceLibraryOpen,
    requestClose,
    confirmingExit,
    setConfirmingExit,
    confirmAt,
    dismissConfirm
  ]);

  if (!isResourceLibraryOpen) return null;

  function renderStatus() {
    if (error) return <p className="content-editor__status">Couldn't load resources.</p>;
    return <p className="content-editor__status">Loading…</p>;
  }

  function renderList(resources) {
    const isAll = activeTab === 'all';
    const filtered = isAll ? null : resources.filter((r) => r.categories.includes(activeTab));
    return (
      <>
        <div
          className="resource-overlay__tabs"
          role="tablist"
          aria-label="Filter resources by category"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`resource-overlay__tab${activeTab === tab.id ? ' resource-overlay__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="resource-overlay__list">
          {isAll ? (
            Object.keys(SECTION_LABELS).map((cat) => {
              const sectionItems = resources.filter((r) => r.categories.includes(cat));
              if (!sectionItems.length) return null;
              return (
                <section key={cat} className="resource-overlay__section">
                  <h3 className="resource-overlay__section-title">{SECTION_LABELS[cat]}</h3>
                  <div className="resource-overlay__items">
                    {sectionItems.map((item) => (
                      <ResourceEntry key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="resource-overlay__items">
              {filtered.map((item) => (
                <ResourceEntry key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="resource-overlay-backdrop" onClick={requestClose}>
      <div
        className="resource-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Resource library"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="resource-overlay__heading-row">
          <h2 className="resource-overlay__title">Resources</h2>
          {canEdit && <EditModeSwitch checked={editMode} onToggle={toggleEditMode} />}
          <button
            ref={closeButtonRef}
            className="resource-overlay__close"
            onClick={requestClose}
            aria-label="Close resource library"
          >
            <X size={22} />
          </button>
        </div>

        {editMode && draft ? (
          <>
            {previewing ? (
              renderList(cleanResources(draft))
            ) : (
              <div className="content-editor__body">
                <ResourceListEditor
                  resources={draft}
                  onChange={setDraft}
                  renderRowExtras={(resource, onChange) => (
                    <CategoryPicker resource={resource} onChange={onChange} />
                  )}
                />
              </div>
            )}
            <ContentEditorFooter
              dirty={dirty}
              saving={saving}
              saveError={saveError}
              previewing={previewing}
              onPreviewChange={setPreviewing}
              onSave={() => saveDraft(cleanResources(draft))}
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
