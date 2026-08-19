import { Scale, Lock, ShieldCheck, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-navy-800 bg-navy-950 py-8 px-4 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-gold-400" />
          <span><strong>eVault MVP (SIH1284)</strong> — Blockchain-Based Legal Records Seam Demo</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gold-400" /> SHA-256 Fingerprinting
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Swappable MongoDB / Blockchain Seam
          </span>
        </div>

        <div className="text-slate-500">
          Evaluated for Judges & Faculty Review &bull; SIH1284
        </div>
      </div>
    </footer>
  );
}
