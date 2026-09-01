import HeroHeader from '../shared/HeroHeader.jsx';
import CtaButtonEdge from '../edges/CtaButtonEdge.jsx';
import EditableText from '../edit/EditableText.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function WelcomeNode({ node, nodeEdges, advance, isStartNode }) {
	const { setNodeField } = useEditMode();

	return (
		<div className="screen">
			<HeroHeader />
			<div className="bottom-section">
				<ScreenActions node={node} isStartNode={isStartNode} />
				<EditableText
					as="h1"
					className="welcome-heading"
					value={node.heading}
					placeholder="Heading"
					onCommit={(v) => setNodeField(node.id, 'heading', v)}
				/>
				<EditableText
					className="welcome-body"
					value={node.body}
					placeholder="Body text"
					onCommit={(v) => setNodeField(node.id, 'body', v)}
				/>
				<CtaButtonEdge edge={nodeEdges[0]} advance={advance} />
			</div>
		</div>
	);
}
