import { useState } from 'react';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';

type View = 'payment' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('payment');

  if (view === 'admin') {
    return <AdminPage onBack={() => setView('payment')} />;
  }

  return <PaymentPage onNavigateAdmin={() => setView('admin')} />;
}
