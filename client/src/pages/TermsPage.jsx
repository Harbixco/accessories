import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, ChevronRight, ShieldCheck } from 'lucide-react';

const TermsPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{isGerman ? 'AGB' : 'Terms & Conditions'}</span>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {isGerman ? 'Allgemeine Geschäftsbedingungen (B2B)' : 'Terms & Conditions (B2B Wholesale)'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isGerman
            ? 'Geschäftsbedingungen der BC Accessories GmbH für den gewerblichen Fachhandel'
            : 'General Terms & Conditions of BC Accessories GmbH for commercial trade'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 space-y-6 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 1 {isGerman ? 'Geltungsbereich & Vertragspartner' : 'Scope & Contractual Partners'}
          </h2>
          <p>
            {isGerman
              ? 'Die vorliegenden Allgemeinen Geschäftsbedingungen gelten für alle gegenwärtigen und zukünftigen Geschäftsbeziehungen zwischen der BC Accessories GmbH (nachfolgend „Verkäufer“) und ihren Kunden (nachfolgend „Käufer“ oder „Fachhändler“). Das Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB, d. h. natürliche oder juristische Personen oder rechtsfähige Personengesellschaften, die in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handeln.'
              : 'These General Terms and Conditions apply to all business relations between BC Accessories GmbH ("Seller") and its registered commercial buyers ("Buyer" or "Dealer"). Our assortment is intended exclusively for registered business entities and commercial resellers pursuant to § 14 BGB.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 2 {isGerman ? 'Händlerregistrierung & Konditionen' : 'Dealer Registration & Conditions'}
          </h2>
          <p>
            {isGerman
              ? 'Für die Einsichtnahme in Händlerpreise und die Durchführung von Bestellungen ist eine vorherige Registrierung unter Angabe der gültigen Umsatzsteuer-Identifikationsnummer (USt-IdNr.) sowie gewerblicher Nachweise erforderlich. Es besteht kein Mindestbestellwert (MOV); Bestellungen sind ab Stück 1 möglich.'
              : 'Access to wholesale prices and purchasing requires an approved business account with a verified VAT ID (USt-IdNr.). There is no minimum order value (MOV); orders are accepted starting from 1 unit.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 3 {isGerman ? 'Preise & Zahlungsbedingungen' : 'Prices & Payment Terms'}
          </h2>
          <p>
            {isGerman
              ? 'Alle Preise verstehen sich in Euro rein netto zuzüglich der jeweils gesetzlich geltenden Mehrwertsteuer (derzeit 19 % in Deutschland) und Versandkosten. Für Kunden aus dem EU-Ausland mit gültiger USt-IdNr. erfolgt die Fakturierung steuerfrei im Rahmen der innergemeinschaftlichen Lieferung (Reverse Charge).'
              : 'All stated prices are quoted in Euros net excluding the statutory value-added tax (19% VAT in Germany) and freight costs. Verified EU buyers outside Germany with an active VAT ID are invoiced tax-exempt under the EU Reverse Charge mechanism.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 4 {isGerman ? 'Lieferung, Gefahrübergang & Frachtkosten' : 'Delivery & Passing of Risk'}
          </h2>
          <p>
            {isGerman
              ? 'Die Lieferung erfolgt ab unserem deutschen Zentrallager (Industriestraße 18, 60327 Frankfurt am Main) per DHL oder UPS. Bestellungen werden zügig an den Frachtführer übergeben. Ab einem Netto-Warenwert von 500,00 € liefern wir innerhalb Deutschlands frachtfrei.'
              : 'Shipment takes place from our central warehouse in Frankfurt am Main via DHL or UPS. Orders are processed swiftly and transferred to the carrier. Deliveries within Germany are freight-free for orders exceeding €500.00 net.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 5 {isGerman ? 'Eigentumsvorbehalt' : 'Retention of Title'}
          </h2>
          <p>
            {isGerman
              ? 'Die gelieferte Ware bleibt bis zur vollständigen Bezahlung sämtlicher Forderungen aus der Geschäftsverbindung Eigentum der BC Accessories GmbH (verlängerter Eigentumsvorbehalt gemäß § 449 BGB).'
              : 'The delivered goods remain the property of BC Accessories GmbH until all claims arising from the ongoing business relationship have been fully settled.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 6 {isGerman ? 'Untersuchungs- und Rügepflicht & Gewährleistung' : 'Inspection Duty & Warranty'}
          </h2>
          <p>
            {isGerman
              ? 'Der Käufer hat die Ware unverzüglich nach Empfang gemäß § 377 HGB zu untersuchen und etwaige Mängel oder Falschlieferungen unverzüglich über unser digitales RMA-Portal anzuzeigen. Die Gewährleistungsfrist für Unternehmer beträgt 12 Monate ab Gefahrübergang.'
              : 'The buyer is required to inspect delivered goods immediately pursuant to § 377 of the German Commercial Code (HGB) and report any defects promptly through our RMA portal. The warranty period for commercial buyers is 12 months from dispatch.'}
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            § 7 {isGerman ? 'Gerichtsstand & Anwendbares Recht' : 'Jurisdiction & Governing Law'}
          </h2>
          <p>
            {isGerman
              ? 'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Ausschließlicher Gerichtsstand für alle Streitigkeiten ist Frankfurt am Main.'
              : 'The laws of the Federal Republic of Germany shall apply, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). Exclusive place of jurisdiction is Frankfurt am Main, Germany.'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
