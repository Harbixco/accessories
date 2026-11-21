import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
} from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  return (
    <footer className="bg-[#0e2245] border-t border-[#1a3560] text-slate-300 text-xs mt-14">
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

        {/* Col 2: SERVICE HOTLINE */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {t('footer.col2Title')}
          </h4>
          <p className="text-slate-300 text-xs mb-1">
            {t('footer.supportUnder')}
          </p>
          <p className="text-sm font-extrabold text-white tracking-wide">
            +49 (0) 69 98765432
          </p>
          <p className="text-[11px] text-slate-400">
            {t('footer.hours')}
          </p>
          <div className="pt-2">
            <Link to="/contact" className="text-xs text-[#00d2c4] hover:underline font-medium hover:text-white transition-colors">
              {t('footer.contactForm')} →
            </Link>
          </div>
        </div>

        {/* Col 3: PAYMENT METHODS & SHIPPING PARTNERS */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {t('footer.col3Title')}
          </h4>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• {t('footer.payInvoice')}</li>
            <li>• {t('footer.payPrepayment')}</li>
            <li>• {t('footer.payDebit')}</li>
            <li>• Online-Kreditkarte & PayPal Express</li>
          </ul>

          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider pt-3 mb-1">
            {t('footer.shippingTitle')}
          </h4>
          <p className="text-xs text-slate-300">
            {t('footer.shippingDesc')}
          </p>
        </div>

        {/* Col 4: DEALER SERVICES & SOCIAL MEDIA */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {t('footer.col4Title')}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('footer.aboutText')}
          </p>
          <div className="pt-2 space-y-1">
            <Link to="/register" className="block text-xs font-bold text-[#00d2c4] hover:underline transition-colors">
              {t('footer.openAccount')}
            </Link>
            <Link to="/quick-order" className="block text-xs text-slate-300 hover:text-white transition-colors">
              {t('footer.quickOrder')}
            </Link>
            <Link to="/rma" className="block text-xs text-slate-300 hover:text-white transition-colors">
              {t('footer.rmaPortal')}
            </Link>
          </div>

          {/* Social Media Logos */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              {isGerman ? 'Folgen Sie uns' : 'Follow Us'}
            </span>
            <div className="flex items-center space-x-2.5">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded bg-white/10 hover:bg-[#00d2c4] border border-white/15 hover:border-[#00d2c4] text-slate-200 hover:text-[#061224] flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded bg-white/10 hover:bg-pink-600 border border-white/15 hover:border-pink-600 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded bg-white/10 hover:bg-[#1877f2] border border-white/15 hover:border-[#1877f2] text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded bg-white/10 hover:bg-[#ff0000] border border-white/15 hover:border-[#ff0000] text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded bg-white/10 hover:bg-black border border-white/15 hover:border-black text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                title="X (Twitter)"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#09172e] py-4 px-4 bg-[#071428] text-center text-[11px] text-slate-400">
        <p className="max-w-4xl mx-auto mb-1 text-slate-400">
          {t('footer.disclaimer')}
        </p>
        <p>© {new Date().getFullYear()} BC Accessories GmbH - {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
