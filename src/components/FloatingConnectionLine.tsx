import { ConnectionLineComponentProps, getSmoothStepPath } from '@xyflow/react';

import { getEdgeParams } from '../lib/utils.ts';

function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode
}: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  const targetNode = {
    id: 'connection-target',
    position: { x: toX, y: toY },
    data: {},
    measured: {
      width: 1,
      height: 1
    },
    internals: {
      positionAbsolute: { x: toX, y: toY },
      z: 0,
      userNode: fromNode
    }
  };

  const { sx, sy } = getEdgeParams(fromNode, targetNode);
  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY
  });

  return (
    <g>
      <path fill="none" stroke="#222" className="animated" d={edgePath} />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" />
    </g>
  );
}

export default FloatingConnectionLine;
