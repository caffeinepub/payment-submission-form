import { useGetAllPayments } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import AdminLoginGate from '../components/AdminLoginGate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

export default function AdminPage({ onBack }: AdminPageProps) {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { isFetching: isActorFetching } = useActor();
  const { data: payments, isLoading, isError, refetch, isFetching } = useGetAllPayments();

  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'payment-submission-form');

  // Show spinner while identity is being restored from storage
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm text-neutral-500">Loading…</span>
        </div>
      </div>
    );
  }

  // Show login gate if not authenticated
  if (!identity) {
    return <AdminLoginGate />;
  }

  // Show spinner while the authenticated actor is being initialized after login
  if (isActorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm text-neutral-500">Connecting to admin panel…</span>
        </div>
      </div>
    );
  }

  const principal = identity.getPrincipal().toString();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Decorative gradient top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" aria-hidden="true" />

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: logo + badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
            </div>
            <span className="font-bold text-neutral-900 text-lg tracking-tight">PaySecure</span>
            <Badge variant="secondary" className="ml-1 text-xs bg-amber-100 text-amber-700 border-amber-200 flex-shrink-0">
              Admin
            </Badge>
          </div>

          {/* Right: principal + actions */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Principal display */}
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-1.5 min-w-0">
              <User size={13} className="text-neutral-400 flex-shrink-0" />
              <span
                className="text-xs font-mono text-neutral-600 truncate max-w-[120px]"
                title={principal}
              >
                {truncatePrincipal(principal)}
              </span>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-amber-600 transition-colors font-medium flex-shrink-0"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Logout button */}
            <button
              onClick={() => clear()}
              className="btn-gold flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg flex-shrink-0"
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
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Payment Submissions</h1>
              <p className="text-sm text-neutral-500 mt-0.5">
                Review all submitted payment records
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-amber-600 transition-colors font-medium disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Stats bar */}
          {!isLoading && !isError && payments && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 shadow-sm">
                <CreditCard size={16} className="text-amber-500" />
                <span className="text-sm font-semibold text-neutral-800">{payments.length}</span>
                <span className="text-sm text-neutral-500">total submission{payments.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}

          {/* Table card */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" x2="12" y1="8" y2="12"/>
                    <line x1="12" x2="12.01" y1="16" y2="16"/>
                  </svg>
                </div>
                <p className="text-neutral-700 font-medium">Failed to load payments</p>
                <p className="text-neutral-400 text-sm mt-1">Please try refreshing the page.</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : payments && payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                  <ShieldCheck size={22} className="text-amber-400" />
                </div>
                <p className="text-neutral-700 font-medium">No submissions yet</p>
                <p className="text-neutral-400 text-sm mt-1">Payment records will appear here once submitted.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                      <TableHead className="font-semibold text-neutral-600 text-xs uppercase tracking-wide">Full Name</TableHead>
                      <TableHead className="font-semibold text-neutral-600 text-xs uppercase tracking-wide">Email</TableHead>
                      <TableHead className="font-semibold text-neutral-600 text-xs uppercase tracking-wide">Address</TableHead>
                      <TableHead className="font-semibold text-neutral-600 text-xs uppercase tracking-wide">Card Number</TableHead>
                      <TableHead className="font-semibold text-neutral-600 text-xs uppercase tracking-wide">Expiry</TableHead>
                      <TableHead className="font-semibold text-neutral-600 text-xs uppercase tracking-wide text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment, index) => (
                      <TableRow key={index} className="hover:bg-amber-50/40 transition-colors">
                        <TableCell className="font-medium text-neutral-900">{payment.fullName}</TableCell>
                        <TableCell className="text-neutral-600">{payment.email}</TableCell>
                        <TableCell className="text-neutral-600 max-w-[180px] truncate" title={payment.address}>
                          {payment.address}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                            {maskCardNumber(payment.cardNumber)}
                          </span>
                        </TableCell>
                        <TableCell className="text-neutral-600">{payment.expiryDate}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-sm">
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
