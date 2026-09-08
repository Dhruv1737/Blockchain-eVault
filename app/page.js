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
      <section className="relative rounded-3xl overflow-hidden glass-panel-gold p-8 sm:p-12 border border-amber-200">
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>SIH1284 Blockchain Seam MVP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-900">
            Immutable Legal Record <br />
            <span className="gold-gradient-text">Verification Vault</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            eVault stores cryptographic SHA-256 fingerprints of legal documents.
            Instantly verify whether any agreement, land deed, or court record remains
            <span className="text-emerald-700 font-semibold"> Authentic</span> or has been
            <span className="text-red-700 font-semibold"> Tampered</span> — zero content exposed.
          </p>

          {/* Primary Action Buttons (§6.1 Requirements) */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/upload"
              className="px-6 py-3.5 rounded-xl text-white font-extrabold text-sm gold-gradient-btn flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <FilePlus className="w-5 h-5 text-white" />
              <span>Register a Document</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              href="/verify"
              className="px-6 py-3.5 rounded-xl text-slate-800 font-bold text-sm bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-300 flex items-center gap-2 transition-all shadow-sm"
            >
              <FileSearch className="w-5 h-5 text-amber-700" />
              <span>Verify a Document</span>
            </Link>

            <Link
              href="/documents"
              className="px-5 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-sm hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Registry ({docCount})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Live Stats & Architecture Seam Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Registered Vault Records</span>
            <Lock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{docCount}</div>
          <p className="text-xs text-slate-500">Cryptographically fingerprint-indexed</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Core Algorithm</span>
            <Fingerprint className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">SHA-256</div>
          <p className="text-xs text-slate-500">Node.js server-side 256-bit hash digest</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-amber-200 space-y-2 bg-amber-50/40">
          <div className="flex items-center justify-between text-amber-800 text-xs font-mono uppercase tracking-wider">
            <span>Architecture Seam</span>
            <Layers className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>{adapterMode === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Fallback'}</span>
          </div>
          <p className="text-xs text-slate-500">Swappable adapter layer via <code className="text-amber-800 font-mono">lib/chain</code></p>
        </div>
      </section>

      {/* How It Works Loop */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Core MVP Verification Loop</h2>
            <p className="text-sm text-slate-500">Three simple steps to guarantee document integrity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-mono font-bold text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-amber-700" />
              Upload & Fingerprint
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Upload any PDF, DOCX, or legal contract. The system computes a 64-character SHA-256 hash server-side.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-mono font-bold text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-700" />
              Immutable Seam Storage
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              The hash is paired with a unique <code className="text-amber-800 font-mono">docId</code> UUID and saved via the swappable <code className="text-amber-800 font-mono">lib/chain</code> seam.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-mono font-bold text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              Side-by-Side Verification
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Re-upload any document later. eVault compares hashes side-by-side to declare
              <span className="text-emerald-700 font-semibold"> Authentic</span> or
              <span className="text-red-700 font-semibold"> Tampered</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Seam Explanation Card for Presentation Judges */}
      <section className="glass-panel-gold p-8 rounded-3xl border border-amber-200 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 flex-shrink-0">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">Judges Architecture Seam Notice</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In this MVP build, MongoDB stands in for the ultimate blockchain layer.
              <strong> Crucially, no UI component or API route calls MongoDB directly.</strong>
              All registry calls execute through <code className="px-1.5 py-0.5 rounded bg-slate-100 text-amber-800 font-mono text-xs">lib/chain/index.js</code>.
              When transitioning from prototype to Sepolia/Hyperledger in production, only <code className="px-1.5 py-0.5 rounded bg-slate-100 text-amber-800 font-mono text-xs">lib/chain/index.js</code> is modified.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
