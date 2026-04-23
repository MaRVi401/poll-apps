import { motion } from "framer-motion";
import { Zap, ShieldCheck, BarChart3, Users } from "lucide-react";

export default function LandingPage({ onStart }) {
  const features = [
    { icon: <Zap className="text-amber-500" />, title: "Tanpa Login", desc: "Langsung buat polling." },
    { icon: <Users className="text-blue-500" />, title: "Transparan", desc: "Audit trail pemilih." },
    { icon: <ShieldCheck className="text-green-500" />, title: "Admin Token", desc: "Kontrol penuh polling." },
    { icon: <BarChart3 className="text-indigo-500" />, title: "Real-time", desc: "Hasil instan." }
  ];

  return (
    <div className="text-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-6xl font-black mb-6 leading-tight">Polling Real-time <br/><span className="text-indigo-600 italic text-5xl">Untuk Tim Modern.</span></h1>
        <button onClick={onStart} className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-transform cursor-pointer">Buat Polling Sekarang</button>
      </motion.div>
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-left">
            <div className="mb-4">{f.icon}</div>
            <h3 className="font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}