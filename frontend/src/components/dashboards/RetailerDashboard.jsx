import React, { useState } from 'react';
import { Package, Plus, MapPin, User, Phone, ChevronRight, FileText } from 'lucide-react';

export default function RetailerDashboard({ deliveries, onCreateDelivery, onSelectDelivery }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    delivery_address: '',
    item_description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateDelivery(formData);
    setFormData({
      customer_name: '',
      phone_number: '',
      delivery_address: '',
      item_description: '',
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white">Retailer Portal</h2>
          <p className="text-slate-400 text-sm">Log new delivery requests and monitor customer dispatches in real-time.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition text-sm shadow-md"
        >
          <Plus className="w-4 h-4" /> Create Delivery Order
        </button>
      </div>

      {/* Delivery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectDelivery(item.id)}
            className="bg-slate-800 border border-slate-700 hover:border-slate-600 p-5 rounded-xl cursor-pointer transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="p-2 bg-slate-700/50 rounded-lg text-emerald-400">
                  <Package className="w-5 h-5" />
                </span>
                <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold uppercase">
                  {item.status}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg">{item.item_description}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">ID: #{item.id.slice(0, 8)}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/50 pt-3">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Customer: <strong className="text-white">{item.customer_name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Phone: {item.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Address: {item.delivery_address}</span>
              </div>
            </div>

            <div className="flex justify-end items-center text-xs text-emerald-400 font-medium pt-2">
              Track Status <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Create Delivery Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="text-emerald-400 w-5 h-5" /> Log Delivery Request
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Customer Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 712 345 678"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Westlands, Apartment 4B"
                    value={formData.delivery_address}
                    onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Item Description</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <textarea
                    required
                    rows="3"
                    placeholder="e.g. 1x Dell XPS 15 Laptop & Accessories"
                    value={formData.item_description}
                    onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-500 font-medium transition shadow-md"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}