import './App.css';
import { useGraphEngine } from './graph/useGraphEngine.js';
import NodeRenderer from './components/NodeRenderer.jsx';
import Breadcrumb from './components/shared/Breadcrumb.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { DrawerProvider, useDrawer } from './contexts/DrawerContext.jsx';
import SignInScreen from './components/auth/SignInScreen.jsx';
import { nodes } from './graph/wizardGraph.js';

function AppContent() {
	const { user } = useAuth();
	const { isOpen } = useDrawer();
	const { node, currentNodeId, answers, history, advance, back, jumpTo, restart } = useGraphEngine();

	return (
		<div className="app-shell">
			<div className="phone-chrome">
				<div className={`app-screen${!isOpen ? ' drawer-closed' : ''}`}>
					<div className="dynamic-island" aria-hidden="true" />
					{user ? (
						<NodeRenderer
							node={node}
							answers={answers}
							advance={advance}
							onBack={back}
							onRestart={restart}
						/>
					) : (
						<SignInScreen />
					)}
					{user && (
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
