import './App.css';
import { useGraphEngine } from './graph/useGraphEngine.js';
import NodeRenderer from './components/NodeRenderer.jsx';

export default function App() {
	const { node, answers, advance, back, restart } = useGraphEngine();
	return (
		<div className="app-shell">
			<div className="phone-chrome">
				<div className="phone-frame">
					<div className="dynamic-island" aria-hidden="true" />
					<NodeRenderer
						node={node}
						answers={answers}
						advance={advance}
						onBack={back}
						onRestart={restart}
					/>
					<div className="home-indicator" aria-hidden="true" />
				</div>
			</div>
		</div>
	);
}
