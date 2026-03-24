import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { StepNode } from './nodes/StepNode';
import { DecisionNode } from './nodes/DecisionNode';
import { SwimlaneNode } from './nodes/SwimlaneNode';
import { EditableEdge } from './edges/EditableEdge';
import { initialNodes, initialEdges } from '../flow-data';

const nodeTypes = {
  step: StepNode,
  decision: DecisionNode,
  swimlane: SwimlaneNode,
};

const edgeTypes = {
  smoothstep: EditableEdge,
};

export function Flowchart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges],
  );

  const addNode = (type: 'step' | 'decision') => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      position: { x: 500, y: 200 }, // Default position in the middle for Manager
      data: { 
        label: type === 'step' ? 'Шинэ алхам' : 'Шинэ шийдвэр',
        status: 'default',
        role: '👨💼 Менежер'
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="w-full h-full bg-[#0b1121]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        colorMode="dark"
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        className="bg-[#0b1121]"
      >
        <Panel position="top-right" className="flex gap-2 z-50">
          <button 
            onClick={() => addNode('step')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            + Алхам нэмэх
          </button>
          <button 
            onClick={() => addNode('decision')}
            className="px-4 py-2 bg-sky-900/50 hover:bg-sky-800/80 text-sky-100 text-xs font-semibold rounded-lg border border-sky-800/50 transition"
          >
            + Шийдвэр нэмэх
          </button>
        </Panel>
        <Controls className="bg-slate-800 border-slate-700 fill-slate-200" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'swimlane') return '#1e293b';
            if (node.type === 'decision') return '#0ea5e9';
            if (node.data?.status === 'completed') return '#10b981';
            if (node.data?.status === 'in-progress') return '#3b82f6';
            if (node.data?.status === 'pending') return '#f59e0b';
            return '#475569';
          }}
          maskColor="rgba(11, 17, 33, 0.7)"
          className="bg-slate-900 border border-slate-700 rounded-lg"
        />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#334155" />
      </ReactFlow>
    </div>
  );
}
