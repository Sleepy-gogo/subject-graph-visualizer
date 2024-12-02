import { Edge, MarkerType, Node, Position } from '@xyflow/react';

export interface Materia {
  id: number;
  name: string;
  weeklyHours: number | null;
  totalHours: number | null;
  regulares: number[] | null;
  aprobadas: number[] | null;
}

export default function convertJsonToGraph(jsonData: Materia[]) {
  const nodes: Node[] = jsonData.map((materia, index) => ({
    id: materia.id.toString(),
    position: { x: 100 * index, y: 100 * index },
    data: {
      label: materia.name,
      tooltip: {
        label: `Horas semanales: ${materia.weeklyHours}\nHoras totales: ${materia.totalHours}`,
        position: Position.Top
      }
    },
    type: 'tooltip'
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
          markerEnd: { type: MarkerType.Arrow, color: '#b5b5b580' },
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
          type: 'floating',
          markerEnd: { type: MarkerType.Arrow, color: 'aqua' },
          style: { stroke: 'aqua' }
        });
      });
    }
  });
  return { nodes, edges };
}
