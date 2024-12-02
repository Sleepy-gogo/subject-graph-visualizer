import { useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  type Node,
  type Edge
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import FloatingEdge from './components/FloatingEdge';
import FloatingConnectionLine from './components/FloatingConnectionLine';

import data from './Licenciatura en Sistemas de Información.json';
import convertJsonToGraph from './lib/jsonToData';
import useLayoutedElements from './hooks/useLayoutedElems';

const edgeTypes = {
  floating: FloatingEdge
};

export default function App() {
  const [nodes, , onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { getLayoutedElements } = useLayoutedElements();

  useEffect(() => {
    const { nodes, edges } = convertJsonToGraph(data);
    getLayoutedElements(
      {
        'elk.algorithm': 'org.eclipse.elk.stress',
        'elk.spacing.nodeNode': '480',
        'elk.stress.desiredEdgeLength': '700'
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
