import { Handle, Position, NodeResizer, useReactFlow, NodeToolbar } from '@xyflow/react';

export function DecisionNode({ id, data, selected }: { id: string, data: any, selected: boolean }) {
  const { updateNodeData, setNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <button 
          onClick={handleDelete}
          className="bg-red-900/80 hover:bg-red-800 text-red-100 text-xs px-2 py-1 rounded border border-red-700/50 shadow-lg pointer-events-auto transition"
        >
          Устгах
        </button>
      </NodeToolbar>
      <NodeResizer 
        color="#0ea5e9" 
        isVisible={selected} 
        minWidth={120} 
        minHeight={120} 
      />
      <div 
        className="w-full h-full relative flex flex-col items-center justify-center group"
        style={{ minWidth: 120, minHeight: 120 }}
      >
        <svg 
          className="absolute inset-0 w-full h-full text-slate-800/90 drop-shadow-[0_0_15px_rgba(14,165,233,0.15)] transition-all pointer-events-none" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
           <polygon 
             points="50,5 95,50 50,95 5,50" 
             fill="currentColor" 
             stroke="#0ea5e9" 
             strokeWidth="2"
             strokeDasharray="4 2"
           />
        </svg>
        <div 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateNodeData(id, { label: e.currentTarget.innerText })}
          className="relative z-10 text-center text-xs font-semibold text-slate-100 px-6 whitespace-pre-wrap nodrag outline-none focus:ring-2 focus:ring-sky-500 rounded p-1"
        >
          {data.label}
        </div>

        {/* Targets */}
        <Handle type="target" position={Position.Top} id="t-top" className="opacity-0 w-4 h-4" />
        <Handle type="target" position={Position.Left} id="t-left" className="opacity-0 w-4 h-4" />
        <Handle type="target" position={Position.Right} id="t-right" className="opacity-0 w-4 h-4" />
        <Handle type="target" position={Position.Bottom} id="t-bottom" className="opacity-0 w-4 h-4" />

        {/* Sources */}
        <Handle type="source" position={Position.Top} id="s-top" className="opacity-0 w-4 h-4" />
        <Handle type="source" position={Position.Left} id="s-left" className="opacity-0 w-4 h-4" />
        <Handle type="source" position={Position.Right} id="s-right" className="opacity-0 w-4 h-4" />
        <Handle type="source" position={Position.Bottom} id="s-bottom" className="opacity-0 w-4 h-4" />
      </div>
    </>
  );
}
