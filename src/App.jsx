import './App.css';
import { useGraphEngine } from './graph/useGraphEngine.js';
import NodeRenderer from './components/NodeRenderer.jsx';
import Breadcrumb from './components/shared/Breadcrumb.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import SignInScreen from './components/auth/SignInScreen.jsx';
import { nodes } from './graph/wizardGraph.js';

export default function App() {
	const { user } = useAuth();
	const { node, currentNodeId, answers, history, advance, back, jumpTo, restart } = useGraphEngine();

	return (
		<div className="app-shell">
			<div className="phone-chrome">
				<div className="phone-frame">
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
