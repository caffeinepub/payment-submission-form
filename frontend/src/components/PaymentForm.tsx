import { useState } from 'react';
import { CreditCard, User, MapPin, Mail, Calendar, Shield, DollarSign, CheckCircle, Lock, Loader2 } from 'lucide-react';
import { usePaymentForm } from '../hooks/usePaymentForm';
import { useSubmitPayment } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  error?: string;
  placeholder: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  onChange: (value: string) => void;
  onBlur: () => void;
  maxLength?: number;
  autoComplete?: string;
}

function FormField({
  id, label, icon, value, error, placeholder, type = 'text',
  inputMode, onChange, onBlur, maxLength, autoComplete
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold flex items-center gap-1.5"
        style={{ color: 'oklch(0.42 0.008 60)' }}
      >
        <span style={{ color: 'oklch(0.72 0.17 72)' }}>{icon}</span>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`payment-input ${error ? 'border-red-400 focus-visible:ring-red-400/20' : ''}`}
        />
      </div>
      {error && (
        <p className="text-xs flex items-center gap-1.5 mt-1" style={{ color: 'oklch(0.55 0.20 25)' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'oklch(0.55 0.20 25)' }} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function PaymentForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { formData, errors, handleChange, handleBlur, validateAll, resetForm, getSubmitData } = usePaymentForm();
  const submitMutation = useSubmitPayment();

  const { isActorReady } = submitMutation;
  const isSubmitDisabled = submitMutation.isPending || !isActorReady;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActorReady) return;
    if (!validateAll()) return;

    try {
      const data = getSubmitData();
      await submitMutation.mutateAsync(data);
      setIsSuccess(true);
      resetForm();
    } catch {
      // error is handled by mutation state and displayed below
    }
  };

  const handleNewPayment = () => {
    setIsSuccess(false);
    submitMutation.reset();
  };

  if (isSuccess) {
    return (
      <div className="payment-card animate-in fade-in-0 zoom-in-95 duration-500">
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{
              background: 'oklch(0.72 0.17 72 / 0.10)',
              border: '2px solid oklch(0.72 0.17 72 / 0.40)',
            }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: 'oklch(0.62 0.16 70)' }} />
          </div>

          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: 'oklch(0.18 0.005 60)' }}
          >
            Payment Submitted
          </h2>
          <p className="mb-8 max-w-xs text-sm" style={{ color: 'oklch(0.55 0.010 60)' }}>
            Your payment details have been securely submitted and recorded.
          </p>

          <Button
            onClick={handleNewPayment}
            className="btn-primary px-8 h-11"
          >
            New Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Credit card illustration */}
      <div className="w-full max-w-sm mb-5 animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <img
          src="/assets/generated/credit-card-light.dim_600x380.png"
          alt="Credit card illustration"
          className="w-full h-auto rounded-2xl"
          style={{
            boxShadow: '0 8px 32px oklch(0.72 0.17 72 / 0.18), 0 2px 8px oklch(0.14 0.004 60 / 0.08)',
          }}
          draggable={false}
        />
      </div>

      {/* Payment form card */}
      <div className="payment-card w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        {/* Card header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: 'oklch(0.985 0.002 60)',
            borderBottom: '1px solid oklch(0.92 0.006 60)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-lg font-bold"
                style={{ color: 'oklch(0.18 0.005 60)' }}
              >
                Payment Details
              </h1>
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'oklch(0.55 0.010 60)' }}>
                <Lock className="w-3 h-3" style={{ color: 'oklch(0.72 0.17 72)' }} />
                256-bit SSL encrypted
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                background: 'oklch(0.72 0.17 72 / 0.08)',
                border: '1px solid oklch(0.72 0.17 72 / 0.25)',
              }}
            >
              <Shield className="w-4 h-4" style={{ color: 'oklch(0.62 0.16 70)' }} />
              <span className="text-xs font-semibold" style={{ color: 'oklch(0.52 0.14 68)' }}>
                PCI DSS
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">
          {/* Personal Info Section */}
          <div>
            <p className="section-label mb-3">Cardholder Information</p>
            <div
              className="rounded-xl p-4 space-y-4"
              style={{
                background: 'oklch(0.985 0.002 60)',
                border: '1px solid oklch(0.92 0.006 60)',
              }}
            >
              <FormField
                id="fullName"
                label="Full Name"
                icon={<User className="w-3.5 h-3.5" />}
                value={formData.fullName}
                error={errors.fullName}
                placeholder="John Doe"
                autoComplete="name"
                onChange={v => handleChange('fullName', v)}
                onBlur={() => handleBlur('fullName')}
              />
              <FormField
                id="email"
                label="Email Address"
                icon={<Mail className="w-3.5 h-3.5" />}
                value={formData.email}
                error={errors.email}
                placeholder="john@example.com"
                type="email"
                autoComplete="email"
                onChange={v => handleChange('email', v)}
                onBlur={() => handleBlur('email')}
              />
              <FormField
                id="address"
                label="Billing Address"
                icon={<MapPin className="w-3.5 h-3.5" />}
                value={formData.address}
                error={errors.address}
                placeholder="123 Main St, City, State, ZIP"
                autoComplete="street-address"
                onChange={v => handleChange('address', v)}
                onBlur={() => handleBlur('address')}
              />
            </div>
          </div>

          {/* Card Info Section */}
          <div>
            <p className="section-label mb-3">Card Details</p>
            <div
              className="rounded-xl p-4 space-y-4"
              style={{
                background: 'oklch(0.985 0.002 60)',
                border: '1px solid oklch(0.92 0.006 60)',
              }}
            >
              <FormField
                id="cardNumber"
                label="Card Number"
                icon={<CreditCard className="w-3.5 h-3.5" />}
                value={formData.cardNumber}
                error={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={19}
                onChange={v => handleChange('cardNumber', v)}
                onBlur={() => handleBlur('cardNumber')}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="expiryDate"
                  label="Expiry Date"
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  value={formData.expiryDate}
                  error={errors.expiryDate}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  maxLength={5}
                  onChange={v => handleChange('expiryDate', v)}
                  onBlur={() => handleBlur('expiryDate')}
                />
                <FormField
                  id="cvv"
                  label="CVV"
                  icon={<Shield className="w-3.5 h-3.5" />}
                  value={formData.cvv}
                  error={errors.cvv}
                  placeholder="•••"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  onChange={v => handleChange('cvv', v)}
                  onBlur={() => handleBlur('cvv')}
                />
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div>
            <p className="section-label mb-3">Transaction Amount</p>
            <div
              className="rounded-xl p-4"
              style={{
                background: 'oklch(0.985 0.002 60)',
                border: '1px solid oklch(0.92 0.006 60)',
              }}
            >
              <FormField
                id="amount"
                label="Amount (USD)"
                icon={<DollarSign className="w-3.5 h-3.5" />}
                value={formData.amount}
                error={errors.amount}
                placeholder="0.00"
                inputMode="decimal"
                onChange={v => handleChange('amount', v)}
                onBlur={() => handleBlur('amount')}
              />
            </div>
          </div>

          {/* Actor initializing indicator */}
          {!isActorReady && !submitMutation.isPending && (
            <div
              className="rounded-xl px-4 py-2.5 text-xs flex items-center gap-2"
              style={{
                background: 'oklch(0.72 0.17 72 / 0.06)',
                border: '1px solid oklch(0.72 0.17 72 / 0.20)',
                color: 'oklch(0.52 0.14 68)',
              }}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: 'oklch(0.72 0.17 72)' }} />
              Connecting to payment service…
            </div>
          )}

          {/* Submit error */}
          {submitMutation.isError && (
            <div
              className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
              style={{
                background: 'oklch(0.97 0.04 25)',
                border: '1px solid oklch(0.85 0.12 25 / 0.5)',
                color: 'oklch(0.45 0.18 25)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: 'oklch(0.55 0.20 25)' }}
              />
              <span>
                {submitMutation.error instanceof Error
                  ? submitMutation.error.message
                  : 'Payment submission failed. Please try again.'}
              </span>
            </div>
          )}

          {/* Processing indicator */}
          {submitMutation.isPending && (
            <div
              className="rounded-xl px-4 py-2.5 text-xs flex items-center gap-2"
              style={{
                background: 'oklch(0.72 0.17 72 / 0.06)',
                border: '1px solid oklch(0.72 0.17 72 / 0.20)',
                color: 'oklch(0.52 0.14 68)',
              }}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'oklch(0.72 0.17 72)' }} />
              Processing your payment securely…
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn-primary w-full h-12 text-sm mt-1"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing…
              </>
            ) : !isActorReady ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Submit Payment
              </>
            )}
          </Button>

          <p
            className="text-center text-xs flex items-center justify-center gap-1.5 pt-1"
            style={{ color: 'oklch(0.60 0.008 60)' }}
          >
            <Shield className="w-3 h-3" style={{ color: 'oklch(0.72 0.17 72)' }} />
            Your payment information is encrypted and secure
          </p>
        </form>
      </div>
    </div>
  );
}
