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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-amber-200">
            <Shield className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                eVault
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded bg-amber-50 text-amber-800 border border-amber-200">
                MVP Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Blockchain Legal Verification Seam
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-700 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 py-2 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[11px] py-1 px-3 rounded-lg ${
                isActive ? 'text-amber-700 font-bold' : 'text-slate-500 hover:text-slate-700'
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
