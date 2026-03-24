export function SwimlaneNode({ data }: { data: any }) {
  return (
    <div className="w-[400px] h-[2100px] bg-slate-900/30 border-r border-l border-slate-800/50 p-6 pt-10 text-center pointer-events-none relative flex flex-col">
      <div className="sticky top-6 z-0">
        <h2 className="text-2xl font-black text-slate-600/80 tracking-[0.2em] uppercase">
          {data.label}
        </h2>
      </div>
      
      {/* Subtle grid pattern background for the lane */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
      />
    </div>
  );
}
