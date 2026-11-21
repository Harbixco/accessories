import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Printer,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Package,
  RotateCcw,
  Truck,
  Check,
  Building,
} from 'lucide-react';

const RmaPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  const [orderNr, setOrderNr] = useState('');
  const [sku, setSku] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [reason, setReason] = useState('defect');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [rmaResult, setRmaResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const generatedRma = `RMA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setRmaResult({
        rmaNumber: generatedRma,
        orderNr,
        sku,
        serialNumber,
        reason,
        description,
        date: new Date().toLocaleDateString(isGerman ? 'de-DE' : 'en-US'),
      });
      setLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setRmaResult(null);
    setOrderNr('');
    setSku('');
    setSerialNumber('');
    setDescription('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{t('rma.title')}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t('rma.title')}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {t('rma.subtitle')}
        </p>
      </div>

      {/* 4-Step RMA Process Graphic */}
      <div className="bg-white border border-gray-200 rounded p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1 border-l-2 border-[#0B1E3F] pl-3">
          <strong className="block text-gray-900 font-bold text-[11px]">{t('rma.step1Title')}</strong>
          <span className="text-[10px] text-gray-500">{t('rma.step1Desc')}</span>
        </div>
        <div className="space-y-1 border-l-2 border-[#1976d2] pl-3">
          <strong className="block text-gray-900 font-bold text-[11px]">{t('rma.step2Title')}</strong>
          <span className="text-[10px] text-gray-500">{t('rma.step2Desc')}</span>
        </div>
        <div className="space-y-1 border-l-2 border-emerald-600 pl-3">
          <strong className="block text-gray-900 font-bold text-[11px]">{t('rma.step3Title')}</strong>
          <span className="text-[10px] text-gray-500">{t('rma.step3Desc')}</span>
        </div>
        <div className="space-y-1 border-l-2 border-[#00d2c4] pl-3">
          <strong className="block text-gray-900 font-bold text-[11px]">{t('rma.step4Title')}</strong>
          <span className="text-[10px] text-gray-500">{t('rma.step4Desc')}</span>
        </div>
      </div>

      {/* RMA Form or Success Confirmation */}
      {rmaResult ? (
        <div className="bg-white border border-gray-300 rounded p-6 space-y-6 shadow-xs">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('rma.successTitle')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('rma.successDesc')}
            </p>
            <div className="inline-block bg-gray-100 border border-gray-300 rounded px-4 py-2 font-mono text-base font-extrabold text-[#0B1E3F]">
              {rmaResult.rmaNumber}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs space-y-2 max-w-lg mx-auto">
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">{isGerman ? 'Datum:' : 'Date:'}</span>
              <strong className="text-gray-900">{rmaResult.date}</strong>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">{t('rma.orderNr')}</span>
              <strong className="text-gray-900">{rmaResult.orderNr}</strong>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">{t('rma.sku')}</span>
              <strong className="text-gray-900 font-mono">{rmaResult.sku}</strong>
            </div>
            {rmaResult.serialNumber && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">{t('rma.serial')}</span>
                <strong className="text-gray-900 font-mono">{rmaResult.serialNumber}</strong>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="text-gray-500">{t('rma.reason')}</span>
              <strong className="text-gray-800">{rmaResult.reason}</strong>
            </div>
            <div className="pt-2 text-gray-600 text-[11px] leading-relaxed">
              <strong>{isGerman ? 'Fehlerangabe:' : 'Defect note:'}</strong> {rmaResult.description}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 max-w-lg mx-auto leading-relaxed">
            <strong className="block mb-1 font-bold">{isGerman ? 'Rücksendeadresse für Fachhändler:' : 'Wholesale Return Address:'}</strong>
            <p className="text-[11px]">BC Accessories GmbH • Retourenzentrum • Industriestraße 18 • 60327 Frankfurt am Main, Germany</p>
          </div>

          <div className="flex justify-center items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>{t('rma.printLabel')}</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-[#0B1E3F] hover:bg-[#162e5b] text-white text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
            >
              {t('rma.newClaim')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            {t('rma.formTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {t('rma.orderNr')}
              </label>
              <input
                type="text"
                required
                value={orderNr}
                onChange={(e) => setOrderNr(e.target.value)}
                placeholder="e.g. BCA-2026-44812"
                className="w-full border border-gray-300 rounded p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {t('rma.sku')}
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. BCA-APW-12AL42"
                className="w-full border border-gray-300 rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {t('rma.serial')}
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="IMEI / SN1293810293"
                className="w-full border border-gray-300 rounded p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {t('rma.reason')}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-xs bg-white text-gray-800"
              >
                <option value="Defekt bei Lieferung (DOA)">{t('rma.reasonDefect')}</option>
                <option value="Falschlieferung">{t('rma.reasonWrong')}</option>
                <option value="Gewährleistungsfall">{t('rma.reasonWarranty')}</option>
                <option value="Transportschaden">{t('rma.reasonDamage')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {t('rma.description')}
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isGerman ? 'Genaue Fehlerbeschreibung angeben (z.B. Lädt nicht, Display flackert, Falsche Farbe geliefert...)' : 'Please specify exact defect behavior...'}
              className="w-full border border-gray-300 rounded p-2 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#0B1E3F] hover:bg-[#162e5b] text-white px-6 py-2.5 rounded text-xs font-bold transition cursor-pointer active:scale-[0.98]"
            >
              {loading ? t('rma.submitting') : t('rma.submit')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RmaPage;
