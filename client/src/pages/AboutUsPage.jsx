import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronRight, Award, Truck, CheckCircle2, Users } from 'lucide-react';

const AboutUsPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{isGerman ? 'Über Uns' : 'About Us'}</span>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {isGerman ? 'Über BC Accessories GmbH' : 'About BC Accessories GmbH'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isGerman
            ? 'Ihr verlässlicher B2B Distributor für Smartphone-Zubehör & Endgeräte in Europa'
            : 'Your reliable wholesale distributor for smartphone accessories and devices across Europe'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 space-y-6 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Unsere Mission: Großhandel für Fachhändler neu gedacht' : 'Our Mission: Wholesale Built for Retailers'}
          </h2>
          <p>
            {isGerman
              ? 'Die BC Accessories GmbH mit Sitz in Frankfurt am Main ist einer der führenden deutschen Fachhandelsdistributoren für mobile Endgeräte, Zubehör, Schutzglas und Ladelösungen. Seit über einem Jahrzehnt beliefern wir Reparaturzentren, Elektronikfachmärkte, Filialisten und Online-Händler in Deutschland und ganz Europa.'
              : 'Based in Frankfurt am Main, BC Accessories GmbH is a premier German wholesale distributor specializing in mobile devices, high-end protection, fast-charging hardware, and smartphone accessories for professional resellers and repair centers.'}
          </p>
          <p>
            {isGerman
              ? 'Als reiner B2B-Anbieter konkurrieren wir nicht mit unseren Kunden, sondern unterstützen den Fachhandel mit marktführenden Staffelpreisen, sofortiger Lagerverfügbarkeit und verlässlicher technischer Prüfung.'
              : 'Operating strictly as a B2B wholesale partner, we empower independent dealers with volume-tiered net pricing, verified European stock, and same-day logistics.'}
          </p>
        </section>

        {/* 3 Pillars Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-1.5">
            <Award size={20} className="text-[#0B1E3F]" />
            <strong className="block text-gray-900 font-bold text-xs">
              {isGerman ? '100% Deutsche Handelsware' : 'Certified Retail Stock'}
            </strong>
            <p className="text-[11px] text-gray-500">
              {isGerman
                ? 'Ausschließlich originalverpackte Markenware mit vollem Gewährleistungsanspruch.'
                : 'Genuine brand-packaged merchandise with full 12-month commercial warranty.'}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-1.5">
            <Truck size={20} className="text-[#0B1E3F]" />
            <strong className="block text-gray-900 font-bold text-xs">
              {isGerman ? 'Same-Day Versand bis 14 Uhr' : 'Same-Day Dispatch'}
            </strong>
            <p className="text-[11px] text-gray-500">
              {isGerman
                ? 'Bestellungen bis 14:00 Uhr verlassen unser Frankfurter Zentrallager noch am selben Tag.'
                : 'Orders received by 14:00 CET leave our central facility on the very same day.'}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-1.5">
            <Users size={20} className="text-[#0B1E3F]" />
            <strong className="block text-gray-900 font-bold text-xs">
              {isGerman ? 'Fester B2B Ansprechpartner' : 'Dedicated Account Manager'}
            </strong>
            <p className="text-[11px] text-gray-500">
              {isGerman
                ? 'Persönliche Betreuung für Sonderkontingente, Filialbelieferung und Projektpreise.'
                : 'Personal assistance for bulk quotations, store replenishment, and project pricing.'}
            </p>
          </div>
        </div>

        <section className="space-y-2 pt-2 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-1">
            {isGerman ? 'Zentrallager & Logistikzentrum Frankfurt am Main' : 'Central Logistics Facility Frankfurt'}
          </h2>
          <p>
            {isGerman
              ? 'Unser hochmodernes Logistikzentrum in Frankfurt am Main umfasst über 3.500 m² Lagerfläche mit permanenter Bestandsführung. Durch die unmittelbare Nähe zum Frankfurter Flughafen und den Frachtzentren von DHL Express und UPS garantieren wir kürzeste Laufzeiten in der gesamten D-A-CH-Region und Westeuropa.'
              : 'Our state-of-the-art 3,500 m² distribution hub in Frankfurt am Main ensures permanent stock availability and rapid transit times across Germany, Austria, Switzerland, and Western Europe.'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
