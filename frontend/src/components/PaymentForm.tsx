import React, { useState } from "react";
import { useSubmitPayment } from "../hooks/useQueries";
import { usePaymentForm } from "../hooks/usePaymentForm";
import { CheckCircle, Loader2, CreditCard, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentFormData } from "../hooks/usePaymentForm";

export default function PaymentForm() {
  const { mutateAsync, isPending, actorReady } = useSubmitPayment();

  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    getSubmitData,
  } = usePaymentForm();

  // Adapter: converts a native input change event to the (name, value) signature used by usePaymentForm
  const makeChangeHandler = (name: keyof PaymentFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => handleChange(name, e.target.value);

  // Adapter: converts a native blur event to the (name) signature used by usePaymentForm
  const makeBlurHandler = (name: keyof PaymentFormData) =>
    () => handleBlur(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateAll()) return;

    try {
      const data = getSubmitData();
      await mutateAsync(data);
      setSuccess(true);
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Payment submission failed. Please try again.";
      // Don't surface transient "not ready" errors — user sees spinner instead
      if (!message.toLowerCase().includes("not ready")) {
        setSubmitError(message);
      }
    }
  };

  if (success) {
    return (
      <div className="payment-card text-center py-12 px-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Payment Submitted!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Your payment has been securely processed and recorded.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          className="btn-primary"
        >
          Submit Another Payment
        </Button>
      </div>
    );
  }

  const isSubmitDisabled = !actorReady || isPending;

  return (
    <form onSubmit={handleSubmit} className="payment-card space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-amber flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Secure Payment</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Actor not ready banner */}
      {!actorReady && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>Connecting to payment service…</span>
        </div>
      )}

      {/* Error */}
      {submitError && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Personal Info */}
      <div className="space-y-4">
        <p className="section-label">Personal Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Jane Smith"
              value={formData.fullName}
              onChange={makeChangeHandler('fullName')}
              onBlur={makeBlurHandler('fullName')}
              autoComplete="name"
              className={`payment-input ${errors.fullName ? "border-red-400" : ""}`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={makeChangeHandler('email')}
              onBlur={makeBlurHandler('email')}
              autoComplete="email"
              className={`payment-input ${errors.email ? "border-red-400" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-sm font-medium text-foreground">
            Billing Address
          </Label>
          <Input
            id="address"
            placeholder="123 Main St, City, State 12345"
            value={formData.address}
            onChange={makeChangeHandler('address')}
            onBlur={makeBlurHandler('address')}
            autoComplete="street-address"
            className={`payment-input ${errors.address ? "border-red-400" : ""}`}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="space-y-4">
        <p className="section-label">Card Details</p>
        <div className="space-y-1.5">
          <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
            Card Number
          </Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={makeChangeHandler('cardNumber')}
            onBlur={makeBlurHandler('cardNumber')}
            maxLength={19}
            inputMode="numeric"
            autoComplete="cc-number"
            className={`payment-input-mono ${errors.cardNumber ? "border-red-400" : ""}`}
          />
          {errors.cardNumber && (
            <p className="text-xs text-red-500">{errors.cardNumber}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
              Expiry Date
            </Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={makeChangeHandler('expiryDate')}
              onBlur={makeBlurHandler('expiryDate')}
              maxLength={5}
              inputMode="numeric"
              autoComplete="cc-exp"
              className={`payment-input-mono ${errors.expiryDate ? "border-red-400" : ""}`}
            />
            {errors.expiryDate && (
              <p className="text-xs text-red-500">{errors.expiryDate}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cvv" className="text-sm font-medium text-foreground">
              CVV
            </Label>
            <Input
              id="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={makeChangeHandler('cvv')}
              onBlur={makeBlurHandler('cvv')}
              maxLength={4}
              inputMode="numeric"
              autoComplete="cc-csc"
              className={`payment-input-mono ${errors.cvv ? "border-red-400" : ""}`}
            />
            {errors.cvv && (
              <p className="text-xs text-red-500">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <Label htmlFor="amount" className="text-sm font-medium text-foreground">
          Amount (USD)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            $
          </span>
          <Input
            id="amount"
            placeholder="0.00"
            inputMode="decimal"
            value={formData.amount}
            onChange={makeChangeHandler('amount')}
            onBlur={makeBlurHandler('amount')}
            className={`payment-input pl-7 ${errors.amount ? "border-red-400" : ""}`}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* Processing indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>Processing your payment securely…</span>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitDisabled}
        className="btn-primary w-full"
      >
        {!actorReady ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Connecting…
          </>
        ) : isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Submit Payment
          </>
        )}
      </Button>
    </form>
  );
}
