import './Breadcrumb.css';
import { useState } from 'react';

const SKIP_TYPES = new Set(['welcome']);

export default function Breadcrumb({ path, nodes, onJumpTo }) {
	const [hoveredId, setHoveredId] = useState(null);

	const steps = path.filter((step) => {
		const node = nodes[step.nodeId];
		return node && !SKIP_TYPES.has(node.type);
	});

	if (steps.length === 0) return null;

	function jumpToStep(step) {
		const idx = path.indexOf(step);
		const edgePath = path.slice(1, idx + 1).map((s) => s.edgeId);
		onJumpTo(edgePath);
	}

	return (
		<div className="breadcrumb" aria-hidden="true">
			<div className="breadcrumb-dots">
				{steps.map((step, i) => {
					const { nodeId: id } = step;
					const isCurrent = i === steps.length - 1;
					const isLast = i === steps.length - 1;
					const question = nodes[id]?.question || (nodes[id]?.type === 'results' ? 'Result' : '');
					const showLabel = hoveredId ? id === hoveredId : isCurrent;
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
							},
						}
						: {};
					return (
						<span key={id} className={`breadcrumb-step ${!isCurrent && id === hoveredId ? 'breadcrumb-step--active' : ''}`} {...hoverHandlers}>
							<span className="breadcrumb-dot-wrap">
								<span
									className={`breadcrumb-dot ${isCurrent ? 'breadcrumb-dot--current' : ''} ${showLabel ? 'breadcrumb-dot--active' : ''} ${isCurrent && hoveredId ? 'breadcrumb-dot--dimmed' : ''}`}
								/>
								{question && <span className={`breadcrumb-label ${showLabel ? 'breadcrumb-label--visible' : ''}`}>{question}</span>}
							</span>
							{!isLast && <span className="breadcrumb-line" />}
						</span>
					);
				})}
			</div>
		</div>
	);
}
