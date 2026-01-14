import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, ArrowRightCircle, Link as LinkIcon } from 'lucide-react';

// --- VISUAL COMPONENTS ---
const Node = ({ value, label, isNew, isLinkedList }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8, y: -20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.5 }}
    className={`relative flex items-center justify-center border-2 border-slate-800 rounded-lg bg-white font-mono text-xl shadow-sm transition-colors
      ${isLinkedList ? 'w-24 h-16' : 'w-20 h-20'}
    `}
  >
    {isLinkedList ? (
      <div className="flex w-full h-full">
        <div className="flex-1 flex items-center justify-center border-r-2 border-slate-800">{value}</div>
        <div className="w-8 flex items-center justify-center bg-slate-50 text-[10px] text-slate-400">NEXT</div>
      </div>
    ) : value}
    
    {label && (
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-[10px] font-bold text-teal-600 flex items-center">
        {label} <span className="ml-1">→</span>
      </div>
    )}
  </motion.div>
);

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('stack');
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState([]);

  const addNode = () => {
    if (!inputValue) return;
    const newNode = { id: Date.now(), value: inputValue };
    
    if (activeTab === 'stack') {
      setData([newNode, ...data]);
      setLogs(prev => [`Push: ${inputValue}`, ...prev]);
    } else {
      setData([...data, newNode]);
      setLogs(prev => [activeTab === 'queue' ? `Enqueue: ${inputValue}` : `Append: ${inputValue}`, ...prev]);
    }
    setInputValue('');
  };

  const removeNode = () => {
    if (data.length === 0) return;
    const removed = data[0];
    setData(data.slice(1));
    setLogs(prev => [`Removed: ${removed.value}`, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F6] text-slate-800 font-serif">
      <header className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
        <div>
          <h1 className="text-xl font-bold">DS Playground</h1>
          <p className="text-xs text-slate-400">Interactive Textbook Diagrams</p>
        </div>
        <div className="flex gap-2">
          {['stack', 'queue', 'linkedlist'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setData([]); setLogs([]); }}
              className={`px-3 py-1 rounded text-sm capitalize ${activeTab === tab ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 relative flex items-center justify-center p-10">
          <div className={`flex gap-4 items-center ${activeTab === 'stack' ? 'flex-col-reverse' : 'flex-row'}`}>
            <AnimatePresence mode="popLayout">
              {data.map((item, i) => (
                <React.Fragment key={item.id}>
                  <Node 
                    value={item.value} 
                    isLinkedList={activeTab === 'linkedlist'}
                    label={i === 0 ? (activeTab === 'stack' ? 'TOP' : 'HEAD') : null} 
                  />
                  {activeTab !== 'stack' && i < data.length - 1 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-slate-300">──→</motion.div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
            {data.length === 0 && <p className="text-slate-300 italic">Structure is empty</p>}
          </div>
        </section>

        <aside className="w-64 border-l border-slate-200 p-4 bg-white overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-400 uppercase mb-4">Activity Log</h2>
          {logs.map((log, i) => (
            <div key={i} className="text-xs font-mono mb-2 border-l-2 border-teal-500 pl-2">{log}</div>
          ))}
        </aside>
      </main>

      <footer className="p-6 border-t border-slate-200 bg-white flex justify-center gap-4">
        <input 
          type="text" 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Value"
          className="border-2 border-slate-200 rounded px-3 py-2 w-24 focus:border-slate-800 outline-none font-mono"
        />
        <button onClick={addNode} className="bg-slate-800 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-slate-700">
          <Plus size={16}/> {activeTab === 'stack' ? 'Push' : 'Add'}
        </button>
        <button onClick={removeNode} className="border-2 border-slate-800 px-6 py-2 rounded flex items-center gap-2 hover:bg-slate-50">
          <ArrowRightCircle size={16}/> {activeTab === 'stack' ? 'Pop' : 'Remove'}
        </button>
      </footer>
    </div>
  );
}