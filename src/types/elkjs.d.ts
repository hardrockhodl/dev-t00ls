declare module 'elkjs' {
  export default class ELK {
    layout(graph: ElkGraph): Promise<ElkGraph>;
  }

  export interface ElkGraph {
    id: string;
    children?: ElkNode[];
    edges?: ElkEdge[];
  }

  export interface ElkNode {
    id: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }

  export interface ElkEdge {
    id: string;
    sources: string[];
    targets: string[];
  }
}