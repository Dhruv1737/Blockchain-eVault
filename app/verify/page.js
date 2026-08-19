'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  FileCheck,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Loader2,
  Copy,
  Check,
  Download,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  FileText
} from 'lucide-react';

function VerifyForm() {
  const searchParams = useSearchParams();
  const initialDocId = searchParams.get('docId') || '';

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Fetch all registered documents for dropdown
  useEffect(() => {
    async function loadDocs() {
      setDocsLoading(true);
      try {
        const res = await fetch('/api/documents');
        const data = await res.json();
        if (res.ok && data.success) {
          setDocuments(data.documents || []);
          // If initialDocId wasn't passed, default select the first doc if available
          if (!initialDocId && data.documents && data.documents.length > 0) {
            setSelectedDocId(data.documents[0].docId);
          }
        }
      } catch (err) {
        console.error('Failed to load documents dropdown:', err);
      } finally {
        setDocsLoading(false);
      }
    }
    loadDocs();
  }, [initialDocId]);

  // Keep selectedDocId synced if searchParams changes
  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
    }
  }, [initialDocId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setVerifyResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
      setVerifyResult(null);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!selectedDocId || !selectedFile) return;

    setLoading(true);
    setError(null);
    setVerifyResult(null);

    try {
      const formData = new FormData();
      formData.append('docId', selectedDocId);
      formData.append('file', selectedFile);

      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error during verification.');
      }

      setVerifyResult(data);

      // Trigger celebration confetti if Authentic match
      if (data.match && !data.notFound) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#059669', '#F59E0B', '#FDE047'],
        });
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedDocMeta = documents.find((d) => d.docId === selectedDocId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gold-500/10 text-gold-400 border border-gold-500/30">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Step 2: Cryptographic Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Verify Document Authenticity</h1>
        <p className="text-sm text-slate-400">
          Compare any file against its registered SHA-256 fingerprint on the chain seam to verify integrity or detect byte tampering.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-navy-700 space-y-8">
        <form onSubmit={handleVerify} className="space-y-6">
          
          {/* Document Target Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              1. Select Target Registered Record (docId)
            </label>

            {docsLoading ? (
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-700 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Loading registered documents registry...</span>
              </div>
            ) : (
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setVerifyResult(null);
                }}
                className="w-full p-3.5 rounded-xl bg-navy-900 border border-navy-700 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors font-mono"
              >
                <option value="" disabled>-- Select a Registered Document --</option>
                {documents.map((doc) => (
                  <option key={doc.docId} value={doc.docId}>
                    {doc.filename} ({doc.docId.slice(0, 16)}...)
                  </option>
                ))}
              </select>
            )}

            {selectedDocMeta && (
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
                <span>Stored Hash: <span className="text-gold-400">{selectedDocMeta.hash.slice(0, 16)}...{selectedDocMeta.hash.slice(-16)}</span></span>
                <span>Registered: {new Date(selectedDocMeta.registeredAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Test File Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                2. Upload File to Test / Check
              </label>

              {/* Demo Helper Sample File Buttons */}
              <div className="flex items-center gap-2 text-[11px]">
                <a
                  href={`/api/samples?docId=${encodeURIComponent(selectedDocId || '')}&tampered=false`}
                  download
                  className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                  title="Download authentic original document to verify match"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Authentic Sample</span>
                </a>

                <a
                  href={`/api/samples?docId=${encodeURIComponent(selectedDocId || '')}&tampered=true`}
                  download
                  className="px-2.5 py-1 rounded bg-tampered-500/10 hover:bg-tampered-500/20 text-tampered-500 border border-tampered-500/30 flex items-center gap-1 transition-colors"
                  title="Download tampered document to test tamper detection"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Tampered Sample</span>
                </a>
              </div>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                selectedFile
                  ? 'border-gold-500/60 bg-gold-500/5'
                  : 'border-navy-600 hover:border-gold-500/40 bg-navy-900/40'
              }`}
            >
              <input
                type="file"
                id="verify-file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="verify-file" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center mx-auto text-gold-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                    <p className="text-xs text-gold-400 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Choose file to verify against selected record
                    </p>
                    <p className="text-xs text-slate-400">
                      Upload the original file or a suspected altered copy
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Inline Error */}
          {error && (
            <div className="p-4 rounded-xl bg-tampered-900/40 border border-tampered-500/40 text-tampered-500 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Check Action Button (§6.4 Requirement: disabled until doc & file selected) */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!selectedDocId || !selectedFile || loading}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                !selectedDocId || !selectedFile || loading
                  ? 'bg-navy-800 text-slate-500 cursor-not-allowed border border-navy-700'
                  : 'gold-gradient-btn text-navy-950 shadow-lg shadow-gold-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-navy-950" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-navy-950" />
                  <span>Check Authenticity</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Verification Result Cards (§6.4 Requirements) */}
        {verifyResult && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* STATE 1: AUTHENTIC RESULT (GREEN) */}
            {verifyResult.match && !verifyResult.notFound && (
              <div className="glass-panel-emerald rounded-3xl p-6 sm:p-8 border border-emerald-500/50 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authentic & Unmodified</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">Matches Registered Document</h3>
                    <p className="text-xs text-emerald-200">
                      The SHA-256 fingerprint of the uploaded file strictly matches the chain registry record.
                    </p>
                  </div>
                </div>

                {/* Side-by-Side Hash Comparison */}
                <div className="bg-navy-950/90 rounded-2xl p-5 border border-emerald-500/30 space-y-4 font-mono text-xs">
                  <div className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
                    Side-by-Side Hash Transparency Check
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-navy-900 border border-emerald-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase">Chain Stored Hash</span>
                      <div className="text-emerald-400 font-mono break-all font-semibold">
                        {verifyResult.storedHash}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-navy-900 border border-emerald-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase">Uploaded File Computed Hash</span>
                      <div className="text-emerald-400 font-mono break-all font-semibold">
                        {verifyResult.computedHash}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
                    <span>Result Status: <strong>100% Cryptographic Match</strong></span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">Zero Bit Difference</span>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 2: TAMPERED RESULT (RED) */}
            {!verifyResult.match && !verifyResult.notFound && (
              <div className="glass-panel-crimson rounded-3xl p-6 sm:p-8 border border-tampered-500/50 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-tampered-500/20 border border-tampered-500/40 text-tampered-500">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tampered-500/20 text-tampered-400 border border-tampered-500/40 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Tampered / Altered File</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">Does Not Match Registered Document</h3>
                    <p className="text-xs text-tampered-300">
                      WARNING: Content in the uploaded file differs from the original registered fingerprint.
                    </p>
                  </div>
                </div>

                {/* Side-by-Side Hash Mismatch Display */}
                <div className="bg-navy-950/90 rounded-2xl p-5 border border-tampered-500/30 space-y-4 font-mono text-xs">
                  <div className="text-tampered-400 font-bold uppercase tracking-wider text-[11px]">
                    Cryptographic Hash Mismatch Visualizer
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-700 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase">Chain Stored Original Hash</span>
                      <div className="text-slate-300 font-mono break-all">
                        {verifyResult.storedHash}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-navy-900 border border-tampered-500/50 space-y-1">
                      <span className="text-tampered-400 text-[10px] uppercase font-bold">Uploaded File Computed Hash</span>
                      <div className="text-tampered-400 font-mono break-all font-bold">
                        {verifyResult.computedHash}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-tampered-500/10 border border-tampered-500/30 text-tampered-400 text-[11px]">
                    <strong>Detection Summary:</strong> SHA-256 hash output changed. One or more bytes, characters, or metadata fields in this file have been altered since registration.
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: DOCUMENT NOT FOUND RESULT (YELLOW/AMBER) */}
            {verifyResult.notFound && (
              <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/50 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-gold-500/20 text-gold-400">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Document Record Not Found</h3>
                    <p className="text-xs text-slate-300">
                      No document matching docId <code className="text-gold-400 font-mono">{verifyResult.docId}</code> was found in the vault registry.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Please verify the selected Document ID from the registry or register this document first.
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto glass-panel p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400 mx-auto" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
