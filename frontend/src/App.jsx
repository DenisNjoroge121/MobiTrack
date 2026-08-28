import React, { useState } from 'react';
import RetailerDashboard from './components/dashboards/RetailerDashboard';
import DispatcherDashboard from './components/dashboards/DispatcherDashboard';
import RiderDashboard from './components/dashboards/RiderDashboard';
import DeliveryTracker from './components/DeliveryTracker';
import { useTrackingWebSocket } from './useWebSocket';
import { LayoutDashboard, Shield, Bike, Map, Layers } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('RETAILER'); // RETAILER | DISPATCHER | RIDER
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('8f12a9c4-0012-421b-8531-df13b2e53301');
  
  const [deliveries, setDeliveries] = useState([
    {
      id: '8f12a9c4-0012-421b-8531-df13b2e53301',
      customer_name: 'Jane Doe',
      phone_number: '+254 700 112 233',
      delivery_address: 'Kilimani West, Apt 4B',
      item_description: 'Electronics Box (2.5 kg)',
      status: 'PENDING',
      rider: null,
    },
    {
      id: '2a44e112-9981-4200-a111-ce11b4a20012',
      customer_name: 'Alex Smith',
      phone_number: '+254 733 445 566',
      delivery_address: 'CBD Medical Center',
      item_description: 'Pharmaceutical Supplies Batch A',
      status: 'ASSIGNED',
      rider: 101,
    }
  ]);

  const selectedDelivery = deliveries.find((d) => d.id === selectedDeliveryId) || deliveries[0];
  const { sendLocation, sendStatus } = useTrackingWebSocket(selectedDeliveryId);

  const handleCreateDelivery = (newDelivery) => {
    const item = {
      ...newDelivery,
      id: crypto.randomUUID(),
      status: 'PENDING',
      rider: null,
    };
    setDeliveries([item, ...deliveries]);
    setSelectedDeliveryId(item.id);
  };

  const handleAssignRider = (id, riderId) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, rider: riderId, status: 'ASSIGNED' } : d));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Layers className="text-emerald-400 w-6 h-6" />
            <h1 className="font-extrabold text-xl tracking-tight text-white">MobiTrack</h1>
          </div>

          {/* Role Switcher Controls */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveRole('RETAILER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${activeRole === 'RETAILER' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Retailer
            </button>
            <button
              onClick={() => setActiveRole('DISPATCHER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${activeRole === 'DISPATCHER' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Shield className="w-3.5 h-3.5" /> Dispatcher
            </button>
            <button
              onClick={() => setActiveRole('RIDER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${activeRole === 'RIDER' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Bike className="w-3.5 h-3.5" /> Rider
            </button>
          </div>
        </div>
      </header>

      {/* Main Role Dashboard View */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-12">
        {activeRole === 'RETAILER' && (
          <RetailerDashboard
            deliveries={deliveries}
            onCreateDelivery={handleCreateDelivery}
            onSelectDelivery={(id) => setSelectedDeliveryId(id)}
          />
        )}

        {activeRole === 'DISPATCHER' && (
          <DispatcherDashboard
            deliveries={deliveries}
            onAssignRider={handleAssignRider}
            onSelectDelivery={(id) => setSelectedDeliveryId(id)}
          />
        )}

        {activeRole === 'RIDER' && (
          <RiderDashboard
            deliveries={deliveries}
            selectedDeliveryId={selectedDeliveryId}
            onSelectDelivery={(id) => setSelectedDeliveryId(id)}
            onSendLocation={(lat, lng) => sendLocation(lat, lng, 101)}
            onUpdateStatus={(newStatus) => {
              setDeliveries((prev) =>
                prev.map((d) => (d.id === selectedDeliveryId ? { ...d, status: newStatus } : d))
              );
              sendStatus(newStatus, `Status updated to ${newStatus}`);
            }}
          />
        )}

        {/* Live Tracking Monitor - ONLY visible to Retailer and Dispatcher */}
        {(activeRole === 'RETAILER' || activeRole === 'DISPATCHER') && (
          <div className="border-t border-slate-800 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <Map className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Live Tracking Monitor</h3>
            </div>
            <DeliveryTracker delivery={selectedDelivery} />
          </div>
        )}
      </main>
    </div>
  );
}