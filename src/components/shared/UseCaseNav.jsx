import { useMemo, useState } from 'react';
import { buildUseCaseTree } from '../../graph/buildUseCaseTree.js';
import { useDrawer } from '../../contexts/DrawerContext.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { ChevronLeft, ChevronRight, Library } from 'lucide-react';
import './UseCaseNav.css';

function TreeRow({ row, depth, onJump, onNavigate, isActive }) {
	const [collapsed, setCollapsed] = useState(true);
	const isBranch = Array.isArray(row.children);
	const active = isActive(row);

	if (isBranch) {
		return (
			<li className="usecase-nav__item">
				<div className={`usecase-nav__row usecase-nav__row--branch${active ? ' usecase-nav__row--active' : ''}`}>
					<button
						type="button"
						className="usecase-nav__caret-btn"
						aria-expanded={!collapsed}
						aria-label={collapsed ? 'Expand' : 'Collapse'}
						onClick={() => setCollapsed((c) => !c)}
					>
						<ChevronRight size={14} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)' }} />
					</button>
					<button
						type="button"
						className="usecase-nav__label-btn"
						disabled={row.disabled || !row.targetNodeId}
						onClick={() => { onJump(row.edgePath); onNavigate(); }}
					>
						<span className="usecase-nav__dot" aria-hidden="true" />
						<span className="usecase-nav__label">{row.label}</span>
					</button>
				</div>
				{!collapsed && row.children.length > 0 && (
					<ul className="usecase-nav__group" role="group">
						{row.children.map((child) => (
							<TreeRow key={child.id} row={child} depth={depth + 1} onJump={onJump} onNavigate={onNavigate} isActive={isActive} />
						))}
					</ul>
				)}
			</li>
		);
	}

	return (
		<li className="usecase-nav__item">
			<button
				type="button"
				className={`usecase-nav__row usecase-nav__row--leaf${active ? ' usecase-nav__row--active' : ''}`}
				disabled={row.disabled || !row.targetNodeId}
				onClick={() => { onJump(row.edgePath); onNavigate(); }}
			>
				<span className="usecase-nav__caret-spacer" aria-hidden="true" />
				<span className="usecase-nav__dot" aria-hidden="true" />
				<span className="usecase-nav__label">{row.label}</span>
			</button>
		</li>
	);
}

export default function UseCaseNav() {
	const { toggle, close } = useDrawer();
	const { nodes, edges, answers, startNodeId, jumpAlongPath, openResourceLibrary } = useWizardNav();

	const tree = useMemo(() => buildUseCaseTree(nodes, edges, startNodeId), [nodes, edges, startNodeId]);

	function isActive(row) {
		if (!row.storeKey) return false;
		return answers?.[row.storeKey] === row.value;
	}

	return (
		<div className="usecase-nav-track">
			<aside className="usecase-nav" aria-label="Use case navigation">
				<div className="usecase-nav__heading-row">
					<h2 className="usecase-nav__title">Your Goals</h2>
					<button className="sidebar-close-btn" onClick={toggle} aria-label="Close navigation panel">
						<ChevronLeft size={20} />
					</button>
				</div>

				<nav className="usecase-nav__rail">
					<ul className="usecase-nav__group usecase-nav__group--root" role="tree">
						{tree.map((row) => (
							<TreeRow key={row.id} row={row} depth={0} onJump={jumpAlongPath} onNavigate={close} isActive={isActive} />
						))}
					</ul>
				</nav>

				<button type="button" className="usecase-nav__library-link" onClick={openResourceLibrary}>
					<Library size={16} aria-hidden="true" />
					<span>Resource Library</span>
				</button>
			</aside>
		</div>
	);
}
