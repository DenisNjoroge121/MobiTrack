import React, { useState, useEffect } from 'react';
import RetailerDashboard from './components/RetailerDashboard';
import DispatcherDashboard from './components/DispatcherDashboard';
import RiderDashboard from './components/RiderDashboard';
import { Store, ShieldCheck, Bike } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('RETAILER');
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Initial fetch of existing deliveries
    fetch('http://localhost:8000/api/deliveries/')
      .then((res) => res.json())
      .then((data) => setDeliveries(data))
      .catch((err) => console.error(err));

    // Connect WebSocket
    const socket = new WebSocket('ws://localhost:8000/ws/deliveries/');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Match key and event payload from your backend
      if (message.event === 'DELIVERY_CREATED' || message.type === 'delivery.created') {
        const delivery = message.data || message.payload;
        setDeliveries((prev) => [delivery, ...prev.filter(d => d.id !== delivery.id)]);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center shadow-sm gap-4">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">MobiTrack / Reflex</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setRole('RETAILER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              role === 'RETAILER' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Retailer
          </button>
          <button
            onClick={() => setRole('DISPATCHER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              role === 'DISPATCHER' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Dispatcher
          </button>
          <button
            onClick={() => setRole('RIDER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              role === 'RIDER' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Rider
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {role === 'RETAILER' && <RetailerDashboard deliveries={deliveries} />}
        {role === 'DISPATCHER' && <DispatcherDashboard deliveries={deliveries} />}
        {role === 'RIDER' && <RiderDashboard deliveries={deliveries} />}
      </main>
    </div>
  );
}