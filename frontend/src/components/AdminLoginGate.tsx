import { Lock, ShieldAlert } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AdminLoginGate() {
  const { login, isLoggingIn } = useInternetIdentity();

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
        style={{
          background: 'oklch(1 0 0)',
          borderBottom: '1px solid oklch(0.92 0.006 60)',
          boxShadow: '0 1px 4px oklch(0.14 0.004 60 / 0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
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
        </div>
      </header>

      {/* Centered login gate */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-md p-8 sm:p-10 flex flex-col items-center text-center rounded-2xl"
          style={{
            background: 'oklch(1 0 0)',
            border: '1px solid oklch(0.92 0.006 60)',
            boxShadow: '0 4px 24px oklch(0.14 0.004 60 / 0.08), 0 1px 4px oklch(0.14 0.004 60 / 0.05)',
          }}
        >
          {/* Lock icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: 'oklch(0.72 0.17 72 / 0.08)',
              border: '1px solid oklch(0.72 0.17 72 / 0.25)',
            }}
          >
            <Lock size={32} style={{ color: 'oklch(0.62 0.16 70)' }} />
          </div>

          {/* Heading */}
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} style={{ color: 'oklch(0.62 0.16 70)' }} className="flex-shrink-0" />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'oklch(0.62 0.16 70)' }}
            >
              Restricted Access
            </span>
          </div>

          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: 'oklch(0.18 0.005 60)' }}
          >
            Admin Panel
          </h1>

          <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'oklch(0.55 0.010 60)' }}>
            This area is restricted to authorized administrators only. Please log in with your Internet Identity to continue.
          </p>

          {/* Login button */}
          <button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="btn-primary w-full py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 font-semibold"
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Connecting…
              </>
            ) : (
              <>
                <Lock size={15} />
                Login with Internet Identity
              </>
            )}
          </button>

          <p className="mt-5 text-xs" style={{ color: 'oklch(0.65 0.008 60)' }}>
            Secure authentication · Internet Computer
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid oklch(0.92 0.006 60)', background: 'oklch(1 0 0)' }}>
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: 'oklch(0.56 0.008 60)' }}
        >
          <span>© {new Date().getFullYear()} PaySecure. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mx-0.5" style={{ color: 'oklch(0.72 0.17 72)' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'payment-submission-form')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors"
              style={{ color: 'oklch(0.62 0.16 70)' }}
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
