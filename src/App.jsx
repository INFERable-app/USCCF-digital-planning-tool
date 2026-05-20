import './App.css';
import { useGraphEngine } from './graph/useGraphEngine.js';
import NodeRenderer from './components/NodeRenderer.jsx';

export default function App() {
	const { node, answers, advance, restart } = useGraphEngine();
	return (
		<div className="app-shell">
			<div className="phone-frame">
				<NodeRenderer node={node} answers={answers} advance={advance} onRestart={restart} />
			</div>
		</div>
	);
}
