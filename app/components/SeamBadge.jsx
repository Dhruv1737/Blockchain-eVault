'use client';

import { useState } from 'react';
import { ShieldCheck, Cpu, ArrowRight, X, Database, Lock, Layers } from 'lucide-react';

export default function SeamBadge({ adapterMode = 'mongodb' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-navy-800/90 border border-gold-500/30 text-gold-400 hover:border-gold-400 transition-all shadow-sm hover:shadow-gold-500/10 cursor-pointer"
        title="Click to view Architecture Seam details"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
        </span>
        <Layers className="w-3.5 h-3.5 text-gold-400" />
        <span>Seam: <span className="text-white font-semibold">{adapterMode === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Chain Seam'}</span></span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl glass-panel-gold rounded-2xl p-6 sm:p-8 text-slate-200 border border-gold-500/40 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-xl text-gold-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Architectural Seam (`lib/chain/index.js`)</h3>
                <p className="text-xs text-gold-400/90 font-mono">Swappable Hash Registry Abstraction Seam</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              As specified in §3 & §5 of the eVault PRD, <strong>no page or API route in this application calls MongoDB directly</strong>. All cryptographic hash storage and verification strictly flow through <code className="px-1.5 py-0.5 rounded bg-navy-950 text-gold-400 font-mono text-xs">lib/chain/index.js</code>.
            </p>

            {/* Visual Flow diagram */}
            <div className="bg-navy-950/90 border border-navy-700 rounded-xl p-4 mb-6">
              <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-3">Live Execution Flow</div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-900 border border-slate-700 w-full sm:w-auto justify-center">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>API Route</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gold-500 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/40 text-gold-300 w-full sm:w-auto justify-center font-bold">
                  <Layers className="w-4 h-4 text-gold-400" />
                  <span>lib/chain/index.js</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gold-500 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-900 border border-emerald-500/40 text-emerald-400 w-full sm:w-auto justify-center">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>{adapterMode === 'mongodb' ? 'mongoAdapter.js (Atlas)' : 'mongoAdapter.js (Fallback)'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Zero Code Changes for On-Chain Swap:</strong> Replacing MongoDB with Solidity/Sepolia smart contracts requires changing 1 line in <code className="text-gold-400 font-mono">lib/chain/index.js</code>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span><strong>Strict Immutability Enforced:</strong> Overwrites and updates to registered SHA-256 document records are blocked at the adapter layer.</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition-colors"
              >
                Close & Continue Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
