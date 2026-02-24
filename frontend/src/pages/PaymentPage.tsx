import PaymentForm from '../components/PaymentForm';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

interface PaymentPageProps {
  onNavigateAdmin?: () => void;
}

export default function PaymentPage({ onNavigateAdmin }: PaymentPageProps) {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'payment-submission-form');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.970 0.004 60)' }}>
      {/* Amber accent top bar */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, oklch(0.72 0.17 72), oklch(0.82 0.16 75), oklch(0.72 0.17 72))' }}
        aria-hidden="true"
      />

      {/* Header */}
      <header
        className="sticky top-0 z-10"
        style={{
          background: 'oklch(1 0 0)',
          borderBottom: '1px solid oklch(0.92 0.006 60)',
          boxShadow: '0 1px 4px oklch(0.14 0.004 60 / 0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'oklch(0.72 0.17 72)',
                boxShadow: '0 2px 8px oklch(0.72 0.17 72 / 0.30)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: 'oklch(0.18 0.005 60)' }}
            >
              PaySecure
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium" style={{ color: 'oklch(0.55 0.010 60)' }}>
              <ShieldCheck size={14} style={{ color: 'oklch(0.72 0.17 72)' }} />
              SSL Secured
            </div>
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg"
                style={{
                  color: 'oklch(0.42 0.008 60)',
                  border: '1px solid oklch(0.88 0.008 60)',
                  background: 'oklch(0.985 0.002 60)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.62 0.16 70)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.72 0.17 72 / 0.5)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.72 0.17 72 / 0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.42 0.008 60)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.88 0.008 60)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.985 0.002 60)';
                }}
              >
                <LayoutDashboard size={14} />
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Hero section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.18 0.005 60)' }}>
              Secure Payment
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.55 0.010 60)' }}>
              Your payment information is encrypted and protected
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
            {[
              { label: '256-bit SSL', icon: '🔒' },
              { label: 'PCI Compliant', icon: '✓' },
              { label: 'Secure Checkout', icon: '🛡' },
            ].map(badge => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  color: 'oklch(0.52 0.014 68)',
                  background: 'oklch(0.72 0.17 72 / 0.08)',
                  border: '1px solid oklch(0.72 0.17 72 / 0.20)',
                }}
              >
                <span>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>

          <PaymentForm />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid oklch(0.92 0.006 60)', background: 'oklch(1 0 0)' }}>
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: 'oklch(0.56 0.008 60)' }}
        >
          <span>© {year} PaySecure. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mx-0.5" style={{ color: 'oklch(0.72 0.17 72)' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors"
              style={{ color: 'oklch(0.62 0.16 70)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.52 0.14 68)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.62 0.16 70)'; }}
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
