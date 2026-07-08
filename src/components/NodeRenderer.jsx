import WelcomeNode from './nodes/WelcomeNode.jsx';
import MultiChoiceNode from './nodes/MultiChoiceNode.jsx';
import RadioSurveyNode from './nodes/RadioSurveyNode.jsx';
import CheckboxSurveyNode from './nodes/CheckboxSurveyNode.jsx';
import VideoInfoNode from './nodes/VideoInfoNode.jsx';
import ResultsNode from './nodes/ResultsNode.jsx';

const NODE_COMPONENTS = {
	welcome: WelcomeNode,
	multiChoice: MultiChoiceNode,
	radioSurvey: RadioSurveyNode,
	checkboxSurvey: CheckboxSurveyNode,
	videoInfo: VideoInfoNode,
	results: ResultsNode,
};

export default function NodeRenderer({ node, edges, answers, advance, onBack, previousAnswerLabel }) {
	const NodeComponent = NODE_COMPONENTS[node.type];
	const nodeEdges = node.edgeIds.map((id) => edges[id]).filter(Boolean);

	return (
		<NodeComponent
			node={node}
			edges={edges}
			nodeEdges={nodeEdges}
			answers={answers}
			advance={advance}
			onBack={onBack}
			previousAnswerLabel={previousAnswerLabel}
		/>
	);
}
