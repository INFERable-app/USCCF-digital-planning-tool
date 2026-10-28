import { useMemo, useRef, useState } from 'react';
import { buildUseCaseTree } from '../../graph/buildUseCaseTree.js';
import { useDrawer } from '../../contexts/DrawerContext.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import {
  ChevronLeft,
  ChevronRight,
  Library,
  HelpCircle,
  BookOpen,
  RotateCcw,
  Pencil
} from 'lucide-react';
import ConfirmPopover from './ConfirmPopover.jsx';
import './UseCaseNav.css';

export const USE_CASE_NAV_TITLE = 'Your Goals';

// The row's label: a navigation button, or a rename input while renaming in edit mode
function RowLabel({ row, onJump, onNavigate, leaf }) {
  const { editMode, setEdgeField } = useEditMode();
  const [renaming, setRenaming] = useState(false);
  const [text, setText] = useState(row.label);
  const cancelledRef = useRef(false);
  const originalRef = useRef(row.label);

  function startRename() {
    cancelledRef.current = false;
    originalRef.current = row.label;
    setText(row.label);
    setRenaming(true);
  }

  // Writes every non-blank keystroke to the draft so the screen updates live
  function handleChange(value) {
    setText(value);
    const trimmed = value.trim();
    if (trimmed && trimmed !== row.label) setEdgeField(row.id, 'label', trimmed);
  }

  // Puts the label back as it was when the rename started
  function restoreOriginal() {
    if (row.label !== originalRef.current) setEdgeField(row.id, 'label', originalRef.current);
  }

  function commit() {
    if (cancelledRef.current) return;
    if (!text.trim()) restoreOriginal();
    setRenaming(false);
  }

  if (renaming) {
    return (
      <span className="usecase-nav__rename-wrap">
        {leaf && <span className="usecase-nav__caret-spacer" aria-hidden="true" />}
        <span className="usecase-nav__dot" aria-hidden="true" />
        <input
          type="text"
          className="usecase-nav__rename"
          value={text}
          aria-label={`Rename "${row.label}"`}
          autoFocus
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') {
              cancelledRef.current = true;
              restoreOriginal();
              setRenaming(false);
            }
          }}
        />
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        className="usecase-nav__label-btn"
        disabled={row.disabled || !row.targetNodeId}
        onClick={() => {
          onJump(row.edgePath);
          onNavigate();
        }}
      >
        {leaf && <span className="usecase-nav__caret-spacer" aria-hidden="true" />}
        <span className="usecase-nav__dot" aria-hidden="true" />
        <span className="usecase-nav__label">{row.label}</span>
      </button>
      {editMode && (
        <button
          type="button"
          className="usecase-nav__rename-btn"
          aria-label={`Rename "${row.label}"`}
          title="Rename"
          onClick={startRename}
        >
          <Pencil size={13} />
        </button>
      )}
    </>
  );
}

function TreeRow({ row, depth, onJump, onNavigate, isActive }) {
  const [collapsed, setCollapsed] = useState(true);
  const isBranch = Array.isArray(row.children);
  const active = isActive(row);

  if (isBranch) {
    return (
      <li className="usecase-nav__item">
        <div
          className={`usecase-nav__row usecase-nav__row--branch${active ? ' usecase-nav__row--active' : ''}`}
        >
          <button
            type="button"
            className="usecase-nav__caret-btn"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed((c) => !c)}
          >
            <ChevronRight
              size={14}
              style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}
            />
          </button>
          <RowLabel row={row} onJump={onJump} onNavigate={onNavigate} />
        </div>
        {!collapsed && row.children.length > 0 && (
          <ul className="usecase-nav__group" role="group">
            {row.children.map((child) => (
              <TreeRow
                key={child.id}
                row={child}
                depth={depth + 1}
                onJump={onJump}
                onNavigate={onNavigate}
                isActive={isActive}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="usecase-nav__item">
      <div
        className={`usecase-nav__row usecase-nav__row--leaf${active ? ' usecase-nav__row--active' : ''}`}
      >
        <RowLabel row={row} onJump={onJump} onNavigate={onNavigate} leaf />
      </div>
    </li>
  );
}

export default function UseCaseNav() {
  const { isOpen, toggle, close } = useDrawer();
  const {
    nodes,
    edges,
    currentEdgeIds,
    startNodeId,
    jumpAlongPath,
    openResourceLibrary,
    openFaq,
    openGlossary,
    resetProgress,
    hasProgress
  } = useWizardNav();
  const [confirmAt, setConfirmAt] = useState(null);

  const tree = useMemo(
    () => buildUseCaseTree(nodes, edges, startNodeId),
    [nodes, edges, startNodeId]
  );

  // A row is active if its own edge path (start -> that row) is an exact
  // prefix of the actual structural path to currentNodeId, so it stays
  // highlighted no matter how many further screens the user has since
  // navigated through. Derived fresh from currentNodeId every render (see
  // getNodePath), not accumulated session state, so a previously-visited
  // then-abandoned branch never lights up alongside the real current one.
  function isActive(row) {
    if (row.edgePath.every((id, i) => currentEdgeIds[i] === id)) return true;
    return row.children?.some(isActive) ?? false;
  }

  return (
    <div className="usecase-nav-track">
      {isOpen && <div className="usecase-nav-backdrop" onClick={close} aria-hidden="true" />}
      <aside className="usecase-nav" aria-label="Use case navigation">
        <div className="usecase-nav__heading-row">
          <h2 className="usecase-nav__title">{USE_CASE_NAV_TITLE}</h2>
          <button
            className="sidebar-close-btn"
            onClick={toggle}
            aria-label="Close navigation panel"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="usecase-nav__rail">
          <ul className="usecase-nav__group usecase-nav__group--root" role="tree">
            {tree.map((row) => (
              <TreeRow
                key={row.id}
                row={row}
                depth={0}
                onJump={jumpAlongPath}
                onNavigate={close}
                isActive={isActive}
              />
            ))}
          </ul>
        </nav>

        <div className="usecase-nav__footer">
          <button type="button" className="usecase-nav__library-link" onClick={openResourceLibrary}>
            <Library size={16} aria-hidden="true" />
            <span>Resource Library</span>
          </button>
          <button type="button" className="usecase-nav__library-link" onClick={openFaq}>
            <HelpCircle size={16} aria-hidden="true" />
            <span>FAQ</span>
          </button>
          <button type="button" className="usecase-nav__library-link" onClick={openGlossary}>
            <BookOpen size={16} aria-hidden="true" />
            <span>Glossary</span>
          </button>
          {hasProgress && (
            <button
              type="button"
              className="usecase-nav__reset"
              onClick={(e) => setConfirmAt({ x: e.clientX, y: e.clientY })}
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Start over</span>
            </button>
          )}
        </div>
      </aside>
      {confirmAt && (
        <ConfirmPopover
          x={confirmAt.x}
          y={confirmAt.y}
          message="Start over? This clears your saved progress."
          confirmLabel="Start over"
          onConfirm={() => {
            setConfirmAt(null);
            resetProgress();
            close();
          }}
          onCancel={() => setConfirmAt(null)}
        />
      )}
    </div>
  );
}
