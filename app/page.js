import Link from 'next/link';
import {
  ShieldCheck,
  FilePlus,
  FileSearch,
  Lock,
  Layers,
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Database,
  Cpu
} from 'lucide-react';
import * as chain from '@/lib/chain';

export const revalidate = 0; // Fresh render on navigation

export default async function HomePage() {
  let docCount = 0;
  let adapterMode = 'in-memory';

  try {
    const docs = await chain.listAllDocuments();
    docCount = docs.length;
    if (docs.length > 0 && docs[0].adapterMode) {
      adapterMode = docs[0].adapterMode;
    }
  } catch (err) {
    console.error('Failed to load documents count:', err);
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel-gold p-8 sm:p-12 border border-gold-500/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gold-500/10 text-gold-400 border border-gold-500/30">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>SIH1284 Blockchain Seam MVP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Immutable Legal Record <br />
            <span className="gold-gradient-text">Verification Vault</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed font-normal">
            eVault stores cryptographic SHA-256 fingerprints of legal documents. 
            Instantly verify whether any agreement, land deed, or court record remains 
            <span className="text-emerald-400 font-semibold"> Authentic</span> or has been 
            <span className="text-tampered-500 font-semibold"> Tampered</span> — zero content exposed.
          </p>

          {/* Primary Action Buttons (§6.1 Requirements) */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/upload"
              className="px-6 py-3.5 rounded-xl text-navy-950 font-extrabold text-sm gold-gradient-btn flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <FilePlus className="w-5 h-5 text-navy-950" />
              <span>Register a Document</span>
              <ArrowRight className="w-4 h-4 text-navy-950" />
            </Link>

            <Link
              href="/verify"
              className="px-6 py-3.5 rounded-xl text-white font-bold text-sm bg-navy-800 hover:bg-navy-700 border border-navy-600 hover:border-gold-500/50 flex items-center gap-2 transition-all shadow-lg"
            >
              <FileSearch className="w-5 h-5 text-gold-400" />
              <span>Verify a Document</span>
            </Link>

            <Link
              href="/documents"
              className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-medium text-sm hover:bg-navy-800/40 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Registry ({docCount})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Live Stats & Architecture Seam Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-navy-700 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Registered Vault Records</span>
            <Lock className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{docCount}</div>
          <p className="text-xs text-slate-400">Cryptographically fingerprint-indexed</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-navy-700 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Core Algorithm</span>
            <Fingerprint className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">SHA-256</div>
          <p className="text-xs text-slate-400">Node.js server-side 256-bit hash digest</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-2 bg-gradient-to-br from-navy-900 to-navy-950">
          <div className="flex items-center justify-between text-gold-400 text-xs font-mono uppercase tracking-wider">
            <span>Architecture Seam</span>
            <Layers className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse"></span>
            <span>{adapterMode === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Fallback'}</span>
          </div>
          <p className="text-xs text-slate-400">Swappable adapter layer via <code className="text-gold-400 font-mono">lib/chain</code></p>
        </div>
      </section>

      {/* How It Works Loop */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Core MVP Verification Loop</h2>
            <p className="text-sm text-slate-400">Three simple steps to guarantee document integrity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-navy-700 hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-gold-400" />
              Upload & Fingerprint
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload any PDF, DOCX, or legal contract. The system computes a 64-character SHA-256 hash server-side.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-navy-700 hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-gold-400" />
              Immutable Seam Storage
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The hash is paired with a unique <code className="text-gold-400 font-mono">docId</code> UUID and saved via the swappable <code className="text-gold-400 font-mono">lib/chain</code> seam.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-navy-700 hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              Side-by-Side Verification
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Re-upload any document later. eVault compares hashes side-by-side to declare 
              <span className="text-emerald-400 font-semibold"> Authentic</span> or 
              <span className="text-tampered-500 font-semibold"> Tampered</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Seam Explanation Card for Presentation Judges */}
      <section className="glass-panel-gold p-8 rounded-3xl border border-gold-500/30 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-2xl text-gold-400 flex-shrink-0">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">Judges Architecture Seam Notice</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              In this MVP build, MongoDB stands in for the ultimate blockchain layer. 
              <strong> Crucially, no UI component or API route calls MongoDB directly.</strong> 
              All registry calls execute through <code className="px-1.5 py-0.5 rounded bg-navy-950 text-gold-400 font-mono text-xs">lib/chain/index.js</code>. 
              When transitioning from prototype to Sepolia/Hyperledger in production, only <code className="px-1.5 py-0.5 rounded bg-navy-950 text-gold-400 font-mono text-xs">lib/chain/index.js</code> is modified.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
