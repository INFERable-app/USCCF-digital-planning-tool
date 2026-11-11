import '../shared/survey.css';
import { useId, useState } from 'react';
import CompactHeader from '../shared/CompactHeader.jsx';
import CheckboxEdge from '../edges/CheckboxEdge.jsx';
import EditableText from '../edit/EditableText.jsx';
import EditableEdgeList from '../edit/EditableEdgeList.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function CheckboxSurveyNode({
  node,
  nodes,
  edges,
  nodeEdges,
  advance,
  onBack,
  isStartNode
}) {
  const [selected, setSelected] = useState(new Set());
  const { editMode, setNodeField, setEdgeField } = useEditMode();
  const submitEdge = edges[node.submitEdgeId];
  const questionId = useId();

  function handleToggle(edgeId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(edgeId)) next.delete(edgeId);
      else next.add(edgeId);
      return next;
    });
  }

  return (
    <div className="screen screen-compact">
      <CompactHeader onBack={onBack} />
      <main id="main" tabIndex={-1} className="survey-content">
        <ScreenActions node={node} isStartNode={isStartNode} />
        <EditableText
          as="h1"
          id={questionId}
          className="survey-question"
          value={node.question}
          placeholder="Question"
          onCommit={(v) => setNodeField(node.id, 'question', v)}
        />
        <EditableEdgeList
          className="checkbox-list"
          groupProps={{ role: 'group', 'aria-labelledby': questionId }}
          nodeId={node.id}
          nodeEdges={nodeEdges}
          nodes={nodes}
        >
          {nodeEdges.map((edge) => (
            <CheckboxEdge
              key={edge.id}
              edge={edge}
              checked={selected.has(edge.id)}
              onToggle={handleToggle}
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
        {editMode ? (
          <div className="btn-primary">
            <EditableText
              as="span"
              value={submitEdge?.label ?? 'Submit'}
              multiline={false}
              placeholder="Submit"
              onCommit={(v) => submitEdge && setEdgeField(submitEdge.id, 'label', v)}
            />
          </div>
        ) : (
          <button className="btn-primary" onClick={() => advance(node.submitEdgeId, [...selected])}>
            {submitEdge?.label ?? 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
