'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Files,
  FileCheck,
  FilePlus,
  Copy,
  Check,
  Search,
  Lock,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function DocumentsRegistryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (res.ok && data.success) {
        setDocuments(data.documents || []);
      } else {
        throw new Error(data.error || 'Failed to fetch registry.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.filename.toLowerCase().includes(query) ||
      doc.docId.toLowerCase().includes(query) ||
      doc.hash.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gold-500/10 text-gold-400 border border-gold-500/30">
            <Files className="w-3.5 h-3.5" />
            <span>Immutable Registry Index</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Registered Documents</h1>
          <p className="text-sm text-slate-400">
            Browse all legal records cryptographically fingerprinted on the chain seam.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDocuments}
            className="p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 transition-colors border border-navy-700"
            title="Refresh registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/upload"
            className="px-5 py-2.5 rounded-xl font-extrabold text-xs gold-gradient-btn text-navy-950 flex items-center gap-2 shadow-lg"
          >
            <FilePlus className="w-4 h-4 text-navy-950" />
            <span>Register New Document</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Control */}
      <div className="glass-panel p-4 rounded-2xl border border-navy-700 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by filename, docId, or SHA-256 hash..."
          className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-slate-500 font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-navy-800 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass-panel rounded-3xl p-12 border border-navy-700 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-mono">Reading chain seam registry records...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-6 rounded-2xl bg-tampered-900/40 border border-tampered-500/40 text-tampered-500 text-sm space-y-3">
          <p className="font-bold">Failed to load registry documents</p>
          <p className="text-xs text-slate-300">{error}</p>
          <button
            onClick={fetchDocuments}
            className="px-4 py-2 rounded-lg bg-navy-800 text-white font-medium text-xs border border-navy-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State (§6.3 Requirement) */}
      {!loading && !error && filteredDocs.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 border border-navy-700 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mx-auto text-gold-400">
            <Files className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">No documents registered yet</h3>
            <p className="text-sm text-slate-400">
              {searchQuery
                ? `No documents matched your filter "${searchQuery}".`
                : 'The cryptographic vault is currently empty. Register your first legal document to begin.'}
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm gold-gradient-btn text-navy-950"
          >
            <FilePlus className="w-4 h-4 text-navy-950" />
            <span>Register First Document</span>
          </Link>
        </div>
      )}

      {/* Registry Document Table / Cards */}
      {!loading && !error && filteredDocs.length > 0 && (
        <div className="glass-panel rounded-3xl border border-navy-700 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900/90 text-slate-400 font-mono uppercase tracking-wider border-b border-navy-700">
                <tr>
                  <th className="px-6 py-4">Document / Filename</th>
                  <th className="px-6 py-4">Document ID (docId)</th>
                  <th className="px-6 py-4">SHA-256 Hash Digest</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800 text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr key={doc.docId} className="hover:bg-navy-850/60 transition-colors group">
                    {/* Filename & Size */}
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm text-white group-hover:text-gold-300 transition-colors">
                            {doc.filename}
                          </div>
                          {doc.fileSize > 0 && (
                            <div className="text-[11px] text-slate-400 font-mono font-normal">
                              {(doc.fileSize / 1024).toFixed(1)} KB
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Copyable DocId */}
                    <td className="px-6 py-4 font-mono text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[140px]" title={doc.docId}>
                          {doc.docId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(doc.docId, `docId-${doc.docId}`)}
                          className="p-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
                          title="Copy docId"
                        >
                          {copiedId === `docId-${doc.docId}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Truncated SHA-256 Hash */}
                    <td className="px-6 py-4 font-mono text-gold-400">
                      <div className="flex items-center gap-2">
                        <span title={doc.hash}>
                          {doc.hash.slice(0, 10)}...{doc.hash.slice(-10)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(doc.hash, `hash-${doc.docId}`)}
                          className="p-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
                          title="Copy full SHA-256 hash"
                        >
                          {copiedId === `hash-${doc.docId}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(doc.registeredAt).toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Verify Shortcut (§6.3 Requirement) */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/verify?docId=${encodeURIComponent(doc.docId)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-gold-500 text-slate-200 hover:text-navy-950 font-bold text-xs transition-colors border border-navy-700"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Verify This File</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
