import PaymentForm from '../components/PaymentForm';
import { LayoutDashboard } from 'lucide-react';

interface PaymentPageProps {
  onNavigateAdmin?: () => void;
}

export default function PaymentPage({ onNavigateAdmin }: PaymentPageProps) {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'payment-submission-form');

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Subtle decorative gradient top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" aria-hidden="true" />

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
            </div>
            <span className="font-bold text-neutral-900 text-lg tracking-tight">PaySecure</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Secure &amp; Encrypted</span>
            </div>
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-amber-600 transition-colors font-medium border border-neutral-200 hover:border-amber-300 rounded-lg px-3 py-1.5"
              >
                <LayoutDashboard size={14} />
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {['256-bit SSL', 'PCI Compliant', 'Secure Checkout'].map(badge => (
              <div key={badge} className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {badge}
              </div>
            ))}
          </div>

          <PaymentForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <span>© {year} PaySecure. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 mx-0.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-600 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
