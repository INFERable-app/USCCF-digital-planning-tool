import HeroHeader from '../shared/HeroHeader.jsx';
import CtaButtonEdge from '../edges/CtaButtonEdge.jsx';

export default function WelcomeNode({ node, nodeEdges, advance }) {
	return (
		<div className="screen">
			<HeroHeader />
			<div className="bottom-section">
				<h1 className="welcome-heading">{node.heading}</h1>
				<p className="welcome-body">{node.body}</p>
				<CtaButtonEdge edge={nodeEdges[0]} advance={advance} />
			</div>
		</div>
	);
}
