import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF9F6] px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center mx-auto text-3xl font-display font-bold">
          404
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-[#1E2A24]">
            Page Not Found
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            The material or page you are looking for does not exist or may have been relocated.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#1E2A24] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2D3E35] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 rounded-xl bg-white border border-[#E7E5E4] text-[#1E2A24] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
          >
            <Package className="w-4 h-4 text-[#9A6A3A]" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
