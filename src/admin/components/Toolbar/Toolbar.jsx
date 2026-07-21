import './Toolbar.css';
import { LayoutGrid, Maximize2, Save } from 'lucide-react';
import AddNodeMenu from './AddNodeMenu.jsx';

export default function Toolbar({
	userLabel,
	dirty,
	onAddNode,
	onAutoArrange,
	onFitView,
	onSaveClick
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
