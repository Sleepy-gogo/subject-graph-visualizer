import Dagre from '@dagrejs/dagre';
import { useCallback, useEffect, useState } from 'react';
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

interface Materia {
  id: number;
  name: string;
  weeklyHours: number | null;
  totalHours: number | null;
  regulares: number[] | null;
  aprobadas: number[] | null;
}

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: 'TB' | 'LR' }
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: (node.measured?.width ?? 0) + 150,
      height: (node.measured?.height ?? 0) + 120
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node, index) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) + 20 * index;
      const y = position.y - (node.measured?.height ?? 0) + 20 * index;

      return { ...node, position: { x, y } };
    }),
    edges
  };
};

export default function App() {
  const { fitView } = useReactFlow();
  const [unsortedNodes, setUnsortedNodes] = useState<Node[]>([]);
  const [unsortedEdges, setUnsortedEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      console.log(nodes);
      const layouted = getLayoutedElements(unsortedNodes, unsortedEdges, {
        direction
      });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  const convertJsonToGraph = (jsonData: Materia[]) => {
    const nodes: Node[] = jsonData.map((materia, index) => ({
      id: materia.id.toString(), // Reactflow necesita IDs como string
      position: { x: 100 * index, y: 100 * index }, // Posición inicial, luego puedes usar un layout
      data: {
        label: materia.name,
        regulares: materia.regulares,
        aprobadas: materia.aprobadas
      } // Mostrar el ID como etiqueta
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
            style: { stroke: 'aqua' } // Puedes diferenciar visualmente las conexiones
          });
        });
      }
    });

    setUnsortedNodes(nodes);
    setUnsortedEdges(edges);
  };

  useEffect(() => {
    convertJsonToGraph(data);
  }, []);

  useEffect(() => {
    onLayout('TB');
  }, [unsortedNodes, unsortedEdges]);

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
