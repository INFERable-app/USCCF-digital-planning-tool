import './Toolbar.css';
import { LayoutGrid, Maximize2, Redo2, Save, Undo2 } from 'lucide-react';
import AddNodeMenu from './AddNodeMenu.jsx';

export default function Toolbar({
	userLabel,
	dirty,
	onAddNode,
	onAutoArrange,
	onFitView,
	onSaveClick,
	onUndo,
	onRedo,
	canUndo,
	canRedo
}) {
	return (
		<header className="admin-toolbar">
			<div className="admin-toolbar__title">
				<span className="admin-toolbar__title-text">Wizard Graph Architect</span>
				{userLabel && <span className="admin-toolbar__badge">{userLabel}</span>}
			</div>
			<div className="admin-toolbar__actions">
				{dirty && <span className="admin-toolbar__dirty">● Unsaved changes</span>}
				<AddNodeMenu onAdd={onAddNode} />
				<button
					type="button"
					className="admin-toolbar__btn"
					onClick={onUndo}
					disabled={!canUndo}
					title="Undo"
				>
					<Undo2 size={14} />
					Undo
				</button>
				<button
					type="button"
					className="admin-toolbar__btn"
					onClick={onRedo}
					disabled={!canRedo}
					title="Redo"
				>
					<Redo2 size={14} />
					Redo
				</button>
				<button type="button" className="admin-toolbar__btn" onClick={onAutoArrange}>
					<LayoutGrid size={14} />
					Auto-arrange
				</button>
				<button type="button" className="admin-toolbar__btn" onClick={onFitView}>
					<Maximize2 size={14} />
					Fit View
				</button>
				<button
					type="button"
					className="admin-toolbar__btn admin-toolbar__btn--save"
					onClick={onSaveClick}
				>
					<Save size={14} />
					Save
				</button>
			</div>
		</header>
	);
}
