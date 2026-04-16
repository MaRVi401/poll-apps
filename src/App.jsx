import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import PollCard from './components/PollCard';

function App() {
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // 1. Ambil data awal
    fetchPollData();

    // 2. Setup Real-time Subscription
    const channel = supabase
      .channel('public:options')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'options' }, 
        (payload) => {
          setOptions((prev) =>
            prev.map((opt) => (opt.id === payload.new.id ? payload.new : opt))
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchPollData = async () => {
    // Ambil pertanyaan pertama
    const { data: polls } = await supabase.from('polls').select('*').limit(1).single();
    if (polls) {
      setPoll(polls);
      const { data: opts } = await supabase.from('options').select('*').eq('poll_id', polls.id);
      setOptions(opts);
    }
  };

  const handleVote = async (optionId, currentVotes) => {
    await supabase
      .from('options')
      .update({ votes_count: currentVotes + 1 })
      .eq('id', optionId);
  };

  if (!poll) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-black text-blue-600 mb-8 tracking-tighter">CodesMile Poll</h1>
      <PollCard poll={poll} options={options} onVote={handleVote} />
    </div>
  );
}

export default App;