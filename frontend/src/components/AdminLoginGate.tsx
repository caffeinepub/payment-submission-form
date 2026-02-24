import { Lock, ShieldAlert } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AdminLoginGate() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Decorative gradient top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" aria-hidden="true" />

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
            </div>
            <span className="font-bold text-neutral-900 text-lg tracking-tight">PaySecure</span>
          </div>
        </div>
      </header>

      {/* Centered login gate */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="payment-card w-full max-w-md p-8 sm:p-10 flex flex-col items-center text-center">
          {/* Lock icon */}
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 shadow-sm">
            <img
              src="/assets/generated/secure-lock-icon.dim_128x128.png"
              alt="Secure lock"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback to lucide icon if image fails
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex');
              }}
            />
            <span className="hidden items-center justify-center">
              <Lock size={28} className="text-amber-500" />
            </span>
          </div>

          {/* Heading */}
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-amber-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Restricted Access</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-3">
            Admin Panel
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-xs">
            This area is restricted to authorized administrators only. Please log in with your Internet Identity to continue.
          </p>

          {/* Login button */}
          <button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="btn-gold w-full py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2"
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

          <p className="mt-5 text-xs text-neutral-400">
            Secure authentication powered by the Internet Computer
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} PaySecure. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 mx-0.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'payment-submission-form')}`}
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
