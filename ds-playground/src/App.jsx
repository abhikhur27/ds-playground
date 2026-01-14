import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trash2, Plus, RefreshCcw, Layers, ArrowRightCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility for cleaner classes ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- VISUAL COMPONENTS ---

const Node = ({ value, label, isNew, isHighlight }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex items-center justify-center w-20 h-20 border-2 rounded-lg shadow-sm bg-white font-mono text-xl transition-colors duration-300",
        isHighlight ? "border-accent bg-accent/10" : "border-ink",
        isNew && "ring-2 ring-highlight ring-offset-2"
      )}
    >
      {value}
      {label && (
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs font-serif text-pencil flex items-center justify-end w-14">
          {label} <span className="ml-1 text-accent">→</span>
        </div>
      )}
    </motion.div>
  );
};

// --- DATA STRUCTURE LOGIC ---

const StackVisualizer = ({ operations, setLog }) => {
  const [stack, setStack] = useState([]);

  // Expose methods to parent via useEffect or ref acts as a bridge, 
  // but for simplicity, we pass controls down or lift state up.
  // Here we listen to the 'operations' prop trigger.
  
  React.useEffect(() => {
    if (!operations) return;
    
    if (operations.type === 'PUSH') {
      const newNode = { id: Date.now(), value: operations.value };
      setStack((prev) => [newNode, ...prev]);
      setLog((prev) => [`Pushed ${operations.value} to Stack`, ...prev]);
    }
    
    if (operations.type === 'POP') {
      if (stack.length === 0) {
        setLog((prev) => ["Error: Stack Underflow", ...prev]);
        return;
      }
      const removed = stack[0];
      setStack((prev) => prev.slice(1));
      setLog((prev) => [`Popped ${removed.value} from Stack`, ...prev]);
    }

    if (operations.type === 'CLEAR') {
      setStack([]);
      setLog([]);
    }
  }, [operations]);

  return (
    <div className="flex flex-col items-center justify-end h-full w-full pb-10">
      <div className="w-24 border-b-4 border-ink/20 absolute bottom-10" /> {/* Base of stack */}
      <div className="flex flex-col-reverse gap-2 items-center min-h-[400px] justify-start p-4 bg-paper">
        <AnimatePresence mode='popLayout'>
          {stack.map((item, index) => (
            <Node 
              key={item.id} 
              value={item.value} 
              label={index === 0 ? "TOP" : null}
              isNew={index === 0}
            />
          ))}
        </AnimatePresence>
        {stack.length === 0 && (
          <div className="absolute top-1/2 text-pencil italic font-serif">Empty Stack</div>
        )}
      </div>
    </div>
  );
};

const QueueVisualizer = ({ operations, setLog }) => {
  const [queue, setQueue] = useState([]);

  React.useEffect(() => {
    if (!operations) return;

    if (operations.type === 'INSERT') {
      const newNode = { id: Date.now(), value: operations.value };
      setQueue((prev) => [...prev, newNode]);
      setLog((prev) => [`Enqueued ${operations.value}`, ...prev]);
    }

    if (operations.type === 'DELETE') {
      if (queue.length === 0) {
        setLog((prev) => ["Error: Queue Underflow", ...prev]);
        return;
      }
      const removed = queue[0];
      setQueue((prev) => prev.slice(1));
      setLog((prev) => [`Dequeued ${removed.value}`, ...prev]);
    }
    
    if (operations.type === 'CLEAR') {
      setQueue([]);
      setLog([]);
    }
  }, [operations]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-row gap-4 items-center p-4 min-h-[120px]">
        <AnimatePresence mode='popLayout'>
          {queue.map((item, index) => (
            <div key={item.id} className="relative">
               {/* Pointers */}
              {index === 0 && (
                <motion.div layoutId="front-ptr" className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-accent">
                  FRONT
                </motion.div>
              )}
              {index === queue.length - 1 && (
                <motion.div layoutId="rear-ptr" className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-ink">
                  REAR
                </motion.div>
              )}
              
              <Node 
                value={item.value} 
                isNew={index === queue.length - 1}
              />
              
              {/* Connector Line */}
              {index < queue.length - 1 && (
                 <div className="absolute top-1/2 -right-4 w-4 h-[2px] bg-pencil -z-10" />
              )}
            </div>
          ))}
        </AnimatePresence>
        {queue.length === 0 && (
          <div className="text-pencil italic font-serif">Empty Queue</div>
        )}
      </div>
    </div>
  );
};

