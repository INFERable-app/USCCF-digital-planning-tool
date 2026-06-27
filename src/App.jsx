import './App.css';
import { useState, useEffect } from 'react';
import { useGraphEngine } from './graph/useGraphEngine.js';
import NodeRenderer from './components/NodeRenderer.jsx';
import Breadcrumb from './components/shared/Breadcrumb.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { DrawerProvider, useDrawer } from './contexts/DrawerContext.jsx';
import SignInScreen from './components/auth/SignInScreen.jsx';
import ResumeScreen from './components/auth/ResumeScreen.jsx';
import { nodes, startNodeId } from './graph/wizardGraph.js';

function AppContent() {
	const { user, loading } = useAuth();
	const { isOpen } = useDrawer();
	const { node, currentNodeId, answers, history, advance, back, jumpTo, restart, restore } = useGraphEngine();

	// undefined = not yet fetched, null = no saved progress, object = has progress
	const [savedProgress, setSavedProgress] = useState(undefined);
	const [showResume, setShowResume] = useState(false);

	useEffect(() => {
		if (!user) { setSavedProgress(undefined); return; }
		fetch('/api/progress', { credentials: 'include' })
			.then(r => r.ok ? r.json() : null)
			.then(data => {
				setSavedProgress(data);
				if (data) setShowResume(true);
			})
			.catch(() => setSavedProgress(null));
	}, [user]);

	// Auto-save on each wizard step
	useEffect(() => {
		if (!user || savedProgress === undefined || showResume) return;
		if (currentNodeId === startNodeId && Object.keys(answers).length === 0) return;
		fetch('/api/progress', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ currentNodeId, answers, history }),
		});
	}, [currentNodeId, answers, history]);

	function handleResume() {
		restore(savedProgress);
		setShowResume(false);
	}

	async function handleStartOver() {
		await fetch('/api/progress', { method: 'DELETE', credentials: 'include' });
		setSavedProgress(null);
		setShowResume(false);
		restart();
	}

	if (loading || (user && savedProgress === undefined)) return null;

	return (
		<div className="app-shell">
			<div className="phone-chrome">
				<div className={`app-screen${!isOpen ? ' drawer-closed' : ''}`}>
					<div className="dynamic-island" aria-hidden="true" />
					{!user ? (
						<SignInScreen />
					) : showResume ? (
						<ResumeScreen
							user={user}
							nodeLabel={nodes[savedProgress.currentNodeId]?.label ?? savedProgress.currentNodeId}
							onResume={handleResume}
							onStartOver={handleStartOver}
						/>
					) : (
						<NodeRenderer
							node={node}
							answers={answers}
							advance={advance}
							onBack={back}
							onRestart={restart}
						/>
					)}
					{user && !showResume && (
						<Breadcrumb history={history} currentNodeId={currentNodeId} nodes={nodes} onJumpTo={jumpTo} />
					)}
					<div className="home-indicator" aria-hidden="true" />
				</div>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<DrawerProvider>
			<AppContent />
		</DrawerProvider>
	);
}
