import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, ChevronRight, Lock } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{isGerman ? 'Datenschutz' : 'Privacy Policy'}</span>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {isGerman ? 'Datenschutzerklärung (DSGVO)' : 'Privacy Policy (GDPR)'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isGerman
            ? 'Informationen zur Erhebung und Verarbeitung personenbezogener Daten bei BC Accessories GmbH'
            : 'Data protection and privacy guidelines in accordance with the EU General Data Protection Regulation'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 space-y-6 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            1. {isGerman ? 'Verantwortliche Stelle' : 'Data Controller'}
          </h2>
          <p>
            {isGerman
              ? 'Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG) ist die BC Accessories GmbH, Industriestraße 18, 60327 Frankfurt am Main, vertreten durch die Geschäftsführung. E-Mail: datenschutz@bc-accessories.de.'
              : 'The data controller responsible for the processing of personal data on this platform under the EU GDPR is BC Accessories GmbH, Industriestraße 18, 60327 Frankfurt am Main, Germany. Email: datenschutz@bc-accessories.de.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            2. {isGerman ? 'Datenerfassung bei B2B Händlerregistrierung & Bestellungen' : 'Data Collection for B2B Accounts & Orders'}
          </h2>
          <p>
            {isGerman
              ? 'Im Rahmen der Händlerregistrierung und Auftragsabwicklung verarbeiten wir Unternehmensnamen, Rechtsform, USt-IdNr., Kontaktdaten der Ansprechpartner, Rechnungs- und Lieferadressen sowie Zahlungsdaten. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung des Kaufvertrags und vorvertraglicher Maßnahmen.'
              : 'During dealer registration and order fulfillment, we process corporate names, legal forms, VAT IDs, contact person details, addresses, and payment references pursuant to Art. 6(1)(b) GDPR for contractual performance.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            3. {isGerman ? 'Weitergabe an Versanddienstleister & Zahlungsabwickler' : 'Third-Party Logistics & Payment Processors'}
          </h2>
          <p>
            {isGerman
              ? 'Zur Zustellung Ihrer Großhandelsbestellungen übermitteln wir Name und Lieferanschrift an unsere Logistikpartner DHL Paket GmbH und United Parcel Service (UPS) Deutschland S.à r.l. Zur Zahlungsabwicklung bedienen wir uns zertifizierter Zahlungsdienstleister mit 256-Bit SSL-Verschlüsselung (PCI-DSS Level 1).'
              : 'For order dispatch, shipping data is transmitted to logistics providers DHL and UPS. Online payment transactions are securely handled by PCI-DSS certified gateway processors with end-to-end encryption.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            4. {isGerman ? 'SSL- / TLS-Verschlüsselung' : 'SSL / TLS Security Encryption'}
          </h2>
          <p>
            {isGerman
              ? 'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 256-Bit SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.'
              : 'Our website uses industry-standard 256-bit SSL encryption to protect confidential business communications and payment transmissions.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            5. {isGerman ? 'Ihre Rechte (Auskunft, Berichtigung, Löschung)' : 'Your Rights (Access, Rectification, Erasure)'}
          </h2>
          <p>
            {isGerman
              ? 'Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten im Rahmen der gesetzlichen Aufbewahrungsfristen (Art. 15-20 DSGVO).'
              : 'You possess the statutory right to request information, rectification, restriction of processing, or erasure of your personal data at any time pursuant to Articles 15-20 of the GDPR.'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
