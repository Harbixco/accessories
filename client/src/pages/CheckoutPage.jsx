import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Printer,
  ShoppingBag,
  Lock,
  Truck,
  Check,
} from 'lucide-react';

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { items, totalNet, vatAmount, shippingCostNet, totalGross, clearCart } = useCart();
  const navigate = useNavigate();
  const isGerman = i18n.language?.startsWith('de');

  const [poNumber, setPoNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');

  // Interactive Card Form State
  const [cardHolder, setCardHolder] = useState(user?.companyName || '');
  const [cardNumber, setCardNumber] = useState('4532 8821 9901 3482');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('842');

  const formatPrice = (val) =>
    isGerman ? `${val.toFixed(2).replace('.', ',')} €` : `€${val.toFixed(2)}`;

  // Auto-format card number with spaces every 4 digits
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      raw = raw.substring(0, 2) + '/' + raw.substring(2);
    }
    setCardExpiry(raw);
  };

  // Card brand detection
  const cleanNum = cardNumber.replace(/\s/g, '');
  const isVisa = cleanNum.startsWith('4');
  const isMastercard = cleanNum.startsWith('5') || cleanNum.startsWith('2');

  const getPaymentMethodLabel = (methodKey) => {
    switch (methodKey) {
      case 'card':
        return isGerman ? 'Kreditkarte (Online bezahlt via 3D Secure)' : 'Credit Card (Paid Online via 3D Secure)';
      case 'paypal':
        return isGerman ? 'PayPal Express (Online bezahlt)' : 'PayPal Express (Paid Online)';
      case 'sofort':
        return isGerman ? 'Sofortüberweisung (Online bezahlt)' : 'Instant Banking (Paid Online)';
      case 'sepa':
        return isGerman ? 'SEPA-Lastschrift' : 'SEPA Direct Debit';
      case 'invoice':
        return isGerman ? 'Kauf auf Rechnung (14 Tage Ziel)' : 'Purchase on Invoice (14 Days Net)';
      case 'prepayment':
      default:
        return isGerman ? 'Vorkasse / Banküberweisung' : 'Prepayment / Bank Transfer';
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const resolvedPaymentMethod = getPaymentMethodLabel(paymentMethod);

    try {
      const orderPayload = {
        poNumber,
        paymentMethod: resolvedPaymentMethod,
        notes,
        items: items.map((i) => ({
          productId: i.product._id || i.product.sku,
          sku: i.product.sku,
          quantity: i.quantity,
        })),
        shippingAddress: user?.shippingAddress || {
          companyName: user?.companyName,
          contactName: user?.contactName,
          street: user?.billingAddress?.street || 'Hauptstraße 1',
          postalCode: user?.billingAddress?.postalCode || '60327',
          city: user?.billingAddress?.city || 'Frankfurt',
          country: 'Germany',
        },
      };

      const res = await axios.post('/api/orders', orderPayload);
      if (res.data.success) {
        setSuccessOrder(res.data.order);
        clearCart();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isGerman ? 'Bestellung konnte nicht übermittelt werden.' : 'Order could not be submitted.')
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN (WITH PRINTABLE FORMAL B2B PRO-FORMA INVOICE)
  if (successOrder) {
    const isOnline = ['card', 'paypal', 'sofort'].includes(paymentMethod);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isGerman ? 'Bestellung erfolgreich abgeschlossen & bezahlt!' : 'Order Successfully Completed & Paid!'}
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            {isGerman
              ? 'Vielen Dank für Ihre Großbestellung. Die Zahlungsbestätigung und der Lieferschein wurden erfasst.'
              : 'Thank you for your order. A formal pro-forma confirmation has been recorded.'}
          </p>
        </div>

        {/* PRINTABLE B2B INVOICE RECEIPT BOX */}
        <div className="bg-white border border-gray-300 rounded p-6 shadow-xs space-y-4 text-xs">
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <div>
              <img src="/logo.jpg" alt="BC Accessories" className="h-10 w-auto object-contain mb-1" />
              <p className="text-[10px] text-gray-400">BC Accessories GmbH • Großhandel für Mobilfunkzubehör</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                {isGerman ? 'Auftragsbestätigung' : 'Order Confirmation'}
              </span>
              <strong className="text-sm font-mono text-gray-900 block mt-0.5">
                {successOrder.orderNumber}
              </strong>
              <span className="text-[10px] text-gray-500">
                {new Date().toLocaleDateString(isGerman ? 'de-DE' : 'en-US')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-gray-100 pb-4">
            <div>
              <span className="font-bold text-gray-500 block text-[10px] uppercase">{isGerman ? 'Rechnungsempfänger' : 'B2B Customer'}</span>
              <strong className="text-gray-900 block">{user?.companyName}</strong>
              <span className="text-gray-600 block">{user?.contactName}</span>
              <span className="text-gray-500 font-mono text-[11px] block">USt-IdNr.: {user?.vatId || 'DE345892101'}</span>
            </div>
            <div className="sm:text-right space-y-1">
              <div>
                <span className="text-gray-500 text-[10px]">{isGerman ? 'Zahlungsart:' : 'Payment Method:'}</span>
                <p className="font-semibold text-gray-800">{successOrder.paymentMethod}</p>
              </div>
              <div>
                <span className="text-gray-500 text-[10px]">{isGerman ? 'Status:' : 'Status:'}</span>
                <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  <Check size={12} />
                  <span>{isOnline ? (isGerman ? 'Online bezahlt (Verifiziert)' : 'Paid Online (Verified)') : (isGerman ? 'Erfasst' : 'Recorded')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Items Table in Confirmation */}
          <div className="border border-gray-200 rounded overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[480px]">
              <thead className="bg-gray-50 text-[10px] text-gray-600 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-2 px-3">{isGerman ? 'Artikel' : 'Article'}</th>
                  <th className="py-2 px-3 text-center">{isGerman ? 'Menge' : 'Qty'}</th>
                  <th className="py-2 px-3 text-right">{isGerman ? 'Einzelpreis netto' : 'Unit Price Net'}</th>
                  <th className="py-2 px-3 text-right">{isGerman ? 'Gesamt netto' : 'Total Net'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 tabular-nums">
                {successOrder.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3">
                      <span className="font-semibold text-gray-800 block">
                        {isGerman ? it.name?.de : it.name?.en}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {it.sku}</span>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-gray-700">{it.quantity}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{formatPrice(it.unitPriceNet)}</td>
                    <td className="py-2 px-3 text-right font-bold text-[#0B1E3F]">{formatPrice(it.totalPriceNet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-200 max-w-xs ml-auto tabular-nums">
            <div className="flex justify-between">
              <span>{isGerman ? 'Warenwert netto:' : 'Goods total net:'}</span>
              <strong className="text-gray-900">{formatPrice(successOrder.totalNet)}</strong>
            </div>
            <div className="flex justify-between">
              <span>{isGerman ? 'zzgl. 19% MwSt.:' : '19% VAT:'}</span>
              <strong className="text-gray-900">{formatPrice(successOrder.vatAmount)}</strong>
            </div>
            <div className="flex justify-between">
              <span>{isGerman ? 'Versand (DHL Express):' : 'Shipping (DHL Express):'}</span>
              <strong className="text-gray-900">{formatPrice(successOrder.shippingCostNet)}</strong>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm">
              <strong className="text-gray-900">{isGerman ? 'Endsumme brutto:' : 'Grand Total Gross:'}</strong>
              <strong className="text-base text-[#0B1E3F] font-black">{formatPrice(successOrder.totalGross)}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-center items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold px-4 py-2.5 rounded transition inline-flex items-center space-x-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Printer size={14} />
            <span>{isGerman ? 'Beleg / Rechnung drucken' : 'Print Invoice Receipt'}</span>
          </button>
          <Link
            to="/"
            className="bg-gradient-to-b from-[#102a54] to-[#0B1E3F] hover:from-[#16386b] hover:to-[#102a54] text-white text-xs font-bold px-5 py-2.5 rounded transition inline-flex items-center space-x-1.5 active:scale-[0.98] shadow-xs"
          >
            <ShoppingBag size={14} />
            <span>{isGerman ? 'Zurück zum Sortiment' : 'Back to Products'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
        {t('checkout.title')}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          {/* PO / Commission Reference */}
          <div className="bg-white p-4 rounded border border-gray-200 space-y-1.5">
            <label className="text-xs font-bold text-gray-800 block">
              {t('checkout.poLabel')}
            </label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder={t('checkout.poPlaceholder')}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* ONLINE & B2B PAYMENT METHODS */}
          <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                {t('checkout.paymentMethod')}
              </label>
              <span className="text-[10px] text-gray-500 flex items-center space-x-1">
                <Lock size={11} className="text-emerald-600" />
                <span>256-Bit SSL • 3D-Secure 2.0</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* 1. Credit / Debit Card (Online Payment) with interactive detection */}
              <label
                className={`flex flex-col p-3 rounded border cursor-pointer transition ${
                  paymentMethod === 'card'
                    ? 'border-[#0B1E3F] bg-blue-50/40 ring-1 ring-[#0B1E3F]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div>
                      <strong className="block text-gray-900">{t('checkout.payOnlineCard')}</strong>
                      <span className="text-[11px] text-gray-500">{t('checkout.payOnlineCardDesc')}</span>
                    </div>
                  </div>

                  {/* Dynamic Card Brand Lighting Badges */}
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold">
                    <span
                      className={`border rounded px-1.5 py-0.5 transition ${
                        isVisa
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs font-extrabold'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      VISA
                    </span>
                    <span
                      className={`border rounded px-1.5 py-0.5 transition ${
                        isMastercard
                          ? 'border-orange-500 bg-orange-500 text-white shadow-xs font-extrabold'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      MC
                    </span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-3 pt-3 border-t border-blue-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="col-span-2">
                      <label className="text-[10px] text-gray-600 block mb-0.5">{t('checkout.cardHolder')}</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Company or Authorized Buyer"
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white text-gray-800"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-gray-600 block mb-0.5">{t('checkout.cardNumber')}</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 8821 9901 3482"
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white text-gray-800 font-mono tracking-wider tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-0.5">{t('checkout.cardExpiry')}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white text-gray-800 text-center font-mono tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-0.5">{t('checkout.cardCvc')}</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white text-gray-800 text-center font-mono"
                        required
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* 2. PayPal Express */}
              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition ${
                  paymentMethod === 'paypal'
                    ? 'border-[#0B1E3F] bg-blue-50/40 ring-1 ring-[#0B1E3F]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  <div>
                    <strong className="block text-gray-900">{t('checkout.payPaypal')}</strong>
                    <span className="text-[11px] text-gray-500">{t('checkout.payPaypalDesc')}</span>
                  </div>
                </div>
                <span className="font-extrabold text-blue-900 italic text-sm">PayPal</span>
              </label>

              {/* 3. Instant Online Banking (Sofort / Klarna) */}
              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition ${
                  paymentMethod === 'sofort'
                    ? 'border-[#0B1E3F] bg-blue-50/40 ring-1 ring-[#0B1E3F]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'sofort'}
                    onChange={() => setPaymentMethod('sofort')}
                  />
                  <div>
                    <strong className="block text-gray-900">{t('checkout.paySofort')}</strong>
                    <span className="text-[11px] text-gray-500">{t('checkout.paySofortDesc')}</span>
                  </div>
                </div>
                <span className="font-bold text-pink-600 text-xs">Klarna / Sofort</span>
              </label>

              {/* 4. Purchase on Invoice (14 Days Net) */}
              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition ${
                  paymentMethod === 'invoice'
                    ? 'border-[#0B1E3F] bg-blue-50/40 ring-1 ring-[#0B1E3F]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'invoice'}
                    onChange={() => setPaymentMethod('invoice')}
                  />
                  <div>
                    <strong className="block text-gray-900">{t('checkout.payInvoiceTitle')}</strong>
                    <span className="text-[11px] text-gray-500">{t('checkout.payInvoiceDesc')}</span>
                  </div>
                </div>
                <span className="text-[11px] text-gray-500 font-semibold">14 Days</span>
              </label>

              {/* 5. Prepayment (Vorkasse) */}
              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition ${
                  paymentMethod === 'prepayment'
                    ? 'border-[#0B1E3F] bg-blue-50/40 ring-1 ring-[#0B1E3F]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'prepayment'}
                    onChange={() => setPaymentMethod('prepayment')}
                  />
                  <div>
                    <strong className="block text-gray-900">{t('checkout.payPrepaymentTitle')}</strong>
                    <span className="text-[11px] text-gray-500">{t('checkout.payPrepaymentDesc')}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Shipping Instructions Notes */}
          <div className="bg-white p-4 rounded border border-gray-200 space-y-1.5">
            <label className="text-xs font-bold text-gray-800 block">
              {t('checkout.notesLabel')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('checkout.notesPlaceholder')}
              className="w-full text-xs p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Instant Online Payment Submission */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-50 rounded border border-gray-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
              {t('checkout.summaryTitle')}
            </h3>

            <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 text-xs">
              {items.map((it) => (
                <div key={it.product._id || it.product.sku} className="py-1.5 flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 line-clamp-1">
                      {isGerman ? it.product.name?.de : it.product.name?.en}
                    </p>
                    <p className="text-[10px] text-gray-400 tabular-nums">
                      {it.quantity} × {formatPrice(it.unitPriceNet)}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 tabular-nums">{formatPrice(it.totalPriceNet)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-2.5 space-y-1.5 text-xs text-gray-600 tabular-nums">
              <div className="flex justify-between">
                <span>{t('checkout.goodsNet')}</span>
                <span className="font-bold text-gray-900">{formatPrice(totalNet)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('checkout.vat19')}</span>
                <span className="font-bold text-gray-900">{formatPrice(vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('checkout.shipping')}</span>
                <span className="font-bold text-gray-900">
                  {shippingCostNet === 0 ? (isGerman ? 'Kostenlos' : 'Free') : formatPrice(shippingCostNet)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">{t('checkout.totalGross')}</span>
                <span className="text-base font-extrabold text-[#0B1E3F]">{formatPrice(totalGross)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-[#102a54] to-[#0B1E3F] hover:from-[#16386b] hover:to-[#102a54] text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98] shadow-xs"
            >
              <CreditCard size={14} />
              <span>
                {loading
                  ? t('checkout.submitting')
                  : ['card', 'paypal', 'sofort'].includes(paymentMethod)
                  ? (isGerman ? `Jetzt online bezahlen (${formatPrice(totalGross)})` : `Pay Online Now (${formatPrice(totalGross)})`)
                  : t('checkout.submitOrder')}
              </span>
            </button>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-center space-x-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>3D Secure 2.0</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck size={12} className="text-blue-600" />
                <span>DHL Express</span>
              </span>
            </div>

            <p className="text-[10px] text-gray-500 text-center">
              {t('checkout.legalNotice')}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
