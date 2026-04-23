import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function CreatePoll({ onCreated }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [creator, setCreator] = useState("");

  const handleAddOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    // 1. Simpan ke tabel polls
    const { data: poll, error: pError } = await supabase
      .from("polls")
      .insert([{ question, admin_credential: adminToken, created_by: creator }])
      .select().single();

    if (pError) return alert(pError.message);

    // 2. Simpan opsi
    const optsToInsert = options.filter(o => o !== "").map(o => ({ poll_id: poll.id, option_text: o }));
    await supabase.from("options").insert(optsToInsert);

    alert(`Berhasil! Simpan TOKEN ADMIN Anda: ${adminToken}`);
    onCreated();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4">Buat Polling Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nama Anda" className="w-full p-3 border rounded-xl" value={creator} onChange={e => setCreator(e.target.value)} required />
        <input type="text" placeholder="Pertanyaan" className="w-full p-3 border rounded-xl font-semibold" value={question} onChange={e => setQuestion(e.target.value)} required />
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Opsi Jawaban:</p>
          {options.map((opt, i) => (
            <input key={i} type="text" className="w-full p-2 border rounded-lg" value={opt} onChange={(e) => {
              const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts);
            }} placeholder={`Opsi ${i+1}`} required />
          ))}
          <button type="button" onClick={handleAddOption} className="text-blue-600 text-sm font-medium">+ Tambah Opsi</button>
        </div>
        
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Terbitkan Polling</button>
      </form>
    </div>
  );
}