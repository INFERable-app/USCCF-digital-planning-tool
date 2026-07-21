import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import './GraphEdge.css';

export default function GraphEdge({
	sourceX,
	sourceY,
	sourcePosition,
	targetX,
	targetY,
	targetPosition,
	style,
	label,
	selected,
	data
}) {
	const { parallelIndex, parallelCount } = data ?? {};
	const centerY =
		parallelCount > 1
			? (sourceY + targetY) / 2 + (parallelIndex - (parallelCount - 1) / 2) * 32
			: undefined;

	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		centerY
	});

	return (
		<>
			<BaseEdge path={edgePath} style={style} />
			{label && (
				<EdgeLabelRenderer>
					<div
						className={`graph-edge-label nodrag nopan${selected ? ' graph-edge-label--selected' : ''}`}
						style={{
							transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
						}}
						title={label}
					>
						{label}
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
}
