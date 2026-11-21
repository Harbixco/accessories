import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronRight, Mail, Phone, MapPin, Scale } from 'lucide-react';

const LegalNoticePage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{isGerman ? 'Impressum' : 'Legal Notice / Imprint'}</span>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {isGerman ? 'Impressum (§ 5 TMG / DDG)' : 'Legal Notice / Imprint'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isGerman ? 'Gesetzliche Anbieterkennzeichnung der BC Accessories GmbH' : 'Legal disclosure and commercial registry details'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 space-y-6 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Angaben gemäß § 5 TMG / DDG' : 'Company Details'}
          </h2>
          <p className="font-bold text-gray-900 text-sm">BC Accessories GmbH</p>
          <p>Großhandelszentrum für Mobilfunkzubehör & Endgeräte</p>
          <p>Industriestraße 18</p>
          <p>60327 Frankfurt am Main, Germany</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Vertretungsberechtigte Geschäftsführung' : 'Managing Directors'}
          </h2>
          <p><strong>Geschäftsführer:</strong> Michael Schmidt, David Weber</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Kontakt' : 'Contact Information'}
          </h2>
          <p><strong>Telefon Hotline:</strong> +49 (0) 69 2475 3910 (Mo-Fr 09:00 - 16:00 CET)</p>
          <p><strong>E-Mail:</strong> info@bc-accessories.de / b2b@bc-accessories.de</p>
          <p><strong>Internet:</strong> https://bc-accessories.de</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Registereintrag' : 'Commercial Register'}
          </h2>
          <p>Eintragung im Handelsregister.</p>
          <p><strong>Registergericht:</strong> Amtsgericht Frankfurt am Main</p>
          <p><strong>Registernummer:</strong> HRB 114829</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Umsatzsteuer-Identifikationsnummer' : 'VAT Identification'}
          </h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          </p>
          <p className="font-mono font-bold text-gray-900 text-sm">DE 345 892 101</p>
          <p><strong>WEEE-Reg.-Nr. DE:</strong> 74819203</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Verbraucherstreitbeilegung / B2B Hinweis' : 'Dispute Resolution (B2B Notice)'}
          </h2>
          <p>
            {isGerman
              ? 'Unser Waren- und Dienstleistungsangebot richtet sich ausschließlich an gewerbliche Kunden, Wiederverkäufer, Unternehmen und juristische Personen des öffentlichen Rechts (§ 14 BGB). Eine Teilnahme an Verbraucherschlichtungsverfahren findet nicht statt.'
              : 'Our assortment and services are exclusively intended for commercial entities, registered companies, and authorized B2B resellers (§ 14 German Civil Code). We do not participate in consumer dispute resolution procedures.'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalNoticePage;
