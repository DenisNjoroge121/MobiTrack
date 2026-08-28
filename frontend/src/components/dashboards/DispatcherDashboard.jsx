import React from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, Truck, Send } from 'lucide-react';

export default function DispatcherDashboard({ deliveries, onAssignRider, onSelectDelivery }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold text-white">Dispatcher Control Center</h2>
        <p className="text-slate-400 text-sm">Assign available riders to pending orders and oversee fulfillment workflows.</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase border-b border-slate-700">
            <tr>
              <th className="p-4">Delivery Details</th>
              <th className="p-4">Addresses</th>
              <th className="p-4">Status</th>
              <th className="p-4">Assigned Rider</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {deliveries.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/20 transition">
                <td className="p-4 font-medium text-white">
                  <div>{item.title}</div>
                  <div className="text-xs text-slate-500 font-mono">#{item.id.slice(0, 8)}</div>
                </td>
                <td className="p-4 text-xs space-y-1">
                  <div><span className="text-slate-500">From:</span> {item.pickup_address}</div>
                  <div><span className="text-slate-500">To:</span> {item.delivery_address}</div>
                </td>
                <td className="p-4">
                  <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-semibold uppercase">
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400">
                  {item.rider ? `#${item.rider}` : <span className="text-amber-400 text-xs">Unassigned</span>}
                </td>
                <td className="p-4 text-right space-x-2">
                  {!item.rider && (
                    <button
                      onClick={() => onAssignRider(item.id, 101)} // Assigns mock Rider #101
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition"
                    >
                      Assign Rider #101
                    </button>
                  )}
                  <button
                    onClick={() => onSelectDelivery(item.id)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs transition"
                  >
                    View Live
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}