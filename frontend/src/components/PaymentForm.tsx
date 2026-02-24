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

function FormField({ id, label, icon, value, error, placeholder, type = 'text', inputMode, onChange, onBlur, maxLength, autoComplete }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
        <span className="text-amber-500">{icon}</span>
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
          className={`payment-input ${error ? 'border-red-400 focus-visible:ring-red-400/30' : ''}`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      const data = getSubmitData();
      await submitMutation.mutateAsync(data);
      setIsSuccess(true);
      resetForm();
    } catch {
      // error handled by mutation state
    }
  };

  const handleNewPayment = () => {
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="payment-card animate-in fade-in-0 zoom-in-95 duration-500">
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Payment Submitted!</h2>
          <p className="text-neutral-500 mb-8 max-w-xs">
            Your payment details have been securely submitted and recorded.
          </p>
          <Button
            onClick={handleNewPayment}
            className="btn-gold px-8"
          >
            Make Another Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-card animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-neutral-100 bg-neutral-50/60">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <img
              src="/assets/generated/secure-lock-icon.dim_128x128.png"
              alt="Secure"
              className="w-6 h-6 object-contain"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Secure Payment</h1>
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-500" />
              256-bit SSL encrypted
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="px-8 py-6 space-y-5">
        {/* Personal Info Section */}
        <div className="space-y-1 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Personal Information</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
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

        {/* Card Info Section */}
        <div className="space-y-1 pt-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Card Details</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
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
              placeholder="123"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              onChange={v => handleChange('cvv', v)}
              onBlur={() => handleBlur('cvv')}
            />
          </div>
        </div>

        {/* Amount Section */}
        <div className="space-y-1 pt-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Payment Amount</p>
        </div>

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

        {/* Submit error */}
        {submitMutation.isError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            Payment submission failed. Please try again.
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={submitMutation.isPending}
          className="btn-gold w-full h-11 text-sm mt-2"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Submit Payment
            </>
          )}
        </Button>

        <p className="text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
          <Shield className="w-3 h-3 text-amber-400" />
          Your payment information is encrypted and secure
        </p>
      </form>
    </div>
  );
}
