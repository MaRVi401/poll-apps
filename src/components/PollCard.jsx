import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PollCard({ poll, options, fetchPollData }) {
  const totalVotes = options.reduce((acc, opt) => acc + opt.votes_count, 0);

  const handleVote = async (optionId) => {
    // 1. Cek Sesi (Frontend)
    const alreadyVoted = sessionStorage.getItem(`voted_${poll.id}`);
    if (alreadyVoted) return alert("Anda sudah memberikan suara pada polling ini!");

    const voterName = prompt("Masukkan Nama Lengkap Anda:");
    if (!voterName || voterName.trim() === "") return alert("Nama wajib diisi!");

    const cleanName = voterName.trim();

    try {
      // 2. Cek Nama di Database (Security Rules)
      const { data: existingVoter, error: checkError } = await supabase
        .from("votes")
        .select("id") // Cukup ambil ID saja untuk efisiensi
        .eq("poll_id", poll.id)
        .eq("voter_name", cleanName)
        .maybeSingle(); // Pakai maybeSingle agar tidak error jika data kosong

      if (checkError) throw checkError;

      if (existingVoter) {
        return alert(`Nama "${cleanName}" sudah digunakan. Gunakan nama lain!`);
      }

      // 3. Eksekusi Vote
      const { error: insertError } = await supabase
        .from("votes")
        .insert([{
          poll_id: poll.id,
          option_id: optionId,
          voter_name: cleanName
        }]);

      if (insertError) throw insertError;

      // 4. Kunci Sesi & Feedback
      sessionStorage.setItem(`voted_${poll.id}`, "true");
      alert("Voting Berhasil!");
      fetchPollData();

    } catch (err) {
      console.error("Error saat voting:", err.message);
      alert("Terjadi kesalahan teknis. Coba lagi nanti.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-800">{poll.question}</h2>
      <div className="space-y-3">
        {options.map(opt => {
          const pct = totalVotes === 0 ? 0 : Math.round((opt.votes_count / totalVotes) * 100);
          return (
            <button key={opt.id} onClick={() => handleVote(opt.id)} className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-indigo-300 relative overflow-hidden group cursor-pointer transition-all">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="absolute inset-0 bg-indigo-50 -z-10" />
              <div className="flex justify-between items-center z-10 font-bold">
                <span className="text-slate-600">{opt.option_text}</span>
                <span className="text-indigo-600">{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{totalVotes} Total Suara</span>
        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}?poll=${poll.id}`); alert("Link disalin!"); }} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-full cursor-pointer"><Share2 size={18} /></button>
      </div>
    </div>
  );
}