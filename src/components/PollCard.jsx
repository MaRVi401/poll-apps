import { motion } from 'framer-motion';

export default function PollCard({ poll, options, onVote }) {
  // Hitung total suara untuk persentase
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
      <p className="mt-4 text-sm text-gray-400 text-center">{totalVotes} suara terkumpul</p>
    </div>
  );
}