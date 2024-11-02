import React from 'react';
import { getSmoothStepPath, ConnectionLineComponentProps } from 'reactflow';
import { FloatingConnectionLineProps } from '../../types/FloatingConnectionLineProps'; // Adjusted path

type Props = ConnectionLineComponentProps & FloatingConnectionLineProps;

const FloatingConnectionLine: React.FC<Props> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionLineStyle,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <path
      style={{ ...connectionLineStyle, stroke: '#000', strokeWidth: 2 }}
      className="react-flow__connection-path"
      d={edgePath}
    />
  );
};

export default FloatingConnectionLine;
