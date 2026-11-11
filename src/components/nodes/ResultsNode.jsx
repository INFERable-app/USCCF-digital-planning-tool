import '../shared/survey.css';
import CompactHeader from '../shared/CompactHeader.jsx';
import PreviousAnswerHeading from '../shared/PreviousAnswerHeading.jsx';
import VideoCard from '../shared/VideoCard.jsx';
import ResourceItem from '../shared/ResourceItem.jsx';
import ScreenActions from '../edit/ScreenActions.jsx';
import EditableText from '../edit/EditableText.jsx';
import ResourceListEditor from '../edit/ResourceListEditor.jsx';
import { resolveResult } from '../../graph/resolveResult.js';
import { useEditMode } from '../../contexts/EditModeContext.jsx';

export default function ResultsNode({ node, answers, onBack, previousAnswerLabel, isStartNode }) {
  const { editMode, setNodeField } = useEditMode();
  const resolvers = node.resolvers ?? [];
  const result = resolveResult(resolvers, answers) ?? {};
  const matchedIndex = resolvers.indexOf(result);

  function commitResolverField(field, value) {
    if (resolvers.length === 0) {
      setNodeField(node.id, 'resolvers', [{ when: {}, [field]: value }]);
      return;
    }
    const next = resolvers.map((r, i) => (i === matchedIndex ? { ...r, [field]: value } : r));
    setNodeField(node.id, 'resolvers', next);
  }

  return (
    <div className="screen screen-compact">
      <CompactHeader onBack={onBack} />
      <main id="main" tabIndex={-1} className="survey-content">
        <ScreenActions node={node} isStartNode={isStartNode} />
        <PreviousAnswerHeading label={previousAnswerLabel} />
        <p className="results-label">Recommended next step:</p>
        <EditableText
          as="h1"
          className="results-recommendation"
          value={result.recommendation}
          placeholder="Recommendation"
          onCommit={(v) => commitResolverField('recommendation', v)}
        />
        <EditableText
          as="p"
          className="body-text"
          value={result.bodyText}
          placeholder="Body text"
          onCommit={(v) => commitResolverField('bodyText', v)}
        />
        {result.videoUrl && <VideoCard url={result.videoUrl} alt={result.videoAlt} />}
        {editMode ? (
          <ResourceListEditor
            resources={result.resources ?? []}
            onChange={(next) => commitResolverField('resources', next)}
          />
        ) : (
          result.resources &&
          result.resources.map((item, i) => <ResourceItem key={i} item={item} />)
        )}
        {result.cta && (
          <a
            href={result.cta.url}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.cta.label}
          </a>
        )}
        <EditableText
          as="p"
          className="results-footer"
          value={result.footer}
          placeholder="Footer"
          onCommit={(v) => commitResolverField('footer', v)}
        />
        <p className="recommendation-next-text">
          After you perform the recommended step, return to the tool when you need more guidance.
        </p>
      </main>
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
