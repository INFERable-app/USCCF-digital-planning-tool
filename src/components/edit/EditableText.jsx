import './EditableText.css';
import { useEffect, useRef, useState } from 'react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

// Renders the value as-is outside edit mode. Inside edit mode it becomes a
// textarea that inherits the surrounding typography exactly and sizes itself to
// its content via CSS field-sizing, so nothing about the screen shifts when
// editing starts. Stays uncontrolled so the caret never jumps, but commits on
// input so the edit bar reacts to the first keystroke.
export default function EditableText({
  as: Tag = 'p',
  className,
  value,
  placeholder,
  onCommit,
  multiline = true
}) {
  const { editMode } = useEditMode();

  // Remounts the field when its value changes elsewhere (e.g. the sidebar), never on its own typing
  const lastCommitted = useRef(value);
  const [fieldKey, setFieldKey] = useState(0);
  useEffect(() => {
    if ((value ?? '') !== (lastCommitted.current ?? '')) {
      lastCommitted.current = value;
      setFieldKey((k) => k + 1);
    }
  }, [value]);

  function commit(next) {
    lastCommitted.current = next;
    onCommit(next);
  }

  if (!editMode) {
    if (value === undefined || value === null || value === '') return null;
    return <Tag className={className}>{value}</Tag>;
  }

  const props = {
    className: `${className ?? ''} editable-text`.trim(),
    defaultValue: value ?? '',
    placeholder,
    onInput: (e) => {
      if (e.nativeEvent.isComposing) return;
      if (e.target.value !== (value ?? '')) commit(e.target.value);
    },
    onCompositionEnd: (e) => {
      if (e.target.value !== (value ?? '')) commit(e.target.value);
    }
  };

  return multiline ? (
    <textarea key={fieldKey} rows={1} {...props} />
  ) : (
    <input key={fieldKey} type="text" {...props} />
  );
}
