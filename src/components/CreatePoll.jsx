import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Check, Link as LinkIcon } from "lucide-react";

export default function CreatePoll({ onCreated }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [creator, setCreator] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const { data: poll } = await supabase.from("polls").insert([{ question, admin_credential: token, created_by: creator }]).select().single();
    const opts = options.filter(o => o !== "").map(o => ({ poll_id: poll.id, option_text: o }));
    await supabase.from("options").insert(opts);
    setResult({ token, link: `${window.location.origin}?poll=${poll.id}` });
  };

  if (result) return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-indigo-500 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32}/></div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Berhasil Diterbitkan!</h2>
      <div className="bg-slate-50 p-4 rounded-2xl text-left mb-4">
        <p className="text-[10px] font-black uppercase text-slate-400">Token Admin (Simpan!)</p>
        <p className="text-xl font-mono font-bold text-indigo-600">{result.token}</p>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(result.link); alert("Link disalin!"); }} className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 mb-4 cursor-pointer"><LinkIcon size={18}/> Salin Link</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-6">Detail Polling</h2>
      <input type="text" placeholder="Nama Pembuat" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setCreator(e.target.value)} required />
      <input type="text" placeholder="Pertanyaan Anda?" className="w-full p-4 border rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setQuestion(e.target.value)} required />
      {options.map((opt, i) => (
        <input key={i} type="text" placeholder={`Opsi ${i+1}`} className="w-full p-3 border rounded-xl" value={opt} onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }} required />
      ))}
      <button type="button" onClick={() => setOptions([...options, ""])} className="text-indigo-600 font-bold text-sm cursor-pointer">+ Tambah Opsi</button>
      <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 cursor-pointer">Terbitkan Sekarang</button>
    </form>
  );
}