import './EdgeControls.css';
import { useEffect, useRef, useState } from 'react';
import { usePopoverFocus } from '../../hooks/usePopoverFocus.js';
import { ArrowRight, GripVertical, MoreHorizontal, Search } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { nodeTypeMeta } from '../../admin/components/nodes/nodeTypeMeta.js';
import MoveButtons from './MoveButtons.jsx';

function NodePicker({ nodes, currentTargetId, onPick, onClose }) {
  const [query, setQuery] = useState('');
  const pickerRef = useRef(null);
  usePopoverFocus(pickerRef, onClose);
  const term = query.trim().toLowerCase();
  const matches = Object.values(nodes).filter((node) => {
    if (!term) return true;
    const text = `${node.id} ${node.question ?? ''} ${node.heading ?? ''}`.toLowerCase();
    return text.includes(term);
  });

  return (
    <div className="edge-picker-backdrop" onClick={onClose}>
      <div
        ref={pickerRef}
        className="edge-picker"
        role="dialog"
        aria-modal="true"
        aria-label="Change destination"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edge-picker__search">
          <Search size={14} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screens…"
            aria-label="Search screens"
            autoFocus
          />
        </div>
        <div className="edge-picker__list">
          {matches.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`edge-picker__row${node.id === currentTargetId ? ' edge-picker__row--current' : ''}`}
              onClick={() => onPick(node.id)}
            >
              <span
                className="edge-picker__swatch"
                style={{ background: nodeTypeMeta(node.type).color }}
              />
              <span className="edge-picker__text">
                <span className="edge-picker__title">
                  {node.question ?? node.heading ?? nodeTypeMeta(node.type).label}
                </span>
                <span className="edge-picker__id">
                  {node.id}
                  {node.id === currentTargetId ? ' · current' : ''}
                </span>
              </span>
            </button>
          ))}
          {matches.length === 0 && <p className="edge-picker__empty">No screens match.</p>}
        </div>
      </div>
    </div>
  );
}

// The controls that wrap a single option in edit mode: reorder grip, a chip
// that walks into the destination screen, and the overflow menu.
export default function EdgeControls({
  edge,
  sourceId,
  nodes,
  onDragStart,
  index,
  count,
  onMove,
  children
}) {
  const { removeButton, retargetButton, setEdgeField, goToNode } = useEditMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const target = nodes[edge.targetNodeId];
  const targetTitle = target?.question ?? target?.heading ?? edge.targetNodeId;

  // Moves focus to the first item when the menu opens
  useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  // Arrow keys, Home and End move between items; Escape and Tab close the menu
  function handleMenuKeyDown(e) {
    const items = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'));
    const index = items.indexOf(document.activeElement);
    let next = null;
    if (e.key === 'ArrowDown') next = items[(index + 1) % items.length];
    else if (e.key === 'ArrowUp') next = items[(index - 1 + items.length) % items.length];
    else if (e.key === 'Home') next = items[0];
    else if (e.key === 'End') next = items[items.length - 1];
    else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      return;
    } else return;
    e.preventDefault();
    next?.focus();
  }

  return (
    <>
      <span
        className="edge-controls__grip"
        draggable
        onDragStart={() => onDragStart(edge.id)}
        aria-hidden="true"
      >
        <GripVertical size={14} />
      </span>
      <MoveButtons
        index={index}
        count={count}
        itemLabel={`"${edge.label || 'button'}"`}
        onMove={onMove}
      />

      <div className="edge-controls__option">{children}</div>

      <button
        type="button"
        className="edge-controls__chip"
        onClick={() => goToNode(edge.targetNodeId)}
        title={`Go to ${targetTitle}`}
        aria-label={`Go to ${targetTitle}`}
      >
        <ArrowRight size={15} />
      </button>

      <div className="edge-controls__menu-wrap">
        <button
          ref={menuButtonRef}
          type="button"
          className="edge-controls__chip"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={`Options for "${edge.label || 'button'}"`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={15} />
        </button>
        {menuOpen && (
          <>
            <div className="edge-controls__menu-scrim" onClick={() => setMenuOpen(false)} />
            <div
              ref={menuRef}
              className="edge-controls__menu"
              role="menu"
              aria-label={`Options for "${edge.label || 'button'}"`}
              onKeyDown={handleMenuKeyDown}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  closeMenu();
                  setPicking(true);
                }}
              >
                Change destination…
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setEdgeField(edge.id, 'disabled', !edge.disabled);
                  closeMenu();
                }}
              >
                {edge.disabled ? 'Enable button' : 'Disable button'}
              </button>
              <button
                type="button"
                role="menuitem"
                className="edge-controls__menu-danger"
                onClick={() => {
                  setMenuOpen(false);
                  removeButton(sourceId, edge.id);
                }}
              >
                Delete button
              </button>
            </div>
          </>
        )}
      </div>

      {picking && (
        <NodePicker
          nodes={nodes}
          currentTargetId={edge.targetNodeId}
          onPick={(nodeId) => {
            retargetButton(edge.id, nodeId);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </>
  );
}
