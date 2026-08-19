'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileCheck, FilePlus, Files, Scale } from 'lucide-react';
import SeamBadge from './SeamBadge';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Scale },
    { href: '/upload', label: 'Register Document', icon: FilePlus },
    { href: '/documents', label: 'Documents Registry', icon: Files },
    { href: '/verify', label: 'Verify Authenticity', icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-navy-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/40 shadow-lg group-hover:border-gold-400 group-hover:shadow-gold-500/20 transition-all">
            <Shield className="w-6 h-6 text-gold-400 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-gold-300 transition-colors">
                eVault
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                MVP Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Blockchain Legal Verification Seam
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-navy-900/80 p-1.5 rounded-xl border border-navy-700">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-950' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side Seam Badge & CTAs */}
        <div className="flex items-center gap-3">
          <SeamBadge adapterMode="mongodb" />
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-navy-900 border-t border-navy-800 py-2 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[11px] py-1 px-3 rounded-lg ${
                isActive ? 'text-gold-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
