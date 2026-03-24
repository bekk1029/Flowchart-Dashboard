import { useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
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

const LOCAL_STORAGE_KEY_NODES = 'flowchart-nodes';
const LOCAL_STORAGE_KEY_EDGES = 'flowchart-edges';

const getInitialNodes = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NODES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse nodes from local storage:', e);
  }
  return initialNodes;
};

const getInitialEdges = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_EDGES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse edges from local storage:', e);
  }
  return initialEdges;
};

// WebSocket сервэр рүү холбогдох (deploy хийх үед тохируулахаар)
const isProd = (import.meta as any).env?.PROD;
const socketURL = (import.meta as any).env?.VITE_WEBSOCKET_URL || (isProd ? window.location.origin : 'http://localhost:3001');
const socket = io(socketURL);

export function Flowchart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());
  
  // Өөрөө өөрчилсөн эсвэл бусад хүнээс ирсэн өөрчлөлтийг ялгах хувьсагчууд
  const isRemoteUpdateNodes = useRef(false);
  const isRemoteUpdateEdges = useRef(false);

  useEffect(() => {
    // Сервэрээс анхны өгөгдлийг хүлээж авах
    socket.on('init', (data) => {
      isRemoteUpdateNodes.current = true;
      isRemoteUpdateEdges.current = true;
      if (data.nodes) setNodes(data.nodes);
      if (data.edges) setEdges(data.edges);
    });

    // Бусад хүн нод зөөвөл / өөрчилбөл
    socket.on('updateNodes', (newNodes) => {
      isRemoteUpdateNodes.current = true;
      setNodes(newNodes);
    });

    // Бусад хүн холбоос үүсгэвэл / өөрчилбөл
    socket.on('updateEdges', (newEdges) => {
      isRemoteUpdateEdges.current = true;
      setEdges(newEdges);
    });

    socket.on('reset', () => {
      isRemoteUpdateNodes.current = true;
      isRemoteUpdateEdges.current = true;
      setNodes(initialNodes);
      setEdges(initialEdges);
      localStorage.removeItem(LOCAL_STORAGE_KEY_NODES);
      localStorage.removeItem(LOCAL_STORAGE_KEY_EDGES);
    });

    return () => {
      socket.off('init');
      socket.off('updateNodes');
      socket.off('updateEdges');
      socket.off('reset');
    };
  }, [setNodes, setEdges]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes));
    if (!isRemoteUpdateNodes.current) {
      socket.emit('updateNodes', nodes); // Өөрчлөлтийг бусад хүмүүст цацах
    } else {
      isRemoteUpdateNodes.current = false;
    }
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));
    if (!isRemoteUpdateEdges.current) {
      socket.emit('updateEdges', edges); // Өөрчлөлтийг бусад хүмүүст цацах
    } else {
      isRemoteUpdateEdges.current = false;
    }
  }, [edges]);

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
          <button 
            onClick={() => {
              if (window.confirm("Бүх өөрчлөлтийг устгаж анхны байдалд оруулах уу? (Бусад бүх хүн дээр мөн адил устгагдана)")) {
                localStorage.removeItem(LOCAL_STORAGE_KEY_NODES);
                localStorage.removeItem(LOCAL_STORAGE_KEY_EDGES);
                socket.emit('reset'); // Бусад хүмүүст 'reset' сигнал явуулах
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800/80 text-red-100 text-xs font-semibold rounded-lg border border-red-800/50 transition ml-2"
          >
            ↺ Анхны байдалд
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
