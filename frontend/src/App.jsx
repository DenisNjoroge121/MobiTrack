import React from 'react';
import { Package, Truck, Store } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow-md max-w-md w-full space-y-4">
        <div className="flex items-center gap-3 text-indigo-600">
          <Truck className="w-8 h-8" />
          <h1 className="text-2xl font-bold">MobiTrack Setup Ready</h1>
        </div>
        <p className="text-slate-600 text-sm">
          Tailwind v4 and Lucide React icons are working correctly.
        </p>
        <div className="flex gap-2 pt-2">
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
            <Store className="w-3.5 h-3.5" /> Retailer
          </span>
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
            <Package className="w-3.5 h-3.5" /> Dispatcher
          </span>
        </div>
      </div>
    </div>
  );
}