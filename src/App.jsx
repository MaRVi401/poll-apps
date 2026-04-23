import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// Impor komponen dari folder components
import LandingPage from "./components/LandingPage";
import CreatePoll from "./components/CreatePoll";
import PollCard from "./components/PollCard";
import AdminPanel from "./components/AdminPanel";

import { PlusCircle, Home, Loader2, Settings, ArrowLeft } from "lucide-react";

export default function App() {
  const [polls, setPolls] = useState([]);
  const [activeView, setActiveView] = useState("landing"); 
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Logika untuk menangkap ID Polling dari URL
  const queryParams = new URLSearchParams(window.location.search);
  const targetPollId = queryParams.get('poll');

  const fetchData = async () => {
    const { data } = await supabase
      .from("polls")
      .select("*, options(*)")
      .order("created_at", { ascending: false });
    setPolls(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    // Jika ada parameter poll di URL, langsung arahkan ke view list
    if (targetPollId) {
      setActiveView("list");
    }
    
    fetchData();

    const channel = supabase.channel('db-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
      .subscribe();
    
    return () => supabase.removeChannel(channel);
  }, [targetPollId]);

  // Fungsi untuk kembali ke dashboard (reset URL)
  const clearFilter = () => {
    window.history.pushState({}, "", "/");
    setActiveView("landing");
    fetchData();
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <button onClick={clearFilter} className="text-2xl font-black italic tracking-tighter text-indigo-600 cursor-pointer">
            CODSMILE.
          </button>
          <nav className="flex items-center gap-4">
            {activeView !== "landing" && (
              <button onClick={clearFilter} className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer">
                <Home size={18}/> Beranda
              </button>
            )}
            <button onClick={() => setActiveView("create")} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-100 transition-all">
              <PlusCircle size={18}/> Buat Polling
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {activeView === "landing" && (
          <LandingPage onStart={() => setActiveView("create")} />
        )}

        {activeView === "create" && (
          <CreatePoll onCreated={() => { fetchData(); setActiveView("list"); }} />
        )}

        {activeView === "list" && (
          <>
            {/* Tombol Kembali jika sedang memfilter polling tertentu */}
            {targetPollId && (
              <button 
                onClick={clearFilter}
                className="mb-6 flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
              >
                <ArrowLeft size={20} /> Lihat Semua Polling
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {polls
                // FITUR FILTER: Hanya tampilkan poll yang sesuai targetPollId jika ada
                .filter(poll => !targetPollId || poll.id === targetPollId)
                .map(poll => (
                  <div key={poll.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PollCard 
                      poll={poll} 
                      options={poll.options} 
                      fetchPollData={fetchData} 
                    />
                    
                    {/* Tombol Akses Admin */}
                    <button 
                      onClick={() => setSelectedAdminId(poll.id)} 
                      className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:text-indigo-600 cursor-pointer"
                    >
                      <Settings size={20}/>
                    </button>
                  </div>
                ))}
            </div>

            {/* Empty State jika ID di URL tidak ditemukan */}
            {targetPollId && polls.filter(p => p.id === targetPollId).length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400">Polling tidak ditemukan atau telah dihapus.</p>
                <button onClick={clearFilter} className="mt-4 text-indigo-600 font-bold uppercase tracking-widest text-sm">Kembali ke Beranda</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL ADMIN */}
      {selectedAdminId && (
        <AdminPanel 
          pollId={selectedAdminId} 
          onClose={() => setSelectedAdminId(null)} 
        />
      )}
    </div>
  );
}