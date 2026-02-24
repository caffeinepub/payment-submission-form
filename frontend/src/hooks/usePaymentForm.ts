import { useState, useCallback } from 'react';

export interface PaymentFormData {
  fullName: string;
  address: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: string;
}

export interface PaymentFormErrors {
  fullName?: string;
  address?: string;
  email?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}

const initialFormData: PaymentFormData = {
  fullName: '',
  address: '',
  email: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  amount: '',
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(digits);
}

function validateExpiryDate(expiry: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

function validateAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

export function usePaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const validateField = useCallback((name: keyof PaymentFormData, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Please enter a valid address';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return undefined;
      case 'cardNumber':
        if (!value.trim()) return 'Card number is required';
        if (!validateCardNumber(value)) return 'Please enter a valid 16-digit card number';
        return undefined;
      case 'expiryDate':
        if (!value.trim()) return 'Expiry date is required';
        if (!validateExpiryDate(value)) return 'Please enter a valid expiry date (MM/YY)';
        return undefined;
      case 'cvv':
        if (!value.trim()) return 'CVV is required';
        if (!validateCVV(value)) return 'CVV must be 3 or 4 digits';
        return undefined;
      case 'amount':
        if (!value.trim()) return 'Amount is required';
        if (!validateAmount(value)) return 'Please enter a valid positive amount';
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const handleChange = useCallback((name: keyof PaymentFormData, value: string) => {
    let processedValue = value;

    if (name === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      processedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'amount') {
      processedValue = value.replace(/[^0-9.]/g, '');
      const parts = processedValue.split('.');
      if (parts.length > 2) processedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: keyof PaymentFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [formData, validateField]);

  const validateAll = useCallback((): boolean => {
    const allTouched: Record<string, boolean> = {};
    const newErrors: PaymentFormErrors = {};
    let isValid = true;

    (Object.keys(formData) as (keyof PaymentFormData)[]).forEach(key => {
      allTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  }, []);

  const getSubmitData = useCallback(() => {
    const rawCardNumber = formData.cardNumber.replace(/\s/g, '');
    const amountInCents = Math.round(parseFloat(formData.amount) * 100);
    return {
      fullName: formData.fullName.trim(),
      address: formData.address.trim(),
      email: formData.email.trim(),
      cardNumber: rawCardNumber,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
      amount: BigInt(amountInCents),
    };
  }, [formData]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    getSubmitData,
  };
}
