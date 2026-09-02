import './App.css';
import { useState, useEffect } from 'react';
import { useGraphEngine } from './graph/useGraphEngine.js';
import { getPreviousAnswerLabel } from './graph/getPreviousAnswerLabel.js';
import { getNodePath } from './graph/getNodePath.js';
import NodeRenderer from './components/NodeRenderer.jsx';
import Breadcrumb from './components/shared/Breadcrumb.jsx';
import ResourceLibraryOverlay from './components/shared/ResourceLibraryOverlay.jsx';
import FaqOverlay from './components/shared/FaqOverlay.jsx';
import GlossaryOverlay from './components/shared/GlossaryOverlay.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { DrawerProvider, useDrawer } from './contexts/DrawerContext.jsx';
import { WizardNavProvider } from './contexts/WizardNavContext.jsx';
import { EditModeProvider, useEditMode } from './contexts/EditModeContext.jsx';
import EditModeBar from './components/edit/EditModeBar.jsx';
import SignInScreen from './components/auth/SignInScreen.jsx';
import ResumeScreen from './components/auth/ResumeScreen.jsx';

function AppContent({ engine }) {
	const { user, loading } = useAuth();
	const { isOpen } = useDrawer();
	const { editMode } = useEditMode();
	const {
		node,
		nodes,
		edges,
		startNodeId,
		currentNodeId,
		answers,
		history,
		advance,
		back,
		jumpAlongPath,
		restore
	} = engine;

	// undefined = not yet fetched, null = no saved progress, object = has progress
	const [savedProgress, setSavedProgress] = useState(undefined);
	const [showResume, setShowResume] = useState(false);

	useEffect(() => {
		if (!user) {
			setSavedProgress(undefined);
			return;
		}
		fetch('/api/progress', { credentials: 'include' })
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				setSavedProgress(data);
				if (data) {
					const isRefresh = sessionStorage.getItem('session-user') === user.sub;
					if (isRefresh) {
						restore(data);
					} else {
						setShowResume(true);
					}
				}
				sessionStorage.setItem('session-user', user.sub);
			})
			.catch(() => setSavedProgress(null));
	}, [user]);

	// Auto-save on each wizard step. Suppressed in edit mode — an admin walking
	// the tree to edit it would otherwise overwrite their own saved place.
	useEffect(() => {
		if (!user || savedProgress === undefined || showResume || editMode) return;
		if (currentNodeId === startNodeId && Object.keys(answers).length === 0) return;
		fetch('/api/progress', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ currentNodeId, answers, history })
		});
	}, [currentNodeId, answers, history, editMode]);

	function handleResume() {
		restore(savedProgress);
		setShowResume(false);
	}

	const path = getNodePath(nodes, edges, startNodeId, currentNodeId);
	const previousAnswerLabel = getPreviousAnswerLabel(nodes, edges, path);

	if (loading || (user && (!startNodeId || savedProgress === undefined))) return null;

	return (
		<WizardNavProvider
			nodes={nodes}
			edges={edges}
			answers={answers}
			currentNodeId={currentNodeId}
			currentEdgeIds={path.map((p) => p.edgeId).filter(Boolean)}
			startNodeId={startNodeId}
			jumpAlongPath={jumpAlongPath}
		>
			<div className="app-shell">
				<EditModeBar />
				<div className="phone-chrome">
					<div
						className={`app-screen${!isOpen ? ' drawer-closed' : ''}${editMode ? ' edit-mode' : ''}`}
					>
						<div className="dynamic-island" aria-hidden="true" />
						{!user ? (
							<SignInScreen />
						) : showResume ? (
							<ResumeScreen user={user} onResume={handleResume} />
						) : (
							<NodeRenderer
								node={node}
								nodes={nodes}
								edges={edges}
								answers={answers}
								advance={advance}
								onBack={back}
								previousAnswerLabel={previousAnswerLabel}
								isStartNode={currentNodeId === startNodeId}
							/>
						)}
						{user && !showResume && (
							<Breadcrumb path={path} nodes={nodes} onJumpTo={jumpAlongPath} />
						)}
						<div className="home-indicator" aria-hidden="true" />
					</div>
				</div>
				{user && <ResourceLibraryOverlay />}
				{user && <FaqOverlay />}
				{user && <GlossaryOverlay />}
			</div>
		</WizardNavProvider>
	);
}

// The engine is created here so EditModeProvider can drive the same graph state
// the wizard renders from — edit mode edits the live draft rather than a copy.
function AppWithEngine() {
	const engine = useGraphEngine();

	return (
		<EditModeProvider
			graph={engine.graph}
			setGraph={engine.setGraph}
			currentNodeId={engine.currentNodeId}
			goToNode={engine.goToNode}
		>
			<AppContent engine={engine} />
		</EditModeProvider>
	);
}

export default function App() {
	return (
		<DrawerProvider>
			<AppWithEngine />
		</DrawerProvider>
	);
}
