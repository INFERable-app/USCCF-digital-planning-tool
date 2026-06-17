import './Breadcrumb.css';
import { useState } from 'react';

const SKIP_TYPES = new Set(['welcome', 'results']);

export default function Breadcrumb({ history, currentNodeId, nodes, onJumpTo }) {
	const [hoveredId, setHoveredId] = useState(null);

	const steps = [...history, currentNodeId].filter((id) => {
		const node = nodes[id];
		return node && !SKIP_TYPES.has(node.type);
	});

	if (steps.length === 0) return null;

	return (
		<div className="breadcrumb" aria-hidden="true">
			<div className="breadcrumb-dots">
				{steps.map((id, i) => {
					const isCurrent = i === steps.length - 1;
					const isLast = i === steps.length - 1;
					const question = nodes[id]?.question ?? '';
					const showLabel = hoveredId ? id === hoveredId : isCurrent;
					const hoverHandlers = !isCurrent
						? {
							onMouseEnter: () => setHoveredId(id),
							onMouseLeave: () => setHoveredId(null),
							onClick: () => {
								if (hoveredId === id) {
									onJumpTo(id);
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
