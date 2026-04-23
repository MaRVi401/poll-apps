import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Trash2, ShieldCheck, X, RotateCcw } from "lucide-react";

export default function AdminPanel({ pollId, onClose }) {
  const [voters, setVoters] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");

  const checkAdmin = async () => {
    const { data } = await supabase.from("polls").select("admin_credential").eq("id", pollId).single();
    if (data?.admin_credential === token) { setIsAuth(true); fetchVoters(); } else alert("Token Salah!");
  };

  const fetchVoters = async () => {
    const { data } = await supabase.from("votes").select("*").eq("poll_id", pollId).order("created_at", { ascending: false });
    setVoters(data || []);
  };

  if (!isAuth) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <ShieldCheck className="text-indigo-600 mb-4" size={40} />
        <h3 className="text-xl font-black mb-2">Akses Admin</h3>
        <input type="text" placeholder="Masukkan Token Admin" className="w-full p-4 border rounded-2xl mb-4 outline-none focus:ring-2 ring-indigo-500" onChange={e => setToken(e.target.value)} />
        <div className="flex gap-2"><button onClick={onClose} className="flex-1 font-bold text-slate-400 cursor-pointer">Batal</button><button onClick={checkAdmin} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer">Masuk</button></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">Audit Pemilih</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X/></button>
        </div>
        <button onClick={async () => { if(confirm("Hapus semua suara?")) await supabase.from("votes").delete().eq("poll_id", pollId); fetchVoters(); }} className="mb-6 flex items-center gap-2 text-red-600 font-bold text-sm p-3 rounded-xl hover:bg-red-50 cursor-pointer"><RotateCcw size={16}/> Reset Polling</button>
        <div className="space-y-2">
          {voters.map(v => (
            <div key={v.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-700">{v.voter_name}</p>
                <p className="text-[10px] text-slate-400 uppercase">{new Date(v.created_at).toLocaleString()}</p>
              </div>
              <button onClick={async () => { await supabase.from("votes").delete().eq("id", v.id); fetchVoters(); }} className="text-red-400 hover:text-red-600 p-2 cursor-pointer transition-colors"><Trash2 size={18}/></button>
            </div>
          ))}
          {voters.length === 0 && <p className="text-center py-10 text-slate-400">Belum ada suara masuk.</p>}
        </div>
      </div>
    </div>
  );
}