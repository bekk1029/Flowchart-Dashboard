import { Flowchart } from './components/Flowchart';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#0b1121] text-slate-200 font-sans">
      <header className="flex-none p-4 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Үйлдвэрийн Захиалгын Процесс</h1>
          <p className="text-xs text-slate-400 mt-1">SaaS Flowchart Dashboard</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-700"></div>Хэвийн</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Хүлээгдэж буй</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Хийгдэж буй</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Бэлэн</div>
        </div>
      </header>
      
      <main className="flex-1 relative">
        <Flowchart />
      </main>
    </div>
  );
}
