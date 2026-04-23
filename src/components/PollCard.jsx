import { motion } from 'framer-motion';
import { RotateCcw, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PollCard({ poll, options, fetchPollData }) {
  // 1. Hitung total votes dari data options yang dikirim props
  const totalVotes = options.reduce((acc, opt) => acc + opt.votes_count, 0);

  // 2. Fungsi Utama Voting (Requirement R2)
  const handleVote = async (optionId) => {
    const voterName = prompt("Masukkan nama lengkap Anda untuk memberikan suara:");
    
    // Validasi sederhana
    if (!voterName || voterName.trim() === "") {
      return alert("Nama wajib diisi untuk memberikan suara!");
    }

    try {
      // Insert ke tabel transaksi 'votes'
      const { error } = await supabase
        .from("votes")
        .insert([
          { 
            poll_id: poll.id, 
            option_id: optionId, 
            voter_name: voterName 
          }
        ]);

      if (error) throw error;

      alert(`Terima kasih ${voterName}, suara Anda berhasil dikirim!`);
      
      // Refresh data agar progress bar langsung update
      if (fetchPollData) fetchPollData();
      
    } catch (error) {
      console.error("Error voting:", error.message);
      alert("Gagal mengirim suara. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{poll.question}</h2>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <User size={12} /> Dibuat oleh: {poll.created_by || 'Anonim'}
        </p>
      </div>
      
      <div className="space-y-4">
        {options.map((option) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes_count / totalVotes) * 100);
          
          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => handleVote(option.id)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-400 transition-all relative overflow-hidden group cursor-pointer"
              >
                {/* Background Progress Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute left-0 top-0 bottom-0 bg-blue-50 -z-10"
                />
                
                <div className="flex justify-between items-center z-10">
                  <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                    {option.option_text}
                  </span>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-blue-600">{percentage}%</span>
                    <span className="block text-[10px] text-gray-400">{option.votes_count} suara</span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-bold text-gray-800">{totalVotes}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Total Suara</p>
        </div>
        
        {/* Tombol Reset biasanya diarahkan ke Admin Panel/Dashboard di SaaS */}
        <p className="text-[10px] text-gray-300 italic">ID: {poll.id.substring(0,8)}...</p>
      </div>
    </div>
  );
}