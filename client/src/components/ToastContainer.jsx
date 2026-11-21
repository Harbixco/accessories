import React from 'react';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Heart, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isCart = toast.type === 'cart';
        const isWishlist = toast.type === 'wishlist';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-md shadow-xl overflow-hidden animate-toast-in transform transition-all duration-200"
          >
            <div className="p-3.5 flex items-start gap-3">
              {/* Icon badge */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCart
                    ? 'bg-emerald-50 text-emerald-600'
                    : isWishlist
                    ? 'bg-rose-50 text-rose-500'
                    : isInfo
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {isCart && <ShoppingBag size={15} />}
                {isWishlist && <Heart size={15} className="fill-current" />}
                {isInfo && <Info size={15} />}
                {!isCart && !isWishlist && !isInfo && <CheckCircle2 size={15} />}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <p className="text-xs font-bold text-gray-900 leading-tight">
                    {toast.title}
                  </p>
                )}
                {toast.message && (
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug line-clamp-2">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 transition shrink-0 p-0.5 rounded cursor-pointer"
                title="Close"
              >
                <X size={13} />
              </button>
            </div>

            {/* Countdown Shrinking Bar */}
            <div className="h-0.75 w-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full ${
                  isCart
                    ? 'bg-emerald-500'
                    : isWishlist
                    ? 'bg-rose-500'
                    : isInfo
                    ? 'bg-blue-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  animation: `shrinkBar ${toast.duration || 3200}ms linear forwards`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
