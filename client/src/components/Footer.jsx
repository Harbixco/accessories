import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <footer className="bg-[#0B1E3F] border-t border-[#1a3560] text-slate-300 text-xs mt-14">
      {/* Main 4-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: INFORMATION */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {t('footer.col1Title')}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li>
              <Link to="/terms" className="hover:text-white transition-colors duration-150">
                {t('footer.terms')}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors duration-150">
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <Link to="/imprint" className="hover:text-white transition-colors duration-150">
                {t('footer.imprint')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors duration-150">
                {t('footer.about')}
              </Link>
            </li>
            <li>
              <Link to="/shipping-payment" className="hover:text-white transition-colors duration-150">
                {t('footer.shippingPayment')}
              </Link>
            </li>
            <li>
              <Link to="/cancellation" className="hover:text-white transition-colors duration-150">
                {t('footer.withdrawal')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 2: SERVICE & SUPPORT */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {t('footer.col2Title')}
          </h4>
          <p className="text-slate-300 text-xs">
            {t('footer.supportUnder')}
          </p>
          <div>
            <a
              href="tel:+496924753910"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#00d2c4] transition-colors tracking-wide"
            >
              <Phone className="w-3.5 h-3.5 text-[#00d2c4] shrink-0" />
              <span>+49 (0) 69 2475 3910</span>
            </a>
          </div>
          <div>
            <a
              href="mailto:b2b@bc-accessories.de"
              className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-[#00d2c4] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#00d2c4] shrink-0" />
              <span>b2b@bc-accessories.de</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t('footer.hours')}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Industriestraße 18, 60327 Frankfurt am Main</span>
          </div>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs text-[#00d2c4] hover:text-white font-medium transition-colors"
            >
              <span>{t('footer.contactForm')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Col 3: PAYMENT & SHIPPING */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">
            {t('footer.col3Title')}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2c4] shrink-0" />
              <span>{t('footer.payInvoice')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2c4] shrink-0" />
              <span>{t('footer.payPrepayment')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2c4] shrink-0" />
              <span>{t('footer.payDebit')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2c4] shrink-0" />
              <span>{t('footer.payCard')}</span>
            </li>
          </ul>

          <div className="pt-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5">
              {t('footer.shippingTitle')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
              {t('footer.shippingDesc')}
            </p>
            {/* Authentic B2B Trust & Logistics Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-slate-200 border border-white/15">
                DHL Express
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-slate-200 border border-white/15">
                UPS Express
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-slate-200 border border-white/15">
                SEPA B2B
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-slate-200 border border-white/15">
                PayPal
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-slate-200 border border-white/15">
                Visa / MC
              </span>
            </div>
          </div>
        </div>

        {/* Col 4: DEALER SERVICES */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">
            {t('footer.col4Title')}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('footer.aboutText')}
          </p>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#09172e] py-4 px-4 sm:px-6 lg:px-8 bg-[#071428] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-400 text-center sm:text-left">
            Copyright © 2026 BC Accessories
          </p>
          <p className="font-medium text-slate-400 text-center sm:text-right">
            Design by{' '}
            <a
              href="https://www.veltrixhub.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#00d2c4] font-semibold underline underline-offset-2 transition-colors"
            >
              Veltrix Hub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
