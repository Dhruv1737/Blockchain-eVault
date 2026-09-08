'use client';

import { useState } from 'react';
import { ShieldCheck, Cpu, ArrowRight, X, Database, Lock, Layers } from 'lucide-react';

export default function SeamBadge({ adapterMode = 'mongodb' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-white border border-amber-200 text-amber-800 hover:border-amber-300 transition-colors cursor-pointer"
        title="Click to view Architecture Seam details"
      >
        <span className="inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        <Layers className="w-3.5 h-3.5 text-amber-700" />
        <span>Seam: <span className="text-slate-900 font-semibold">{adapterMode === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Chain Seam'}</span></span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl glass-panel-gold rounded-2xl p-6 sm:p-8 text-slate-700 border border-amber-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Architectural Seam (`lib/chain/index.js`)</h3>
                <p className="text-xs text-amber-800 font-mono">Swappable Hash Registry Abstraction Seam</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              As specified in §3 & §5 of the eVault PRD, <strong>no page or API route in this application calls MongoDB directly</strong>. All cryptographic hash storage and verification strictly flow through <code className="px-1.5 py-0.5 rounded bg-slate-100 text-amber-800 font-mono text-xs">lib/chain/index.js</code>.
            </p>

            {/* Visual Flow diagram */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-3">Live Execution Flow</div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 w-full sm:w-auto justify-center">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>API Route</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 w-full sm:w-auto justify-center font-bold">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>lib/chain/index.js</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 rotate-90 sm:rotate-0" />
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 w-full sm:w-auto justify-center">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>{adapterMode === 'mongodb' ? 'mongoAdapter.js (Atlas)' : 'mongoAdapter.js (Fallback)'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <span><strong>Zero Code Changes for On-Chain Swap:</strong> Replacing MongoDB with Solidity/Sepolia smart contracts requires changing 1 line in <code className="text-amber-800 font-mono">lib/chain/index.js</code>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <span><strong>Strict Immutability Enforced:</strong> Overwrites and updates to registered SHA-256 document records are blocked at the adapter layer.</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors"
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