// --- MAIN LAYOUT ---

export default function App() {
  const [activeTab, setActiveTab] = useState('stack');
  const [inputValue, setInputValue] = useState('');
  const [currentOp, setCurrentOp] = useState(null);
  const [logs, setLog] = useState([]);

  const handleOp = (type) => {
    if ((type === 'PUSH' || type === 'INSERT') && !inputValue) return;
    setCurrentOp({ type, value: inputValue });
    if (type === 'PUSH' || type === 'INSERT') setInputValue('');
    // Reset op trigger after small delay so React catches the change even if same op
    setTimeout(() => setCurrentOp(null), 100);
  };

  return (
    <div className="min-h-screen flex flex-col font-serif">
      {/* HEADER */}
      <header className="border-b border-pencil/30 bg-paper px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Data Structures Playground</h1>
          <p className="text-sm text-pencil mt-1">Interactive Concept Visualization</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setActiveTab('stack'); setLog([]); }}
            className={cn("px-4 py-2 rounded text-sm transition-all", activeTab === 'stack' ? "bg-ink text-white" : "text-ink hover:bg-black/5")}
          >
            Stack (LIFO)
          </button>
          <button 
            onClick={() => { setActiveTab('queue'); setLog([]); }}
            className={cn("px-4 py-2 rounded text-sm transition-all", activeTab === 'queue' ? "bg-ink text-white" : "text-ink hover:bg-black/5")}
          >
            Queue (FIFO)
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* CANVAS */}
        <section className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-fixed relative overflow-hidden">
          {activeTab === 'stack' ? (
            <StackVisualizer operations={currentOp} setLog={setLog} />
          ) : (
            <QueueVisualizer operations={currentOp} setLog={setLog} />
          )}
        </section>

        {/* SIDEBAR LOGS */}
        <aside className="w-80 border-l border-pencil/30 bg-white p-6 overflow-y-auto hidden md:block">
          <h3 className="text-sm font-bold uppercase tracking-wider text-pencil mb-4">Concept Log</h3>
          <ul className="space-y-3">
            {logs.map((log, i) => (
              <motion.li 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className="text-sm font-mono text-ink border-l-2 border-accent pl-3 py-1"
              >
                {log}
              </motion.li>
            ))}
          </ul>
        </aside>
      </main>

      {/* CONTROL DECK */}
      <footer className="border-t border-pencil/30 bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
        <div className="max-w-4xl mx-auto flex gap-4 items-center justify-center">
          <div className="relative">
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="w-32 px-4 py-3 border-2 border-pencil rounded-md font-mono focus:border-ink focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleOp(activeTab === 'stack' ? 'PUSH' : 'INSERT')}
            />
          </div>

          {activeTab === 'stack' ? (
            <>
              <button onClick={() => handleOp('PUSH')} className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-md hover:bg-slate-700 transition-colors font-bold">
                <Plus size={18} /> Push
              </button>
              <button onClick={() => handleOp('POP')} className="flex items-center gap-2 px-6 py-3 border-2 border-ink text-ink rounded-md hover:bg-slate-100 transition-colors font-bold">
                <ArrowRightCircle size={18} /> Pop
              </button>
            </>
          ) : (
            <>
               <button onClick={() => handleOp('INSERT')} className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-md hover:bg-slate-700 transition-colors font-bold">
                <Plus size={18} /> Enqueue
              </button>
              <button onClick={() => handleOp('DELETE')} className="flex items-center gap-2 px-6 py-3 border-2 border-ink text-ink rounded-md hover:bg-slate-100 transition-colors font-bold">
                <ArrowRightCircle size={18} /> Dequeue
              </button>
            </>
          )}
          
          <div className="w-[1px] h-10 bg-pencil/30 mx-2" />
          
          <button onClick={() => handleOp('CLEAR')} className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-bold">
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </footer>
    </div>
  );
}