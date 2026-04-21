import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function PollCard({ poll, options, onVote, onReset }) {
  const totalVotes = options.reduce((acc, opt) => acc + opt.votes_count, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{poll.question}</h2>
      
      <div className="space-y-4">
        {options.map((option) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes_count / totalVotes) * 100);
          
          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => onVote(option.id, option.votes_count)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-400 transition-all relative overflow-hidden group"
              >
                {/* Background Progress Bar dengan Framer Motion */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className="absolute left-0 top-0 bottom-0 bg-blue-100 -z-10 transition-all"
                />
                
                <div className="flex justify-between items-center z-10">
                  <span className="font-medium text-gray-700">{option.option_text}</span>
                  <span className="text-sm font-bold text-blue-600">{percentage}%</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bagian Footer Baru: Menampilkan jumlah suara dan tombol reset */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-400">{totalVotes} suara terkumpul</p>
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}