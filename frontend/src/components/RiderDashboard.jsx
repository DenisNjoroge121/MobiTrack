import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, CheckCircle, Navigation } from 'lucide-react';

export default function RiderDashboard({ deliveries }) {
  const [activeScanningId, setActiveScanningId] = useState(null);
  const assignedDeliveries = deliveries.filter((d) => d.status !== 'DELIVERED');

  useEffect(() => {
    if (activeScanningId) {
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
      scanner.render(async (decodedText) => {
        scanner.clear();
        await handleVerifyQR(activeScanningId, decodedText);
        setActiveScanningId(null);
      }, (err) => console.warn(err));

      return () => scanner.clear().catch(() => {});
    }
  }, [activeScanningId]);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:8000/api/deliveries/${id}/update_status/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  const handleVerifyQR = async (id, qrHash) => {
    const res = await fetch(`http://localhost:8000/api/deliveries/${id}/verify_qr/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_code_hash: qrHash }),
    });
    if (!res.ok) alert('Invalid QR Code Scanned!');
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Rider Mobile Workspace</h2>

      {/* Camera QR Modal */}
      {activeScanningId && (
        <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Scan Delivery QR Code</h3>
            <button onClick={() => setActiveScanningId(null)} className="text-xs text-rose-500 font-bold">Cancel</button>
          </div>
          <div id="qr-reader" className="overflow-hidden rounded-xl border border-slate-200"></div>
        </div>
      )}

      {assignedDeliveries.map((delivery) => (
        <div key={delivery.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              Order #{delivery.id}
            </span>
            <span className="text-xs font-bold text-slate-500">{delivery.status}</span>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">{delivery.customer_name}</h3>
            <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
              <Navigation className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {delivery.delivery_address}
            </p>
            <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg">
              Item: {delivery.item_description}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            {delivery.status === 'ASSIGNED' && (
              <button
                onClick={() => updateStatus(delivery.id, 'PICKED_UP')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition"
              >
                Mark Picked Up
              </button>
            )}
            {delivery.status === 'PICKED_UP' && (
              <button
                onClick={() => setActiveScanningId(delivery.id)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition"
              >
                <QrCode className="w-4 h-4" /> Scan QR to Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}