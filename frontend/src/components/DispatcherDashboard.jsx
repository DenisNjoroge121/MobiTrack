import React, { useState, useEffect } from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';

export default function DispatcherDashboard({ deliveries }) {
  const [riders, setRiders] = useState([]);
  const [selectedRiders, setSelectedRiders] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/api/users/riders/')
      .then((res) => res.json())
      .then((data) => setRiders(data))
      .catch((err) => console.error('Failed to load riders:', err));
  }, []);

  const pendingDeliveries = deliveries.filter((d) => d.status === 'PENDING');

  const handleAssign = async (deliveryId) => {
    const riderId = selectedRiders[deliveryId];
    if (!riderId) return;

    await fetch(`http://localhost:8000/api/deliveries/${deliveryId}/assign/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rider_id: riderId, dispatcher_id: 1 }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Dispatcher Control Center</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          {pendingDeliveries.length} Pending Assignment
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingDeliveries.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            No pending orders require dispatch right now.
          </div>
        ) : (
          pendingDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  Order #{delivery.id}
                </span>
                <span className="text-xs text-slate-400">{delivery.store_name}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{delivery.customer_name}</h3>
                <p className="text-xs text-slate-500">{delivery.delivery_address}</p>
                <p className="text-xs font-medium text-indigo-600 mt-2">{delivery.item_description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <select
                  onChange={(e) => setSelectedRiders({ ...selectedRiders, [delivery.id]: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  defaultValue=""
                >
                  <option value="" disabled>Select Available Rider</option>
                  {riders.map((r) => (
                    <option key={r.id} value={r.id}>{r.username} ({r.phone || 'No phone'})</option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssign(delivery.id)}
                  className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl text-sm transition"
                >
                  <UserCheck className="w-4 h-4" /> Assign Rider
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}