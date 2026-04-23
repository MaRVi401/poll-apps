import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import PollCard from "./components/PollCard";
import CreatePoll from "./components/CreatePoll";
import AdminPanel from "./components/AdminPanel";
import { PlusCircle, Settings } from "lucide-react";

export default function App() {
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  // Fungsi ambil data (sama seperti Laravel Controller)
  const fetchData = async () => {
    const { data } = await supabase
      .from("polls")
      .select("*, options(*)")
      .order("created_at", { ascending: false });
    setPolls(data || []);
  };

  useEffect(() => {
    fetchData();
    // Realtime Subs (Optional: Untuk update otomatis tanpa refresh)
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-xl font-black italic tracking-tighter text-indigo-600">CODSMILE POLL.</h1>
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition cursor-pointer"
          >
            <PlusCircle size={20} /> Buat Polling
          </button>
        </div>
      </header>

      {/* LIST POLLING */}
      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(poll => (
          <div key={poll.id} className="relative group">
            <PollCard 
              poll={poll} 
              options={poll.options} 
              fetchPollData={fetchData} 
            />
            {/* Tombol Rahasia ke Admin Panel */}
            <button 
              onClick={() => setSelectedAdminId(poll.id)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm border border-gray-100"
            >
              <Settings size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </main>

      {/* MODALS */}
      {showCreate && <CreatePoll onCreated={() => { setShowCreate(false); fetchData(); }} onClose={() => setShowCreate(false)} />}
      {selectedAdminId && <AdminPanel pollId={selectedAdminId} onClose={() => setSelectedAdminId(null)} />}
    </div>
  );
}