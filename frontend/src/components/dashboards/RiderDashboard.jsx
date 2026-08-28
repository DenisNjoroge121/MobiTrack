import React from 'react';
import { 
  Navigation, 
  MapPin, 
  User, 
  Phone, 
  Package, 
  CheckCircle2, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

export default function RiderDashboard({ 
  deliveries = [], 
  selectedDeliveryId, 
  onSelectDelivery, 
  onSendLocation, 
  onUpdateStatus 
}) {
  // Filter all deliveries assigned to this rider (rider ID #101)
  const assignedDeliveries = deliveries.filter(
    (d) => d.rider === 101 || d.id === selectedDeliveryId
  );

  const activeDelivery = deliveries.find((d) => d.id === selectedDeliveryId) || assignedDeliveries[0];

  const handleSimulateGPS = () => {
    if (!activeDelivery) return;
    // Generate realistic movement coordinates (Nairobi area mock ping)
    const mockLat = -1.286389 + (Math.random() - 0.5) * 0.005;
    const mockLng = 36.817223 + (Math.random() - 0.5) * 0.005;
    onSendLocation(mockLat, mockLng);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Rider Queue</h2>
          <p className="text-slate-400 text-sm">
            View assigned jobs, update package progress, and stream live GPS pings.
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold rounded-full uppercase">
          {assignedDeliveries.length} Assigned Task{assignedDeliveries.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Main Grid: Orders List & Active Task Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of All Assigned Orders */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 px-1">Your Order Queue</h3>
          
          {assignedDeliveries.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl text-center text-slate-400 text-sm">
              No orders currently assigned to your queue.
            </div>
          ) : (
            assignedDeliveries.map((item) => {
              const isSelected = item.id === activeDelivery?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectDelivery(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-slate-400">#{item.id.slice(0, 8)}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-white font-semibold text-sm line-clamp-1">
                    {item.item_description || item.title}
                  </h4>

                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{item.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{item.delivery_address}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Order Controls & Real-time Action Panel */}
        <div className="lg:col-span-2 space-y-4">
          {activeDelivery ? (
            <>
              {/* Active Delivery Details Card */}
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl text-white space-y-4 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Order ID: #{activeDelivery.id}</span>
                    <h3 className="text-lg font-bold text-emerald-400 mt-0.5">
                      {activeDelivery.item_description || activeDelivery.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase">
                    {activeDelivery.status}
                  </span>
                </div>

                {/* Recipient Information */}
                <div className="bg-slate-900/80 p-4 rounded-lg text-xs space-y-2.5 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-slate-500">Customer:</span>{' '}
                      <strong className="text-white">{activeDelivery.customer_name}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-slate-500">Phone:</span>{' '}
                      <a href={`tel:${activeDelivery.phone_number}`} className="underline text-emerald-400">
                        {activeDelivery.phone_number}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300 pt-1 border-t border-slate-800">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block">Delivery Address:</span>
                      <span className="text-slate-200 font-medium">{activeDelivery.delivery_address}</span>
                    </div>
                  </div>
                </div>

                {/* GPS Telemetry Button */}
                <button
                  onClick={handleSimulateGPS}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <Navigation className="w-4 h-4 animate-pulse" /> Stream Live GPS Telemetry Ping
                </button>
              </div>

              {/* Status Updater for Selected Item */}
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl text-white space-y-3 shadow-lg">
                <h4 className="text-sm font-semibold text-slate-300">Update Item Status</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'ACCEPTED', label: 'Accept Job' },
                    { key: 'PICKED_UP', label: 'Picked Up' },
                    { key: 'IN_TRANSIT', label: 'In Transit' },
                    { key: 'DELIVERED', label: 'Delivered' },
                  ].map((stage) => {
                    const isCurrent = activeDelivery.status === stage.key;
                    return (
                      <button
                        key={stage.key}
                        onClick={() => onUpdateStatus(stage.key)}
                        className={`p-3 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                          isCurrent
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/50'
                        }`}
                      >
                        {stage.label}
                        {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center text-slate-400">
              Select an assigned order from the left to manage status and telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}