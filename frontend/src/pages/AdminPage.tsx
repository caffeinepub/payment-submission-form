import React from "react";
import { useGetAllPayments } from "../hooks/useQueries";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Loader2, CreditCard, Users, DollarSign, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageProps {
  onNavigateToPayment: () => void;
}

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "");
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export default function AdminPage({ onNavigateToPayment }: AdminPageProps) {
  const { actor, isFetching: isActorFetching } = useActor();
  // Derive actorReady from the values useActor actually returns
  const actorReady = !!actor && !isActorFetching;

  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: payments,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    failureCount,
  } = useGetAllPayments();

  const totalAmount =
    payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

  // Show spinner while actor is initializing or query is loading/retrying
  const showSpinner = !actorReady || isLoading || (isFetching && !payments);

  // Show error only after all retries are exhausted (not while still loading/retrying)
  const showError =
    isError && !isLoading && !isFetching && actorReady && isAuthenticated;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Payment Records</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToPayment}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Payment Form
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold text-foreground">
                  {showSpinner ? (
                    <Skeleton className="h-7 w-12 inline-block" />
                  ) : (
                    payments?.length ?? 0
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  {showSpinner ? (
                    <Skeleton className="h-7 w-20 inline-block" />
                  ) : (
                    `$${totalAmount.toLocaleString()}`
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-amber" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Payment Records
            </h2>
            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {failureCount > 0
                    ? `Retrying… (attempt ${failureCount + 1})`
                    : "Refreshing…"}
                </span>
              </div>
            )}
          </div>

          {showSpinner ? (
            <div className="p-8">
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-amber" />
                <p className="text-sm text-muted-foreground">
                  {!actorReady
                    ? "Connecting to service…"
                    : "Loading payment records…"}
                </p>
              </div>
              <div className="space-y-3 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ) : showError ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Failed to load payments
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : payments && payments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No payments yet
              </p>
              <p className="text-xs text-muted-foreground">
                Payment records will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-foreground">
                      Full Name
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Address
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Card Number
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Expiry
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">
                        {payment.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {payment.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">
                        {payment.address}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-foreground bg-muted/40 px-2 py-0.5 rounded">
                          {maskCardNumber(payment.cardNumber)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {payment.expiryDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-foreground">
                          ${Number(payment.amount).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Built with{" "}
          <span className="text-amber">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
