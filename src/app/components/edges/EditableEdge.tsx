import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps, useReactFlow } from '@xyflow/react';

export function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return { ...edge, label: evt.target.value };
        }
        return edge;
      })
    );
  };

  const onDelete = () => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{
        ...style,
        strokeWidth: selected ? 3 : 2,
        stroke: selected ? '#0ea5e9' : '#64748b',
        cursor: 'pointer'
      }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-1 z-50 bg-[#0b1121] rounded px-1"
        >
          <input
            value={(label as string) || ''}
            onChange={onLabelChange}
            placeholder="..."
            className="bg-[#1e293b] border border-slate-700 text-slate-300 text-[11px] font-semibold px-2 py-0.5 rounded outline-none focus:ring-1 focus:ring-sky-500 w-[60px] text-center"
          />
          {selected && (
            <button 
              onClick={onDelete}
              className="bg-red-500/90 hover:bg-red-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs shadow-lg transition-transform hover:scale-105"
              title="Холбоосыг устгах"
            >
              ×
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
