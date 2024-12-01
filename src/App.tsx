import ELK, { LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  useReactFlow,
  MarkerType
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';

import data from './Licenciatura en Sistemas de Información.json';

const edgeTypes = {
  floating: FloatingEdge
};

const elk = new ELK();

interface Materia {
  id: number;
  name: string;
  weeklyHours: number | null;
  totalHours: number | null;
  regulares: number[] | null;
  aprobadas: number[] | null;
}

const useLayoutedElements = () => {
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
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
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
};

const convertJsonToGraph = (jsonData: Materia[]) => {
  const nodes: Node[] = jsonData.map((materia, index) => ({
    id: materia.id.toString(),
    position: { x: 100 * index, y: 100 * index },
    data: {
      label: materia.name,
      regulares: materia.regulares,
      aprobadas: materia.aprobadas
    }
  }));

  const edges: Edge[] = [];
  jsonData.forEach((materia) => {
    if (materia.regulares) {
      materia.regulares.forEach((regularId) => {
        edges.push({
          id: `${materia.id}-${regularId}`,
          target: materia.id.toString(),
          source: regularId.toString(),
          type: 'floating',
          markerEnd: { type: MarkerType.Arrow },
          animated: true,
          style: { stroke: '#b5b5b580' }
        });
      });
    }
    if (materia.aprobadas) {
      materia.aprobadas.forEach((aprobadaId) => {
        edges.push({
          id: `${materia.id}-${aprobadaId}`,
          source: aprobadaId.toString(),
          target: materia.id.toString(),
          type: 'smoothstep',
          markerEnd: { type: MarkerType.Arrow },
          style: { stroke: 'aqua' }
        });
      });
    }
  });
  return { nodes, edges };
};

export default function App() {
  const [nodes, , onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { getLayoutedElements } = useLayoutedElements();

  useEffect(() => {
    const { nodes, edges } = convertJsonToGraph(data);
    getLayoutedElements(
      {
        'elk.algorithm': 'layered'
      },
      nodes,
      edges
    );
    setEdges(edges);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        panOnDrag
        zoomOnScroll
        colorMode="dark"
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={1} />
      </ReactFlow>
    </div>
  );
}
