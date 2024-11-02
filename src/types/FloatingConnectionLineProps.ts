// FloatingConnectionLineProps.ts
import { Position, Node } from 'reactflow';

export type FloatingConnectionLineProps = {
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  fromNode?: Node;
};