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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200">
          <FilePlus className="w-3.5 h-3.5" />
          <span>Step 1: Cryptographic Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Register Legal Document</h1>
        <p className="text-sm text-slate-500">
          Upload any legal contract, deed, or record to generate and store its immutable SHA-256 fingerprint on the chain seam.
        </p>
      </div>

      {/* Main Registration Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Drag and Drop Box */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              selectedFile
                ? 'border-amber-300 bg-amber-50/40'
                : 'border-slate-300 hover:border-amber-300 bg-slate-50'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />

            <label htmlFor="file-upload" className="cursor-pointer space-y-4 block">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-amber-700">
                <UploadCloud className="w-8 h-8" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-amber-800 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; {selectedFile.type || 'Binary / PDF / Doc'}
                  </p>
                  <span className="inline-block mt-2 text-xs text-slate-500 underline">Click or drop to replace file</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-base font-semibold text-slate-700">
                    Click to select file or drag & drop here
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports PDF, DOCX, TXT, Images & Legal Records (Up to 20MB)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Only 256-bit hash fingerprint is stored</span>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                !selectedFile || loading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'gold-gradient-btn text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Hashing & registering...</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-5 h-5 text-white" />
                  <span>Register Document</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Registration Success Container (§6.2 Requirement) */}
        {registeredResult && (
          <div className="glass-panel-emerald rounded-2xl p-6 border border-emerald-200 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Document Registered Successfully</h3>
                  <p className="text-xs text-emerald-700 font-mono">Immutable Fingerprint Written to Seam</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                {registeredResult.adapterMode === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Chain Seam'}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Document ID */}
              <div className="space-y-1">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Document ID (docId)</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-200 text-slate-900">
                  <span className="font-semibold text-emerald-800 select-all">{registeredResult.docId}</span>
                  <button
                    onClick={() => copyToClipboard(registeredResult.docId, 'docId')}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    {copiedDocId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDocId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Filename */}
              <div className="space-y-1">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Filename Label</span>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700">
                  {registeredResult.filename}
                </div>
              </div>

              {/* Computed SHA-256 Hash */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px]">SHA-256 Hash Digest</span>
                  <button
                    onClick={() => setShowFullHash(!showFullHash)}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    {showFullHash ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showFullHash ? 'Truncate' : 'Expand Full'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-200 text-emerald-800 break-all font-mono">
                  <span>
                    {showFullHash
                      ? registeredResult.hash
                      : `${registeredResult.hash.slice(0, 16)}...${registeredResult.hash.slice(-16)}`}
                  </span>
                  <button
                    onClick={() => copyToClipboard(registeredResult.hash, 'hash')}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors ml-2 flex-shrink-0"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Next Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100">
              <Link
                href={`/verify?docId=${encodeURIComponent(registeredResult.docId)}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>Verify this Document Now</span>
              </Link>

              <Link
                href="/documents"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
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
