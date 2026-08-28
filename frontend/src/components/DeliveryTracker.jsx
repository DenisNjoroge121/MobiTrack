import React, { useState } from 'react';
import { useTrackingWebSocket } from '../useWebSocket';
import { 
  Package, 
  MapPin, 
  UserCheck, 
  Truck, 
  CheckCircle2, 
  Navigation, 
  Clock 
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Pending', icon: Clock },
  { key: 'ASSIGNED', label: 'Assigned', icon: UserCheck },
  { key: 'PICKED_UP', label: 'Picked Up', icon: Package },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function DeliveryTracker({ delivery }) {
  const deliveryId = delivery?.id || "demo-123";
  const { location, status, sendLocation, sendStatus } = useTrackingWebSocket(deliveryId);
  const [currentStatus, setCurrentStatus] = useState(delivery?.status || 'PENDING');

  // Handle WebSocket updates or fall back to selected delivery status
  const activeStatus = status || delivery?.status || currentStatus;

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    sendStatus(newStatus, `Status updated to ${newStatus}`);
  };

  const simulateRiderMovement = () => {
    const mockLat = -1.286389 + (Math.random() - 0.5) * 0.01;
    const mockLng = 36.817223 + (Math.random() - 0.5) * 0.01;
    sendLocation(mockLat, mockLng, 101);
  };

  const getStepIndex = (key) => STATUS_STEPS.findIndex((s) => s.key === key);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card displaying dynamic package details */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Package className="text-emerald-400 w-6 h-6" />
            <h2 className="text-xl font-bold">
              {delivery?.item_description || delivery?.title || "No Package Selected"}
            </h2>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            Tracking ID: #{deliveryId}
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider">
          {activeStatus}
        </span>
      </div>

      {/* Progress Workflow Tracker */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-slate-300 font-medium mb-6">Workflow Status</h3>
        <div className="flex justify-between items-center relative">
          {STATUS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = getStepIndex(activeStatus) >= idx;
            const isCurrent = activeStatus === step.key;

            return (
              <div key={step.key} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPassed
                      ? 'bg-emerald-500 text-slate-900 font-bold'
                      : 'bg-slate-700 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-emerald-500/30' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 ${isPassed ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Map & GPS Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="text-blue-400 w-5 h-5" />
              <h3 className="font-semibold text-lg">Live GPS Telemetry</h3>
            </div>
            
            {location ? (
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700/50 space-y-2 text-sm font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Latitude:</span>
                  <span className="text-emerald-400">{location.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Longitude:</span>
                  <span className="text-emerald-400">{location.lng.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rider ID:</span>
                  <span className="text-slate-200">#{location.riderId}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Awaiting telemetry stream from rider...</p>
            )}
          </div>

          <button
            onClick={simulateRiderMovement}
            className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" /> Simulate Rider GPS Ping
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-4">Manual Status Trigger</h3>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_STEPS.map((step) => (
              <button
                key={step.key}
                onClick={() => handleStatusChange(step.key)}
                className={`p-2 text-xs rounded-lg border text-left transition-all ${
                  activeStatus === step.key
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}