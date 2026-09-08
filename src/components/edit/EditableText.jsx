import './EditableText.css';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

// Renders the value as-is outside edit mode. Inside edit mode it becomes a
// textarea that inherits the surrounding typography exactly and sizes itself to
// its content via CSS field-sizing, so nothing about the screen shifts when
// editing starts. Uncontrolled with an onBlur commit — a controlled input here
// would rebuild the whole graph on every keystroke.
export default function EditableText({
	as: Tag = 'p',
	className,
	value,
	placeholder,
	onCommit,
	multiline = true
}) {
	const { editMode } = useEditMode();

	if (!editMode) {
		if (value === undefined || value === null || value === '') return null;
		return <Tag className={className}>{value}</Tag>;
	}

	const props = {
		className: `${className ?? ''} editable-text`.trim(),
		defaultValue: value ?? '',
		placeholder,
		onBlur: (e) => {
			if (e.target.value !== (value ?? '')) onCommit(e.target.value);
		}
	};

	return multiline ? <textarea rows={1} {...props} /> : <input type="text" {...props} />;
}
