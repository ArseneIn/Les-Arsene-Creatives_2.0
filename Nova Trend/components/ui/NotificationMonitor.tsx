
import React from 'react';
import { MessageSquare, Bell, Clock, CheckCircle2, Send } from 'lucide-react';



import { useNotification } from '../context/NotificationContext';

const NotificationMonitor: React.FC = () => {
  const { logs } = useNotification();

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[200] w-80 space-y-3 pointer-events-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-orange-600 rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Automation Live</span>
      </div>

      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-right-8 duration-500 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-600/10 text-orange-600 rounded-lg">
                <Send className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{log.type} Sent</span>
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase">{log.timestamp}</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed font-medium line-clamp-3">
            {log.message}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span className="text-[9px] font-black text-green-500 uppercase">Delivered to Gateway</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationMonitor;
