import { useCallback, useEffect, useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext.jsx';

function withKeys(items) {
  return items.map((item) => ({ ...item, _key: crypto.randomUUID() }));
}

// Local edit copy of a help-content collection, plus the Save / Cancel / Preview flow and the
// confirmations shown before closing the panel or leaving edit mode.
export function useContentDraft({ items, save, close, closeButtonRef }) {
  const { editMode, dirty: graphDirty, enter, exit } = useEditMode();
  const [draft, setDraftState] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [confirmAt, setConfirmAt] = useState(null);
  const [confirmingExit, setConfirmingExit] = useState(false);

  useEffect(() => {
    setDraftState(editMode && items ? withKeys(items) : null);
    setDirty(false);
    setSaveError(null);
    setPreviewing(false);
  }, [items, editMode]);

  const setDraft = useCallback((next) => {
    setDraftState(next);
    setDirty(true);
  }, []);

  const cancel = useCallback(() => {
    setDraftState(items ? withKeys(items) : null);
    setDirty(false);
    setSaveError(null);
  }, [items]);

  const saveDraft = useCallback(
    async (cleanItems) => {
      setSaving(true);
      setSaveError(null);
      try {
        await save(cleanItems);
      } catch (err) {
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    },
    [save]
  );

  // Leaves edit mode, asking about unsaved screen changes first.
  const leaveEditMode = useCallback(() => {
    if (graphDirty) setConfirmingExit(true);
    else exit();
  }, [graphDirty, exit]);

  // Opens the discard confirmation at the click point, or under the close button for keyboard use.
  const askToDiscard = useCallback(
    (e, next) => {
      if (e && e.clientX) {
        setConfirmAt({ x: e.clientX, y: e.clientY, next });
        return;
      }
      const rect = closeButtonRef.current?.getBoundingClientRect();
      setConfirmAt(rect ? { x: rect.left, y: rect.bottom, next } : { x: 0, y: 0, next });
    },
    [closeButtonRef]
  );

  // Closes right away, or asks first when the draft has unsaved changes.
  const requestClose = useCallback(
    (e) => {
      if (dirty) askToDiscard(e, 'close');
      else close();
    },
    [dirty, askToDiscard, close]
  );

  const toggleEditMode = useCallback(
    (e) => {
      if (!editMode) enter();
      else if (dirty) askToDiscard(e, 'exit');
      else leaveEditMode();
    },
    [editMode, dirty, enter, askToDiscard, leaveEditMode]
  );

  const confirmDiscard = useCallback(() => {
    const next = confirmAt?.next;
    setConfirmAt(null);
    cancel();
    if (next === 'exit') leaveEditMode();
    else close();
  }, [confirmAt, cancel, leaveEditMode, close]);

  const dismissConfirm = useCallback(() => setConfirmAt(null), []);

  return {
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
  };
}
