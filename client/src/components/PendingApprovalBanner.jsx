import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, Phone, ArrowRight, X } from 'lucide-react';

const PendingApprovalBanner = () => {
  const { user, isLoggedIn, isPending } = useAuth();
  const { i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');
  const [dismissed, setDismissed] = useState(false);

  // Only display if user is logged in as a dealer and their status is 'pending'
  if (!isLoggedIn || !isPending || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Account status" className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-b border-amber-300 text-amber-950 px-4 py-3 transition-all animate-dropdown shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Left: Status Icon and Explanatory Text */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-amber-200/80 border border-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
            <Clock size={16} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <strong className="text-sm font-bold text-gray-900">
                {isGerman
                  ? 'Ihr Fachhändlerkonto wird derzeit geprüft'
                  : 'Your Wholesale Dealer Account is Under Review'}
              </strong>
              <span className="bg-amber-600 text-white text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded tracking-wider shadow-2xs">
                {isGerman ? 'In Prüfung' : 'Pending'}
              </span>
            </div>
            <p className="text-gray-700 text-xs mt-0.5 leading-relaxed">
              {isGerman ? (
                <>
                  Unser B2B-Verifizierungsteam prüft aktuell Ihre Unternehmensdaten und USt-IdNr.{' '}
                  <strong className="font-mono text-gray-900 font-bold">{user?.vatId || 'DE...'}</strong>. 
                  Die Prüfung dauert in der Regel <strong>2 bis 4 Werksstunden</strong>. Sobald die Freischaltung erfolgt ist, 
                  erhalten Sie eine E-Mail und haben sofort Zugriff auf alle Händlereinkaufspreise, Mengenstaffeln und Same-Day Expressversand.
                </>
              ) : (
                <>
                  Our B2B verification team is currently validating your business credentials and VAT ID{' '}
                  <strong className="font-mono text-gray-900 font-bold">{user?.vatId || 'DE...'}</strong>. 
                  Approval typically completes within <strong>2 to 4 business hours</strong>. You will receive an email once approved, 
                  unlocking net wholesale prices, bulk volume tiers, and same-day dispatch.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Quick hotline / expedite action */}
        <div className="flex items-center space-x-3 shrink-0 self-end md:self-center pt-1 md:pt-0">
          <Link
            to="/contact"
            className="bg-[#0B1E3F] hover:bg-[#162e5b] text-white font-bold px-3 py-1.5 rounded text-xs transition flex items-center space-x-1.5 shadow-2xs active:scale-[0.98]"
          >
            <span>{isGerman ? 'Eilprüfung anfragen' : 'Expedite Approval'}</span>
            <ArrowRight size={12} />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-900 p-1 rounded transition cursor-pointer"
            title={isGerman ? 'Hinweis schließen' : 'Dismiss'}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PendingApprovalBanner;
