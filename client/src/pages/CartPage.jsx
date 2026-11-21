import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { user, isApproved } = useAuth();
  const { addToast } = useToast();
  const isGerman = i18n.language.startsWith('de');

  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalNet,
    vatAmount,
    shippingCostNet,
    totalGross,
    minOrderValue,
    isMovMet,
    amountToMov,
  } = useCart();

  const navigate = useNavigate();

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
      navigate('/login');
      addToast({
        title: isGerman ? 'Händler-Anmeldung erforderlich' : 'Dealer Login Required',
        message: isGerman
          ? 'Bitte melden Sie sich an, um zur Online-Kasse zu gehen.'
          : 'Please log in with a dealer account to proceed to checkout.',
        type: 'info',
      });
      return;
    }
    if (!isApproved) {
      addToast({
        title: isGerman ? 'Konto in Prüfung' : 'Account Under Verification',
        message: isGerman
          ? 'Ihr Händlerkonto wird derzeit geprüft. Der Checkout wird nach Freischaltung aktiv.'
          : 'Your account is pending verification. Checkout will be active once approved.',
        type: 'warning',
      });
      return;
    }
    if (!isMovMet) {
      addToast({
        title: isGerman ? 'Mindestbestellwert nicht erreicht' : 'Minimum Order Value Not Met',
        message: isGerman
          ? `Es fehlen noch ${formatPrice(amountToMov)} netto bis zum Mindestbestellwert von 150,00 €.`
          : `Remaining ${formatPrice(amountToMov)} net to meet the €150.00 MOV.`,
        type: 'warning',
      });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <h1 className="text-xl font-bold text-gray-900">{t('cart.empty')}</h1>
        <p className="text-xs text-gray-500">
          {t('cart.emptyDesc')}
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-[#0B1E3F] text-white text-xs font-bold px-5 py-2 rounded"
        >
          {t('cart.toCatalog')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">{t('cart.title')}</h1>
        <button
          onClick={clearCart}
          className="text-xs text-gray-500 hover:text-red-600 underline cursor-pointer"
        >
          {t('cart.clearCart')}
        </button>
      </div>

      {!isMovMet && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded">
          {t('cart.movMissing')} <strong>{formatPrice(amountToMov)} {isGerman ? 'netto' : 'net'}</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[540px]">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">{t('cart.article')}</th>
                  <th className="py-2.5 px-3 w-28 text-center">{t('cart.qty')}</th>
                  <th className="py-2.5 px-3 w-28 text-right">{t('cart.unitPrice')}</th>
                  <th className="py-2.5 px-3 w-28 text-right">{t('cart.total')}</th>
                  <th className="py-2.5 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((it) => (
                  <tr key={it.product._id || it.product.sku} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <span className="text-[10px] text-gray-400 font-mono block">SKU: {it.product.sku}</span>
                      <Link to={`/product/${it.product._id || it.product.sku}`} className="font-semibold text-gray-900 hover:underline">
                        {isGerman ? it.product.name?.de : it.product.name?.en}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={it.product.moq || 1}
                        value={it.quantity}
                        onChange={(e) => updateQuantity(it.product._id || it.product.sku, parseInt(e.target.value) || 1)}
                        className="w-16 border border-gray-300 rounded p-1 text-center text-xs font-semibold"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-gray-700">
                      {formatPrice(it.unitPriceNet)} *
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#0B1E3F]">
                      {formatPrice(it.totalPriceNet)} *
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => removeFromCart(it.product._id || it.product.sku)}
                        className="text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-gray-200 rounded p-4 space-y-3 text-xs">
          <h3 className="font-bold text-gray-900 uppercase text-[11px] border-b border-gray-200 pb-2">
            {t('cart.orderSummary')}
          </h3>

          <div className="space-y-1.5 text-gray-600">
            <div className="flex justify-between">
              <span>{t('cart.subtotalNet')}</span>
              <span className="font-bold text-gray-900">{formatPrice(totalNet)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.shipping')}</span>
              <span className="font-bold text-gray-900">
                {shippingCostNet === 0 ? t('cart.free') : formatPrice(shippingCostNet)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.vat')}</span>
              <span className="font-bold text-gray-900">{formatPrice(vatAmount)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-gray-900">{t('cart.totalGross')}</span>
              <span className="text-base font-extrabold text-[#0B1E3F]">
                {formatPrice(totalGross)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs ${
              isMovMet && isApproved
                ? 'bg-[#0B1E3F] hover:bg-[#162e5b] text-white active:scale-[0.98]'
                : 'bg-[#0B1E3F] hover:bg-[#162e5b] text-white active:scale-[0.98]'
            }`}
          >
            {t('cart.checkout')}
          </button>

          {!isMovMet && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[11px] text-amber-900 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-amber-800">
                <span>⚠️ {isGerman ? 'Mindestbestellwert: 150,00 € netto' : 'Min. Order Value: €150.00 net'}</span>
                <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded font-mono">{movProgress}%</span>
              </div>
              <p className="text-amber-800">
                {isGerman
                  ? `Noch ${formatPrice(amountToMov)} netto bis zum Mindestbestellwert.`
                  : `Remaining ${formatPrice(amountToMov)} net to meet wholesale MOV.`}
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
            <p className="text-[10px] text-gray-500 text-center">
              🔒 {isGerman ? 'Händler-Login erforderlich für Online-Kasse.' : 'Dealer login required for online checkout.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
