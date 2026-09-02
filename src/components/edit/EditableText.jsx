import './EditableText.css';
import { useRef, useEffect } from 'react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

// Renders the value as-is outside edit mode. Inside edit mode it becomes an
// auto-growing textarea that inherits the surrounding typography exactly, so
// nothing about the screen shifts when editing starts. Uncontrolled with an
// onBlur commit — a controlled input here would rebuild the whole graph on
// every keystroke.
export default function EditableText({
	as: Tag = 'p',
	className,
	value,
	placeholder,
	onCommit,
	multiline = true
}) {
	const { editMode } = useEditMode();
	const ref = useRef(null);

	useEffect(() => {
		if (!editMode || !ref.current || !multiline) return;
		const el = ref.current;
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	}, [editMode, value, multiline]);

	if (!editMode) {
		if (value === undefined || value === null || value === '') return null;
		return <Tag className={className}>{value}</Tag>;
	}

	function autoGrow(e) {
		if (!multiline) return;
		e.target.style.height = 'auto';
		e.target.style.height = `${e.target.scrollHeight}px`;
	}

	const props = {
		ref,
		className: `${className ?? ''} editable-text`.trim(),
		defaultValue: value ?? '',
		placeholder,
		onInput: autoGrow,
		onBlur: (e) => {
			if (e.target.value !== (value ?? '')) onCommit(e.target.value);
		}
	};

	return multiline ? <textarea rows={1} {...props} /> : <input type="text" {...props} />;
}
