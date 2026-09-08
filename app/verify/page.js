'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  FileCheck,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Loader2,
  Download,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

function VerifyForm() {
  const searchParams = useSearchParams();
  const initialDocId = searchParams.get('docId') || '';

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  // Fetch all registered documents for dropdown
  useEffect(() => {
    async function loadDocs() {
      setDocsLoading(true);

      try {
        const res = await fetch('/api/documents');
        const data = await res.json();

        if (res.ok && data.success) {
          setDocuments(data.documents || []);

          // If initialDocId wasn't passed, default to first document
          if (
            !initialDocId &&
            data.documents &&
            data.documents.length > 0
          ) {
            setSelectedDocId(data.documents[0].docId);
          }
        }
      } catch (err) {
        console.error(
          'Failed to load documents dropdown:',
          err
        );
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setVerifyResult(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0]
    ) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
      setVerifyResult(null);
    }
  };

  const handleVerify = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedDocId || !selectedFile) {
      return;
    }

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
        throw new Error(
          data.error ||
            'Server error during verification.'
        );
      }

      setVerifyResult(data);

      // Trigger celebration confetti if authentic
      if (data.match && !data.notFound) {
        confetti({
          particleCount: 60,
          spread: 65,
          origin: { y: 0.6 },
          colors: [
            '#0F766E',
            '#15803D',
            '#B45309',
          ],
        });
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Verification failed. Please check inputs.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const selectedDocMeta = documents.find(
    (d) => d.docId === selectedDocId
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200">
          <FileCheck className="w-3.5 h-3.5" />

          <span>
            Step 2: Cryptographic Verification
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify Document Authenticity
        </h1>

        <p className="text-sm text-slate-500">
          Compare any file against its registered
          SHA-256 fingerprint on the chain seam to
          verify integrity or detect byte tampering.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8">
        <form
          onSubmit={handleVerify}
          className="space-y-6"
        >
          {/* Document Target Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
              1. Select Target Registered Record (docId)
            </label>

            {docsLoading ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />

                <span>
                  Loading registered documents
                  registry...
                </span>
              </div>
            ) : (
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setVerifyResult(null);
                }}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              >
                <option value="" disabled>
                  -- Select a Registered Document --
                </option>

                {documents.map((doc) => (
                  <option
                    key={doc.docId}
                    value={doc.docId}
                  >
                    {doc.filename} (
                    {doc.docId.slice(0, 16)}
                    ...)
                  </option>
                ))}
              </select>
            )}

            {selectedDocMeta && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 font-mono">
                <span>
                  Stored Hash:{' '}
                  <span className="text-amber-800">
                    {selectedDocMeta.hash.slice(0, 16)}
                    ...
                    {selectedDocMeta.hash.slice(-16)}
                  </span>
                </span>

                <span>
                  Registered:{' '}
                  {new Date(
                    selectedDocMeta.registeredAt
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Test File Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                2. Upload File to Test / Check
              </label>

              {/* Demo Helper Sample File Buttons */}
              <div className="flex items-center gap-2 text-[11px]">
                {/* Authentic Sample */}
                <a
                  href={`/api/samples?docId=${encodeURIComponent(
                    selectedDocId || ''
                  )}&tampered=false`}
                  download
                  className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 transition-colors"
                  title="Download authentic original document to verify match"
                >
                  <Download className="w-3 h-3" />

                  <span>
                    Download Authentic Sample
                  </span>
                </a>

                {/* Tampered Sample */}
                <a
                  href={`/api/samples?docId=${encodeURIComponent(
                    selectedDocId || ''
                  )}&tampered=true`}
                  download
                  className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 transition-colors"
                  title="Download tampered document to test tamper detection"
                >
                  <Download className="w-3 h-3" />

                  <span>
                    Download Tampered Sample
                  </span>
                </a>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                selectedFile
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-slate-300 hover:border-amber-300 bg-slate-50'
              }`}
            >
              <input
                type="file"
                id="verify-file"
                onChange={handleFileChange}
                className="hidden"
              />

              <label
                htmlFor="verify-file"
                className="cursor-pointer block space-y-2"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-amber-700">
                  <UploadCloud className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-amber-800 font-mono">
                      {(
                        selectedFile.size / 1024
                      ).toFixed(1)}{' '}
                      KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Choose file to verify against
                      selected record
                    </p>

                    <p className="text-xs text-slate-500">
                      Upload the original file or a
                      suspected altered copy
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Inline Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />

              <span>{error}</span>
            </div>
          )}

          {/* Check Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={
                !selectedDocId ||
                !selectedFile ||
                loading
              }
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                !selectedDocId ||
                !selectedFile ||
                loading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'gold-gradient-btn text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />

                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-white" />

                  <span>
                    Check Authenticity
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Verification Results */}
        {verifyResult && (
          <div className="space-y-6">
            {/* AUTHENTIC RESULT */}
            {verifyResult.match &&
              !verifyResult.notFound && (
                <div className="glass-panel-emerald rounded-3xl p-6 sm:p-8 border border-emerald-200 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                      <ShieldCheck className="w-10 h-10" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />

                        <span>
                          Authentic & Unmodified
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-slate-900">
                        Matches Registered Document
                      </h3>

                      <p className="text-xs text-emerald-700">
                        The SHA-256 fingerprint of the
                        uploaded file strictly matches
                        the chain registry record.
                      </p>
                    </div>
                  </div>

                  {/* Hash Comparison */}
                  <div className="bg-white rounded-2xl p-5 border border-emerald-200 space-y-4 font-mono text-xs">
                    <div className="text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                      Side-by-Side Hash Transparency Check
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-emerald-200 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase">
                          Chain Stored Hash
                        </span>

                        <div className="text-emerald-800 font-mono break-all font-semibold">
                          {verifyResult.storedHash}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-emerald-200 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase">
                          Uploaded File Computed Hash
                        </span>

                        <div className="text-emerald-800 font-mono break-all font-semibold">
                          {verifyResult.computedHash}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                      <span>
                        Result Status:{' '}
                        <strong>
                          100% Cryptographic Match
                        </strong>
                      </span>

                      <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                        Zero Bit Difference
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* TAMPERED RESULT */}
            {!verifyResult.match &&
              !verifyResult.notFound && (
                <div className="glass-panel-crimson rounded-3xl p-6 sm:p-8 border border-red-200 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                      <ShieldAlert className="w-10 h-10" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />

                        <span>
                          Tampered / Altered File
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-slate-900">
                        Does Not Match Registered
                        Document
                      </h3>

                      <p className="text-xs text-red-700">
                        WARNING: Content in the uploaded
                        file differs from the original
                        registered fingerprint.
                      </p>
                    </div>
                  </div>

                  {/* Hash Mismatch */}
                  <div className="bg-white rounded-2xl p-5 border border-red-200 space-y-4 font-mono text-xs">
                    <div className="text-red-800 font-bold uppercase tracking-wider text-[11px]">
                      Cryptographic Hash Mismatch Visualizer
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase">
                          Chain Stored Original Hash
                        </span>

                        <div className="text-slate-600 font-mono break-all">
                          {verifyResult.storedHash}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-red-200 space-y-1">
                        <span className="text-red-700 text-[10px] uppercase font-bold">
                          Uploaded File Computed Hash
                        </span>

                        <div className="text-red-800 font-mono break-all font-bold">
                          {verifyResult.computedHash}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px]">
                      <strong>
                        Detection Summary:
                      </strong>{' '}
                      SHA-256 hash output changed. One or
                      more bytes, characters, or metadata
                      fields in this file have been
                      altered since registration.
                    </div>
                  </div>
                </div>
              )}

            {/* DOCUMENT NOT FOUND */}
            {verifyResult.notFound && (
              <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-800">
                    <HelpCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Document Record Not Found
                    </h3>

                    <p className="text-xs text-slate-600">
                      No document matching docId{' '}
                      <code className="text-amber-800 font-mono">
                        {verifyResult.docId}
                      </code>{' '}
                      was found in the vault registry.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed">
                  Please verify the selected Document ID
                  from the registry or register this
                  document first.
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
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto glass-panel p-12 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700 mx-auto" />
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
