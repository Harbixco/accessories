import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

const CartDrawer = () => {
  const { t, i18n } = useTranslation();
  const { user, isApproved } = useAuth();
  const { addToast } = useToast();
  const isGerman = i18n.language?.startsWith('de');
  const navigate = useNavigate();

  const {
    items,
    updateQuantity,
    removeFromCart,
    totalNet,
    vatAmount,
    shippingCostNet,
    totalGross,
    totalItemsCount,
    minOrderValue,
    isMovMet,
    amountToMov,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const formatPrice = (val) =>
    isGerman ? `${val.toFixed(2).replace('.', ',')} €` : `€${val.toFixed(2)}`;

  const movProgress = Math.min(100, Math.round((totalNet / minOrderValue) * 100));

  const handleAutoFulfillMov = () => {
    if (items.length === 0) return;
    const targetItem = items[0];
    const unitPrice = targetItem.product?.basePrice || 14.43;
    const currentNetWithoutTarget = totalNet - (unitPrice * targetItem.quantity);
    const neededNet = Math.max(0, minOrderValue - currentNetWithoutTarget);
    const neededQty = Math.ceil(neededNet / unitPrice);
    updateQuantity(targetItem.productId, Math.max(neededQty, targetItem.quantity + 1));
    addToast({
      title: isGerman ? 'Mindestbestellwert erfüllt!' : 'MOV Fulfilled!',
      message: isGerman
        ? `Menge auf ${neededQty} Stück angepasst (150,00 € erreicht).`
        : `Quantity adjusted to ${neededQty} units (€150.00 achieved).`,
      type: 'success',
    });
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartDrawerOpen(false);
      navigate('/login');
      addToast({
        title: isGerman ? 'Händler-Anmeldung erforderlich' : 'Dealer Login Required',
        message: isGerman
          ? 'Bitte melden Sie sich als B2B-Händler an, um zur Online-Kasse zu gehen.'
          : 'Please log in with an approved dealer account to proceed to checkout.',
        type: 'info',
      });
      return;
    }
    if (!isApproved) {
      addToast({
        title: isGerman ? 'Händlerkonto in Prüfung' : 'Account Under Verification',
        message: isGerman
          ? 'Ihr B2B-Konto wurde noch nicht freigeschaltet. Bitte warten Sie auf die Freischaltung.'
          : 'Your dealer account is still pending verification by the admin.',
        type: 'warning',
      });
      return;
    }
    if (!isMovMet) {
      addToast({
        title: isGerman ? 'Mindestbestellwert (150,00 €) noch nicht erreicht' : 'Minimum Order Value (€150.00) Not Met',
        message: isGerman
          ? `Noch ${formatPrice(amountToMov)} netto bis zum Mindestbestellwert von 150,00 €.`
          : `Remaining ${formatPrice(amountToMov)} net to fulfill the €150.00 MOV.`,
        type: 'warning',
      });
      return;
    }
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleGoToCart = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with transition */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity duration-300"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-[#fafbfc]">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {isGerman ? 'Warenkorb' : 'Shopping Cart'} ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded transition cursor-pointer hover:rotate-90 transition-transform duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* B2B Minimum Order Value (MOV) Progress Bar */}
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs">
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <span className="font-semibold text-gray-700">
                {isGerman ? 'Mindestbestellwert:' : 'Min. Order Value:'} {formatPrice(minOrderValue)} net
              </span>
              <span className="font-bold text-[#0B1E3F] tabular-nums">{movProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  isMovMet ? 'animate-shimmer-bar' : 'bg-amber-500'
                }`}
                style={{ width: `${movProgress}%` }}
              ></div>
            </div>
            <p className="mt-1 text-[10px] text-gray-500">
              {isMovMet ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} />
                  {isGerman ? 'Mindestbestellwert erreicht! Ab 500 € frachtfrei.' : 'Minimum met! Free shipping above €500.'}
                </span>
              ) : (
                <span>
                  {isGerman ? 'Noch' : 'Remaining:'} <strong>{formatPrice(amountToMov)} {isGerman ? 'netto' : 'net'}</strong> {isGerman ? 'bis zur Bestellfreigabe' : 'to fulfill MOV'}
                </span>
              )}
            </p>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs space-y-2">
                <ShoppingBag size={36} className="mx-auto text-gray-300 stroke-[1.5]" />
                <p>{isGerman ? 'Ihr Warenkorb ist derzeit leer.' : 'Your shopping cart is currently empty.'}</p>
              </div>
            ) : (
              items.map((it) => (
                <div key={it.product._id || it.product.sku} className="pt-3 first:pt-0 flex gap-3 text-xs transition-opacity duration-200">
                  <img
                    src={it.product.images?.[0]}
                    alt={isGerman ? it.product.name?.de : it.product.name?.en}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain border border-gray-200 rounded bg-white p-1 shrink-0 transition-transform hover:scale-105 duration-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 font-mono block">SKU: {it.product.sku}</span>
                    <p className="font-semibold text-gray-900 leading-snug line-clamp-2">
                      {isGerman ? it.product.name?.de : it.product.name?.en}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-300 rounded bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(it.product._id || it.product.sku, it.quantity - 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer active:scale-90 transition-transform"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-gray-800 tabular-nums">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(it.product._id || it.product.sku, it.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer active:scale-90 transition-transform"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#0B1E3F] block tabular-nums">
                          {formatPrice(it.totalPriceNet)} *
                        </span>
                        <span className="text-[10px] text-gray-400 block tabular-nums">
                          {formatPrice(it.unitPriceNet)} / Stk.
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(it.product._id || it.product.sku);
                      addToast({
                        title: isGerman ? 'Artikel entfernt' : 'Item removed',
                        message: isGerman ? it.product.name?.de : it.product.name?.en,
                        type: 'info',
                        duration: 2000,
                      });
                    }}
                    className="text-gray-400 hover:text-red-600 self-start p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title="Remove"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {items.length > 0 && (
            <div className="p-4 bg-[#fafbfc] border-t border-gray-200 space-y-3 text-xs">
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>{isGerman ? 'Warenwert (netto):' : 'Goods total (net):'}</span>
                  <span className="font-bold text-gray-900 tabular-nums">{formatPrice(totalNet)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isGerman ? 'zzgl. 19% MwSt.:' : '19% VAT:'}</span>
                  <span className="font-bold text-gray-900 tabular-nums">{formatPrice(vatAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isGerman ? 'Versand (netto):' : 'Shipping (net):'}</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {shippingCostNet === 0 ? (isGerman ? 'Kostenfrei' : 'Free') : formatPrice(shippingCostNet)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-gray-900">{isGerman ? 'Gesamtsumme (brutto):' : 'Total (gross):'}</span>
                  <span className="text-base font-extrabold text-[#0B1E3F] tabular-nums">
                    {formatPrice(totalGross)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                    isMovMet && isApproved
                      ? 'bg-gradient-to-b from-[#102a54] to-[#0B1E3F] hover:from-[#16386b] hover:to-[#102a54] text-white active:scale-[0.98]'
                      : 'bg-[#0B1E3F] hover:bg-[#16386b] text-white active:scale-[0.98]'
                  }`}
                >
                  <span>{isGerman ? 'Direkt zur Online-Kasse' : 'Proceed to Online Checkout'}</span>
                  <ArrowRight size={14} />
                </button>

                {!isMovMet && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-900 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-amber-800">
                      <span>⚠️ {isGerman ? 'Mindestbestellwert: 150,00 € netto' : 'Min. Order Value: €150.00 net'}</span>
                      <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded font-mono">{movProgress}%</span>
                    </div>
                    <p className="text-amber-800">
                      {isGerman
                        ? `Noch ${formatPrice(amountToMov)} netto zur Erfüllung des Mindestbestellwerts.`
                        : `Remaining ${formatPrice(amountToMov)} net to fulfill wholesale MOV.`}
                    </p>
                    <button
                      type="button"
                      onClick={handleAutoFulfillMov}
                      className="w-full bg-[#00D2C4] hover:bg-[#00baa7] text-[#061224] font-bold py-1.5 px-2 rounded text-xs transition text-center cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>⚡ {isGerman ? `Stückzahl anpassen auf 150 € (+${formatPrice(amountToMov)})` : `Auto-adjust quantity to €150 (+${formatPrice(amountToMov)})`}</span>
                    </button>
                  </div>
                )}

                {!user && (
                  <div className="bg-slate-100 border border-slate-200 rounded p-2 text-[11px] text-slate-700 flex items-center justify-between">
                    <span>🔒 {isGerman ? 'Händler-Login für Kasse erforderlich' : 'Dealer login required for checkout'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate('/login');
                      }}
                      className="text-[#1976d2] hover:underline font-bold"
                    >
                      {isGerman ? 'Anmelden' : 'Login'}
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleGoToCart}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-semibold text-center transition cursor-pointer"
                  >
                    {isGerman ? 'Warenkorb bearbeiten' : 'Edit Cart'}
                  </button>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-semibold text-center transition cursor-pointer"
                  >
                    {isGerman ? 'Weiter einkaufen' : 'Continue Shopping'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
