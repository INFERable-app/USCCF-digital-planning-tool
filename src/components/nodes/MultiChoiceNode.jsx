import HeroHeader from '../shared/HeroHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import ChoiceButtonEdge from '../edges/ChoiceButtonEdge.jsx';
import EditableText from '../edit/EditableText.jsx';
import EditableEdgeList from '../edit/EditableEdgeList.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function MultiChoiceNode({
  node,
  nodes,
  nodeEdges,
  advance,
  onBack,
  previousAnswerLabel,
  isStartNode
}) {
  const { setNodeField } = useEditMode();

  return (
    <div className="screen">
      <HeroHeader onBack={onBack} />
      <main id="main" tabIndex={-1} className="bottom-section">
        <ScreenActions node={node} isStartNode={isStartNode} />
        <PreviousAnswerHeading label={previousAnswerLabel} />
        <EditableText
          as="h1"
          className="question-text"
          value={node.question}
          placeholder="Question"
          onCommit={(v) => setNodeField(node.id, 'question', v)}
        />
        <EditableEdgeList
          className="choice-list"
          nodeId={node.id}
          nodeEdges={nodeEdges}
          nodes={nodes}
        >
          {nodeEdges.map((edge) => (
            <ChoiceButtonEdge key={edge.id} edge={edge} advance={advance} />
          ))}
        </EditableEdgeList>
      </main>
      <div className="bottom-cta">
        {onBack && (
          <button className="btn-secondary cta-back" onClick={onBack}>
            <span aria-hidden="true">‹</span>&nbsp;Back
          </button>
        )}
      </div>
    </div>
  );
}
