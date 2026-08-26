import React, { useState } from 'react';
import { PlusCircle, Package, Clock, CheckCircle2, Truck } from 'lucide-react';

export default function RetailerDashboard({ deliveries }) {
  const [formData, setFormData] = useState({
    store: 1, // Default store ID for demo
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    item_description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/deliveries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newDelivery = await res.json();
        // Reset form
        setFormData({
          store: 1,
          customer_name: '',
          customer_phone: '',
          delivery_address: '',
          item_description: '',
        });
      } else {
        const errorData = await res.json();
        console.error('Validation Error from Server:', errorData);
        alert(`Failed to log delivery: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error('Failed to log delivery:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            <Package className="w-3.5 h-3.5" /> Assigned
          </span>
        );
      case 'PICKED_UP':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            <Truck className="w-3.5 h-3.5" /> Picked Up
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Delivery Request Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
          <PlusCircle className="w-5 h-5" /> Log New Delivery
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Phone</label>
            <input
              type="text"
              required
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="+254 700 000 000"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Address</label>
            <textarea
              required
              rows={2}
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Building, Street, Area"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Item Description</label>
            <input
              type="text"
              required
              value={formData.item_description}
              onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1x Electronics Package"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            Create Order Request
          </button>
        </form>
      </div>

      {/* Live Track Table */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900">Live Delivery Feed</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No active delivery requests
                  </td>
                </tr>
              ) : (
                deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">#{d.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{d.customer_name}</div>
                      <div className="text-xs text-slate-400">{d.delivery_address}</div>
                    </td>
                    <td className="px-4 py-3">{d.item_description}</td>
                    <td className="px-4 py-3">{getStatusBadge(d.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}