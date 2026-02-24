import { useEffect } from 'react';
import { useGetAllPayments } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import AdminLoginGate from '../components/AdminLoginGate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, ArrowLeft, RefreshCw, CreditCard, LogOut, User } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '');
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

function formatAmount(amount: bigint): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) / 100);
}

function truncatePrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 8)}…`;
}

function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.970 0.004 60)' }}>
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin w-8 h-8"
          style={{ color: 'oklch(0.72 0.17 72)' }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm font-medium" style={{ color: 'oklch(0.55 0.010 60)' }}>
          {message}
        </span>
      </div>
    </div>
  );
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();
  const {
    data: payments,
    isLoading,
    isError,
    refetch,
    isFetching,
    failureCount,
  } = useGetAllPayments();

  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'payment-submission-form');

  // When the user logs in (identity becomes available and actor is ready),
  // invalidate the payments query so it re-fetches with the authenticated actor.
  useEffect(() => {
    if (identity && !isActorFetching) {
      const principal = identity.getPrincipal().toString();
      queryClient.invalidateQueries({ queryKey: ['payments', principal] });
    }
  }, [identity, isActorFetching, queryClient]);

  // Show spinner while identity is being restored from storage
  if (isInitializing) {
    return <LoadingSpinner message="Loading…" />;
  }

  // Show login gate if not authenticated
  if (!identity) {
    return <AdminLoginGate />;
  }

  // Show spinner while the authenticated actor is being initialized after login
  if (isActorFetching) {
    return <LoadingSpinner message="Connecting to admin panel…" />;
  }

  const principal = identity.getPrincipal().toString();

  // With retry:3, React Query makes 1 initial attempt + 3 retries = 4 total attempts.
  // failureCount reaches 4 when all retries are exhausted.
  // Show error only after all retries are done (failureCount >= 4) and not currently fetching.
  const allRetriesExhausted = failureCount >= 4;
  const showError = isError && !isFetching && allRetriesExhausted;
  // Show loading skeleton while: initial load, actively fetching/retrying after error
  const showLoading = isLoading || isFetching || (isError && !allRetriesExhausted);

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: logo + badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
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
            <span
              className="ml-1 text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
              style={{
                background: 'oklch(0.72 0.17 72 / 0.12)',
                border: '1px solid oklch(0.72 0.17 72 / 0.30)',
                color: 'oklch(0.52 0.14 68)',
              }}
            >
              Admin
            </span>
          </div>

          {/* Right: principal + actions */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Principal display */}
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 min-w-0"
              style={{
                background: 'oklch(0.970 0.004 60)',
                border: '1px solid oklch(0.92 0.006 60)',
              }}
            >
              <User size={13} style={{ color: 'oklch(0.56 0.008 60)' }} className="flex-shrink-0" />
              <span
                className="text-xs truncate max-w-[120px] font-mono"
                style={{ color: 'oklch(0.42 0.008 60)' }}
                title={principal}
              >
                {truncatePrincipal(principal)}
              </span>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors flex-shrink-0"
              style={{ color: 'oklch(0.56 0.008 60)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.62 0.16 70)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.56 0.008 60)'; }}
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Logout button */}
            <button
              onClick={() => clear()}
              className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg flex-shrink-0"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Page heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: 'oklch(0.18 0.005 60)' }}
              >
                Payment Records
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'oklch(0.55 0.010 60)' }}>
                Review all submitted payment records
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ color: 'oklch(0.56 0.008 60)' }}
              onMouseEnter={e => { if (!isFetching) (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.62 0.16 70)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.56 0.008 60)'; }}
              title="Refresh"
            >
              <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Stats bar */}
          {!showLoading && !showError && payments && (
            <div className="flex items-center gap-2 mb-6">
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{
                  background: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.92 0.006 60)',
                  boxShadow: '0 1px 3px oklch(0.14 0.004 60 / 0.05)',
                }}
              >
                <CreditCard size={16} style={{ color: 'oklch(0.72 0.17 72)' }} />
                <span
                  className="text-sm font-bold"
                  style={{ color: 'oklch(0.18 0.005 60)' }}
                >
                  {payments.length}
                </span>
                <span className="text-sm" style={{ color: 'oklch(0.55 0.010 60)' }}>
                  total submission{payments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Table card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'oklch(1 0 0)',
              border: '1px solid oklch(0.92 0.006 60)',
              boxShadow: '0 2px 12px oklch(0.14 0.004 60 / 0.06)',
            }}
          >
            {showLoading ? (
              <div className="p-6 space-y-3">
                {/* Retrying indicator */}
                {isError && isFetching && (
                  <div
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 mb-2 text-xs font-medium"
                    style={{
                      background: 'oklch(0.72 0.17 72 / 0.06)',
                      border: '1px solid oklch(0.72 0.17 72 / 0.20)',
                      color: 'oklch(0.52 0.14 68)',
                    }}
                  >
                    <svg className="animate-spin w-3.5 h-3.5 flex-shrink-0" style={{ color: 'oklch(0.72 0.17 72)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Retrying… (attempt {failureCount + 1} of 4)
                  </div>
                )}
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-10 w-full rounded-lg"
                    style={{ background: 'oklch(0.940 0.006 60)' }}
                  />
                ))}
              </div>
            ) : showError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'oklch(0.97 0.04 25)', border: '1px solid oklch(0.85 0.12 25 / 0.4)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.20 25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" x2="12" y1="8" y2="12"/>
                    <line x1="12" x2="12.01" y1="16" y2="16"/>
                  </svg>
                </div>
                <p className="font-semibold" style={{ color: 'oklch(0.22 0.005 60)' }}>Failed to load payments</p>
                <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.010 60)' }}>Please try again.</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 text-sm font-semibold transition-colors"
                  style={{ color: 'oklch(0.62 0.16 70)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.52 0.14 68)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.62 0.16 70)'; }}
                >
                  Try again
                </button>
              </div>
            ) : payments && payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'oklch(0.72 0.17 72 / 0.08)', border: '1px solid oklch(0.72 0.17 72 / 0.25)' }}
                >
                  <ShieldCheck size={22} style={{ color: 'oklch(0.62 0.16 70)' }} />
                </div>
                <p className="font-semibold" style={{ color: 'oklch(0.22 0.005 60)' }}>No submissions yet</p>
                <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.010 60)' }}>Payment records will appear here once submitted.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{
                        background: 'oklch(0.985 0.002 60)',
                        borderBottom: '1px solid oklch(0.92 0.006 60)',
                      }}
                      className="hover:bg-transparent"
                    >
                      {['Full Name', 'Email', 'Address', 'Card Number', 'Expiry', 'Amount'].map(h => (
                        <TableHead
                          key={h}
                          className="text-xs uppercase tracking-wider font-semibold"
                          style={{ color: 'oklch(0.52 0.014 68)' }}
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment, index) => (
                      <TableRow
                        key={index}
                        style={{ borderBottom: '1px solid oklch(0.94 0.004 60)' }}
                        className="transition-colors"
                        onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'oklch(0.985 0.002 60)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                      >
                        <TableCell
                          className="font-medium"
                          style={{ color: 'oklch(0.22 0.005 60)' }}
                        >
                          {payment.fullName}
                        </TableCell>
                        <TableCell style={{ color: 'oklch(0.42 0.008 60)' }}>
                          {payment.email}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate"
                          style={{ color: 'oklch(0.42 0.008 60)' }}
                          title={payment.address}
                        >
                          {payment.address}
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-sm px-2 py-0.5 rounded-md font-mono"
                            style={{
                              color: 'oklch(0.52 0.14 68)',
                              background: 'oklch(0.72 0.17 72 / 0.08)',
                              border: '1px solid oklch(0.72 0.17 72 / 0.20)',
                            }}
                          >
                            {maskCardNumber(payment.cardNumber)}
                          </span>
                        </TableCell>
                        <TableCell
                          className="font-mono"
                          style={{ color: 'oklch(0.42 0.008 60)' }}
                        >
                          {payment.expiryDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className="font-bold px-2.5 py-0.5 rounded-full text-sm"
                            style={{
                              color: 'oklch(1 0 0)',
                              background: 'oklch(0.72 0.17 72)',
                            }}
                          >
                            {formatAmount(payment.amount)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
