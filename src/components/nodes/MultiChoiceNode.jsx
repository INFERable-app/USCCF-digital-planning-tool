import HeroHeader from '../shared/HeroHeader.jsx';
import ChoiceButtonEdge from '../edges/ChoiceButtonEdge.jsx';

export default function MultiChoiceNode({ node, nodeEdges, advance, onBack }) {
	return (
		<div className="screen">
			<HeroHeader onBack={onBack} />
			<div className="bottom-section">
				<p className="question-text">{node.question}</p>
				<div className="choice-list">
					{nodeEdges.map((edge) => (
						<ChoiceButtonEdge key={edge.id} edge={edge} advance={advance} />
					))}
				</div>
			</div>
			<div className="bottom-cta">
				{onBack && (
					<button className="btn-secondary cta-back" onClick={onBack}>
						‹ Back
					</button>
				)}
			</div>
		</div>
	);
}
