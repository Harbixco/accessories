import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, CreditCard, ChevronRight, ShieldCheck, Check } from 'lucide-react';

const ShippingPaymentPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{isGerman ? 'Versand und Zahlung' : 'Shipping & Payment'}</span>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {isGerman ? 'Versand- und Zahlungsbedingungen' : 'Shipping & Payment Information'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isGerman
            ? 'Transparente Konditionen für den gewerblichen Großhandel in Deutschland & Europa'
            : 'Clear logistics and payment terms for European commercial trade'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 space-y-6 text-xs text-gray-700 leading-relaxed">
        {/* Shipping Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? '1. Versandpartner & Frachtkosten' : '1. Shipping Partners & Freight Costs'}
          </h2>
          <p>
            {isGerman
              ? 'Der Versand erfolgt versichert und nachverfolgbar über unsere Logistikpartner DHL Paket und UPS Express direkt ab deutschem Zentrallager.'
              : 'All wholesale orders are dispatched insured with trackable consignments via DHL Express or UPS Express.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
              <strong className="block text-gray-900 font-bold">{isGerman ? 'Deutschland (National)' : 'Germany (Domestic)'}</strong>
              <p className="text-[11px] text-gray-600">
                • Standardversand (netto): <strong>9,90 €</strong><br />
                • <strong>Versandkostenfrei</strong> ab <strong>500,00 €</strong> netto Warenwert.<br />
                • Regellaufzeit: 24–48 Stunden. Same-Day Versand bei Bestellung bis 14:00 Uhr.
              </p>
            </div>

            <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
              <strong className="block text-gray-900 font-bold">{isGerman ? 'Europäische Union (EU)' : 'European Union (EU)'}</strong>
              <p className="text-[11px] text-gray-600">
                • EU-Standardversand (netto): <strong>14,90 €</strong><br />
                • Steuerfreie innergemeinschaftliche Lieferung (Reverse Charge mit USt-IdNr.).<br />
                • Regellaufzeit: 2–4 Werktage.
              </p>
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? '2. Zahlungsarten für Fachhändler' : '2. Supported Payment Methods'}
          </h2>

          <div className="space-y-2 text-xs">
            <div className="p-3 border border-gray-200 rounded bg-gray-50 flex items-start gap-2.5">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">{isGerman ? 'Online-Kreditkarte & Debitkarte (Visa, Mastercard)' : 'Credit / Debit Card (Visa, Mastercard)'}</strong>
                <p className="text-[11px] text-gray-500">
                  {isGerman
                    ? 'Sofortige 256-Bit SSL verschlüsselte Online-Zahlung mit 3D-Secure 2.0 Authentifizierung für maximale Sicherheit.'
                    : 'Instant 256-bit encrypted online checkout with 3D-Secure 2.0 verification for authorized buyers.'}
                </p>
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded bg-gray-50 flex items-start gap-2.5">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">PayPal Express</strong>
                <p className="text-[11px] text-gray-500">
                  {isGerman
                    ? 'Schnelle und unkomplizierte Online-Zahlung direkt über Ihr geschäftliches PayPal-Konto mit sofortiger Auftragsfreigabe.'
                    : 'Rapid direct checkout via your corporate PayPal account with immediate order release.'}
                </p>
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded bg-gray-50 flex items-start gap-2.5">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">{isGerman ? 'Sofortüberweisung (Klarna Online-Banking)' : 'Instant Banking (Sofort / Klarna)'}</strong>
                <p className="text-[11px] text-gray-500">
                  {isGerman
                    ? 'Direkte Überweisung über Ihr Online-Banking mit sofortiger Transaktionsbestätigung.'
                    : 'Direct online bank transfer with instant payment receipt and order processing.'}
                </p>
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded bg-gray-50 flex items-start gap-2.5">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">{isGerman ? 'Kauf auf Rechnung (14 Tage Ziel)' : 'Purchase on Invoice (14 Days Net)'}</strong>
                <p className="text-[11px] text-gray-500">
                  {isGerman
                    ? 'Exklusiv für geprüfte Fachhändler und Stammkunden mit eingeräumter Kreditlinie nach erfolgreicher Bonitätsprüfung.'
                    : 'Available for verified B2B retailers and long-term accounts with approved credit line.'}
                </p>
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded bg-gray-50 flex items-start gap-2.5">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">{isGerman ? 'Vorkasse / Banküberweisung' : 'Prepayment / Bank Wire Transfer'}</strong>
                <p className="text-[11px] text-gray-500">
                  {isGerman
                    ? 'Klassische Banküberweisung auf unser deutsches Geschäftskonto. Die Ware wird unmittelbar nach Zahlungseingang versendet.'
                    : 'Traditional bank wire transfer. Consignments are packed and dispatched upon receipt of funds.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingPaymentPage;
