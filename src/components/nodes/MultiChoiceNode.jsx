import HeroHeader from '../shared/HeroHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import ChoiceButtonEdge from '../edges/ChoiceButtonEdge.jsx';

export default function MultiChoiceNode({ node, nodeEdges, advance, onBack, previousAnswerLabel }) {
	return (
		<div className="screen">
			<HeroHeader onBack={onBack} />
			<div className="bottom-section">
				<PreviousAnswerHeading label={previousAnswerLabel} />
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
