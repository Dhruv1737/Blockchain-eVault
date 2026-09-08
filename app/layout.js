import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'eVault — Immutable Legal Records Verification Vault',
  description: 'Cryptographic SHA-256 fingerprinting for legal records. Register documents, verify authenticity, and detect tampering with zero privacy loss.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 bg-grid-pattern antialiased selection:bg-amber-100 selection:text-slate-900">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
