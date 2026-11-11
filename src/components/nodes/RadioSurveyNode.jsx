import '../shared/survey.css';
import { useId, useState } from 'react';
import CompactHeader from '../shared/CompactHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import RadioEdge from '../edges/RadioEdge.jsx';
import EditableText from '../edit/EditableText.jsx';
import EditableEdgeList from '../edit/EditableEdgeList.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function RadioSurveyNode({
  node,
  nodes,
  nodeEdges,
  advance,
  onBack,
  previousAnswerLabel,
  isStartNode
}) {
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const { editMode, setNodeField } = useEditMode();
  const questionId = useId();
  const hintId = useId();
  const submitDisabled = !editMode && !selectedEdgeId;

  return (
    <div className="screen screen-compact">
      <CompactHeader onBack={onBack} />
      <main id="main" tabIndex={-1} className="survey-content">
        <ScreenActions node={node} isStartNode={isStartNode} />
        <PreviousAnswerHeading label={previousAnswerLabel} />
        <EditableText
          className="body-text"
          value={node.intro}
          placeholder="Intro text (optional)"
          onCommit={(v) => setNodeField(node.id, 'intro', v)}
        />
        <EditableText
          as="h1"
          id={questionId}
          className="survey-question"
          value={node.question}
          placeholder="Question"
          onCommit={(v) => setNodeField(node.id, 'question', v)}
        />
        <EditableEdgeList
          className="radio-list"
          groupProps={{ role: 'radiogroup', 'aria-labelledby': questionId }}
          nodeId={node.id}
          nodeEdges={nodeEdges}
          nodes={nodes}
        >
          {nodeEdges.map((edge) => (
            <RadioEdge
              key={edge.id}
              edge={edge}
              selected={selectedEdgeId === edge.id}
              onSelect={setSelectedEdgeId}
            />
          ))}
        </EditableEdgeList>
      </main>
      <div className="bottom-cta">
        {onBack && (
          <button className="btn-secondary cta-back" onClick={onBack}>
            <span aria-hidden="true">‹</span> Back
          </button>
        )}
        <button
          className="btn-primary"
          onClick={() => !editMode && selectedEdgeId && advance(selectedEdgeId)}
          disabled={submitDisabled}
          aria-describedby={submitDisabled ? hintId : undefined}
        >
          <EditableText
            as="span"
            value={node.submitLabel ?? 'Next'}
            multiline={false}
            placeholder="Next"
            onCommit={(v) => setNodeField(node.id, 'submitLabel', v)}
          />
        </button>
        <span id={hintId} className="sr-only">
          Choose an option to continue.
        </span>
      </div>
    </div>
  );
}
