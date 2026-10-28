import './PreviousAnswerHeading.css';
import { useMemo } from 'react';
import { useEditMode } from '../../contexts/EditModeContext.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { buildUseCaseTree } from '../../graph/buildUseCaseTree.js';
import EditableText from '../edit/EditableText.jsx';
import { USE_CASE_NAV_TITLE } from './UseCaseNav.jsx';

// True when any row in the sidebar tree, at any depth, is this edge
function treeHasEdge(rows, edgeId) {
  return rows.some(
    (row) => row.id === edgeId || (row.children && treeHasEdge(row.children, edgeId))
  );
}

export default function PreviousAnswerHeading({ label }) {
  const { editMode, setEdgeField } = useEditMode();
  const { path, nodes, edges, startNodeId } = useWizardNav();
  const edgeId = path[path.length - 1]?.edgeId;

  const inSidebar = useMemo(
    () =>
      editMode && edgeId ? treeHasEdge(buildUseCaseTree(nodes, edges, startNodeId), edgeId) : false,
    [editMode, edgeId, nodes, edges, startNodeId]
  );

  if (!label) return null;

  if (!editMode || !edgeId) {
    return <p className="previous-answer-heading">{label}</p>;
  }

  return (
    <div className="previous-answer-heading previous-answer-heading--editing">
      <EditableText
        as="span"
        value={label}
        multiline={false}
        onCommit={(value) => setEdgeField(edgeId, 'label', value)}
      />
      <p className="previous-answer-heading__hint">
        {inSidebar
          ? `Also changes this answer’s button on the previous screen and its entry in the ${USE_CASE_NAV_TITLE} sidebar.`
          : 'Also changes this answer’s button on the previous screen.'}
      </p>
    </div>
  );
}
