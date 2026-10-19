import './Breadcrumb.css';
import { useState } from 'react';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';

const SKIP_TYPES = new Set(['welcome']);

function stepQuestion(node) {
  return node?.question || (node?.type === 'results' ? 'Result' : '');
}

export default function Breadcrumb() {
  const { path, nodes, jumpAlongPath } = useWizardNav();
  const [hoveredId, setHoveredId] = useState(null);

  const steps = path.filter((step) => {
    const node = nodes[step.nodeId];
    return node && !SKIP_TYPES.has(node.type);
  });

  if (steps.length === 0) return null;

  function jumpToStep(step) {
    const idx = path.indexOf(step);
    const edgePath = path.slice(1, idx + 1).map((s) => s.edgeId);
    jumpAlongPath(edgePath);
  }

  const captionId = hoveredId ?? steps[steps.length - 1].nodeId;
  const caption = stepQuestion(nodes[captionId]);

  return (
    <div className="breadcrumb" aria-hidden="true">
      <div className="breadcrumb-dots">
        {steps.map((step, i) => {
          const { nodeId: id } = step;
          const isCurrent = i === steps.length - 1;
          const isLast = i === steps.length - 1;
          const hoverHandlers = !isCurrent
            ? {
                onMouseEnter: () => setHoveredId(id),
                onMouseLeave: () => setHoveredId(null),
                onClick: () => {
                  if (hoveredId === id) {
                    jumpToStep(step);
                    setHoveredId(null);
                  } else {
                    setHoveredId(id);
                  }
                }
              }
            : {};
          return (
            <span
              key={id}
              className={`breadcrumb-step ${!isCurrent && id === hoveredId ? 'breadcrumb-step--active' : ''}`}
              {...hoverHandlers}
            >
              <span className="breadcrumb-dot-wrap">
                <span
                  className={`breadcrumb-dot ${isCurrent ? 'breadcrumb-dot--current' : ''} ${isCurrent && hoveredId ? 'breadcrumb-dot--dimmed' : ''}`}
                />
              </span>
              {!isLast && <span className="breadcrumb-line" />}
            </span>
          );
        })}
      </div>
      <p className={`breadcrumb-caption ${hoveredId ? 'breadcrumb-caption--preview' : ''}`}>
        {caption}
      </p>
    </div>
  );
}
