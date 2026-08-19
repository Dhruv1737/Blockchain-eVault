'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FilePlus,
  UploadCloud,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  FileCheck,
  AlertCircle,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function RegisterDocumentPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredResult, setRegisteredResult] = useState(null);
  const [copiedDocId, setCopiedDocId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showFullHash, setShowFullHash] = useState(false);

  // File selection handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        setError('File size exceeds maximum allowed demo limit of 20MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setRegisteredResult(null);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 20 * 1024 * 1024) {
        setError('File size exceeds maximum allowed demo limit of 20MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setRegisteredResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setRegisteredResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register document.');
      }

      setRegisteredResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
      // NOTE: selectedFile is intentionally retained per §6.2 PRD requirements
    } finally {
      setLoading(false);
    }
  };

  // Copy helpers
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'docId') {
      setCopiedDocId(true);
      setTimeout(() => setCopiedDocId(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gold-500/10 text-gold-400 border border-gold-500/30">
          <FilePlus className="w-3.5 h-3.5" />
          <span>Step 1: Cryptographic Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Register Legal Document</h1>
        <p className="text-sm text-slate-400">
          Upload any legal contract, deed, or record to generate and store its immutable SHA-256 fingerprint on the chain seam.
        </p>
      </div>

      {/* Main Registration Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-navy-700 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Drag and Drop Box */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              selectedFile
                ? 'border-gold-500/60 bg-gold-500/5'
                : 'border-navy-600 hover:border-gold-500/40 bg-navy-900/40'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label htmlFor="file-upload" className="cursor-pointer space-y-4 block">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-600 flex items-center justify-center mx-auto text-gold-400 shadow-lg">
                <UploadCloud className="w-8 h-8" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">{selectedFile.name}</p>
                  <p className="text-xs text-gold-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; {selectedFile.type || 'Binary / PDF / Doc'}
                  </p>
                  <span className="inline-block mt-2 text-xs text-slate-400 underline">Click or drop to replace file</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-base font-semibold text-slate-200">
                    Click to select file or drag & drop here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports PDF, DOCX, TXT, Images & Legal Records (Up to 20MB)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-tampered-900/40 border border-tampered-500/40 text-tampered-500 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span>Only 256-bit hash fingerprint is stored</span>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                !selectedFile || loading
                  ? 'bg-navy-800 text-slate-500 cursor-not-allowed border border-navy-700'
                  : 'gold-gradient-btn text-navy-950 shadow-lg shadow-gold-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-navy-950" />
                  <span>Hashing & registering...</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-5 h-5 text-navy-950" />
                  <span>Register Document</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Registration Success Container (§6.2 Requirement) */}
        {registeredResult && (
          <div className="glass-panel-emerald rounded-2xl p-6 border border-emerald-500/40 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Document Registered Successfully</h3>
                  <p className="text-xs text-emerald-300 font-mono">Immutable Fingerprint Written to Seam</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {registeredResult.adapterMode === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Chain Seam'}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Document ID */}
              <div className="space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Document ID (docId)</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-white">
                  <span className="font-semibold text-emerald-300 select-all">{registeredResult.docId}</span>
                  <button
                    onClick={() => copyToClipboard(registeredResult.docId, 'docId')}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 transition-colors"
                  >
                    {copiedDocId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDocId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Filename */}
              <div className="space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Filename Label</span>
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-700 text-slate-200">
                  {registeredResult.filename}
                </div>
              </div>

              {/* Computed SHA-256 Hash */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">SHA-256 Hash Digest</span>
                  <button
                    onClick={() => setShowFullHash(!showFullHash)}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {showFullHash ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showFullHash ? 'Truncate' : 'Expand Full'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-emerald-400 break-all font-mono">
                  <span>
                    {showFullHash
                      ? registeredResult.hash
                      : `${registeredResult.hash.slice(0, 16)}...${registeredResult.hash.slice(-16)}`}
                  </span>
                  <button
                    onClick={() => copyToClipboard(registeredResult.hash, 'hash')}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 transition-colors ml-2 flex-shrink-0"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Next Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/20">
              <Link
                href={`/verify?docId=${encodeURIComponent(registeredResult.docId)}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>Verify this Document Now</span>
              </Link>

              <Link
                href="/documents"
                className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>View All Documents in Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
