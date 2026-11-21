import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RotateCcw, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';

const WithdrawalPolicyPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{isGerman ? 'Widerrufsbelehrung' : 'Return & Withdrawal Policy'}</span>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {isGerman ? 'Widerrufs- und Rückgabebelehrung (B2B)' : 'Return & Withdrawal Policy (B2B Wholesale)'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isGerman
            ? 'Regelungen zu Widerruf, Retouren und Kulanzrücknahmen für gewerbliche Kunden'
            : 'Provisions regarding return merchandise authorization and commercial cancellations'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 space-y-6 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Ausschluss des gesetzlichen Widerrufsrechts für Unternehmer' : 'Statutory Exclusion of Consumer Right of Withdrawal'}
          </h2>
          <p>
            {isGerman
              ? 'Das Angebot im Online-Großhandelsportal der BC Accessories GmbH richtet sich ausschließlich an gewerbliche Kunden, Unternehmer (§ 14 BGB), juristische Personen des öffentlichen Rechts sowie öffentlich-rechtliche Sondervermögen. Ein gesetzliches Widerrufsrecht gemäß § 312g i. V. m. § 355 BGB (Verbraucher-Widerrufsrecht im Fernabsatz) besteht im B2B-Handelsverkehr ausdrücklich nicht.'
              : 'The commercial offer on this wholesale distribution portal is directed exclusively to registered businesses, corporations, and commercial resellers (§ 14 German Civil Code). A statutory right of withdrawal pursuant to § 312g and § 355 BGB does not apply to commercial B2B transactions.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Freiwillige Kulanzrücknahme & Falschbestellungen' : 'Goodwill Returns & Discretionary Exchanges'}
          </h2>
          <p>
            {isGerman
              ? 'In Einzelfällen räumen wir registrierten Fachhändlern nach vorheriger schriftlicher Abstimmung die Möglichkeit einer Kulanzrücknahme ein. Voraussetzung ist, dass die Ware ungeöffnet, unbeschädigt, in Originalverpackung und frei von Händleretiketten ist. Bei Kulanzrücknahmen behalten wir uns eine Wiedereinlagerungsgebühr von bis zu 10 % des Netto-Warenwerts vor.'
              : 'In selected circumstances and following prior written authorization, BC Accessories GmbH may accept discretionary returns. Items must be unopened, in pristine original manufacturer packaging, and free of dealer markings. A restocking fee of up to 10% may apply.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Gewährleistung & Mängelrüge über unser digitales RMA-Portal' : 'Warranty Claims & Defect Management via RMA Portal'}
          </h2>
          <p>
            {isGerman
              ? 'Sollte ein gelieferter Artikel einen technischen Defekt aufweisen (DOA - Dead on Arrival), ein Transportschaden vorliegen oder eine Falschlieferung erfolgt sein, wickeln wir diesen Anspruch schnell und unbürokratisch über unser digitales RMA-Portal ab.'
              : 'For hardware defects on arrival (DOA), transport damages, or incorrect consignments, please submit a formal claim directly through our online RMA & Returns portal.'}
          </p>
          <div className="pt-2">
            <Link
              to="/rma"
              className="inline-flex items-center space-x-1.5 bg-[#0B1E3F] hover:bg-[#162e5b] text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs"
            >
              <span>{isGerman ? 'Zum digitalen RMA-Portal' : 'Go to Digital RMA Portal'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WithdrawalPolicyPage;
