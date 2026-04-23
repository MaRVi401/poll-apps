import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Trash2, ShieldCheck, X } from "lucide-react";

export default function AdminPanel({ pollId, onClose }) {
  const [voters, setVoters] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  const checkAdmin = async () => {
    const { data } = await supabase
      .from("polls")
      .select("admin_credential")
      .eq("id", pollId)
      .single();

    if (data?.admin_credential === tokenInput) {
      setIsAuthenticated(true);
      fetchVoters();
    } else {
      alert("Token Admin Salah!");
    }
  };

  const fetchVoters = async () => {
    const { data } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", pollId)
      .order("created_at", { ascending: false });
    setVoters(data || []);
  };

  const deleteVote = async (voteId) => {
    if (!confirm("Hapus suara ini? Angka polling akan berkurang otomatis.")) return;
    const { error } = await supabase.from("votes").delete().eq("id", voteId);
    if (!error) fetchVoters();
  };

  if (!isAuthenticated) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" /> Akses Admin
        </h3>
        <p className="text-sm text-gray-500 mb-4">Masukkan kode rahasia untuk mengelola polling ini.</p>
        <input 
          type="text" 
          placeholder="Token Admin..." 
          className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={tokenInput}
          onChange={e => setTokenInput(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-gray-500 font-medium">Batal</button>
          <button onClick={checkAdmin} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold">Masuk</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto p-4 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Moderasi Pemilih</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Nama Pemilih</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Waktu</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {voters.map(v => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                  <td className="p-4 font-medium">{v.voter_name}</td>
                  <td className="p-4 text-xs text-gray-400">{new Date(v.created_at).toLocaleString('id-ID')}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteVote(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {voters.length === 0 && <p className="p-10 text-center text-gray-400">Belum ada suara masuk.</p>}
        </div>
      </div>
    </div>
  );
}