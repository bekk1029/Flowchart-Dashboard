import { Handle, Position, NodeResizer, useReactFlow, NodeToolbar } from '@xyflow/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, CircleCheck, Clock, CirclePlay } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StepNode({ id, data, selected }: { id: string, data: any, selected: boolean }) {
  const { updateNodeData, setNodes } = useReactFlow();
  const status = data.status || 'default';
  
  const statusColors = {
    'default': 'bg-slate-800/80 border-slate-600 text-slate-200 shadow-slate-900/50',
    'pending': 'bg-amber-950/60 border-amber-600/50 text-amber-100 shadow-amber-900/20',
    'in-progress': 'bg-blue-950/60 border-blue-500/50 text-blue-100 shadow-blue-900/20',
    'completed': 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100 shadow-emerald-900/20',
  };

  const StatusIcon = {
    'pending': Clock,
    'in-progress': CirclePlay,
    'completed': CircleCheck,
    'default': null
  }[status as keyof typeof statusColors];

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
        minWidth={150} 
        minHeight={50} 
      />
      <div className={cn(
        "w-full h-full min-w-[150px] min-h-[50px] p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm transition-all relative",
        statusColors[status as keyof typeof statusColors]
      )}>
        {StatusIcon && (
          <StatusIcon className={cn(
            "absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-900 border-2",
            status === 'pending' && "text-amber-400 border-amber-700",
            status === 'in-progress' && "text-blue-400 border-blue-700",
            status === 'completed' && "text-emerald-400 border-emerald-700"
          )} />
        )}
        
        {data.role && (
          <div 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateNodeData(id, { role: e.currentTarget.innerText })}
            className="text-[10px] font-bold tracking-wider text-slate-400 mb-2 flex items-center justify-center gap-1.5 uppercase nodrag outline-none focus:ring-1 focus:ring-slate-500 rounded p-0.5"
          >
            {data.role}
          </div>
        )}
        <div 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateNodeData(id, { label: e.currentTarget.innerText })}
          className="text-sm font-medium leading-snug whitespace-pre-wrap nodrag outline-none focus:ring-2 focus:ring-slate-500 rounded p-1 w-full"
        >
          {data.label}
        </div>

        {/* Targets */}
        <Handle type="target" position={Position.Top} id="t-top" className="w-2 h-2 !bg-slate-400 !border-none" />
        <Handle type="target" position={Position.Left} id="t-left" className="w-2 h-2 !bg-slate-400 !border-none" />
        <Handle type="target" position={Position.Right} id="t-right" className="w-2 h-2 !bg-slate-400 !border-none" />
        <Handle type="target" position={Position.Bottom} id="t-bottom" className="w-2 h-2 !bg-slate-400 !border-none" />

        {/* Sources */}
        <Handle type="source" position={Position.Top} id="s-top" className="w-2 h-2 !bg-slate-400 !border-none opacity-0" />
        <Handle type="source" position={Position.Left} id="s-left" className="w-2 h-2 !bg-slate-400 !border-none opacity-0" />
        <Handle type="source" position={Position.Right} id="s-right" className="w-2 h-2 !bg-slate-400 !border-none opacity-0" />
        <Handle type="source" position={Position.Bottom} id="s-bottom" className="w-2 h-2 !bg-slate-400 !border-none opacity-0" />
      </div>
    </>
  );
}
