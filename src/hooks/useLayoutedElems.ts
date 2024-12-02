import { Edge, Node, useReactFlow } from '@xyflow/react';
import ELK, { LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { useCallback } from 'react';

const elk = new ELK();

export default function useLayoutedElements() {
  const { setNodes, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '150',
    'elk.spacing.nodeNode': '180'
  };

  const getLayoutedElements = useCallback(
    (options: LayoutOptions, nodes: Node[], edges: Edge[]) => {
      const layoutOptions: LayoutOptions = { ...defaultOptions, ...options };
      const graph = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: nodes.map((node) => ({
          ...node,
          width: node.measured?.width ?? 200,
          height: node.measured?.height ?? 100
        })),
        edges: edges
      };

      elk.layout(graph).then(({ children }) => {
        children?.forEach((node) => {
          node.position = { x: node.x, y: node.y };
        });

        setNodes(children);
        window.requestAnimationFrame(() => {
          fitView();
        });
      });
    },
    []
  );

  return { getLayoutedElements };
}
