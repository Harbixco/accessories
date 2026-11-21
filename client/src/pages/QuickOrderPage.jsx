import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { fallbackProducts } from '../data/fallbackProducts';
import { ShoppingCart, Check, Trash2, Plus, FileSpreadsheet, Upload, AlertCircle } from 'lucide-react';

const QuickOrderPage = () => {
  const { t, i18n } = useTranslation();
  const { isApproved } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const isGerman = i18n.language?.startsWith('de');

  const [activeTab, setActiveTab] = useState('table'); // 'table' or 'csv'
  const [availableProducts, setAvailableProducts] = useState(fallbackProducts);
  const [rows, setRows] = useState([
    { id: 1, selectedId: '', quantity: 10 },
    { id: 2, selectedId: '', quantity: 10 },
    { id: 3, selectedId: '', quantity: 10 },
    { id: 4, selectedId: '', quantity: 10 },
    { id: 5, selectedId: '', quantity: 10 },
  ]);

  const [csvText, setCsvText] = useState(
    'BCA-APW-12AL42;10\nBCA-SAM-W9L350;5\nBCA-IP16P-1TB-SLV;2\nBCA-ANC-PB-3IN1-B5;20'
  );
  const [csvFeedback, setCsvFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get('/api/products?limit=100');
        if (res.data.success && res.data.products && res.data.products.length > 0) {
          setAvailableProducts(res.data.products);
        }
      } catch (e) {}
    };
    fetchAll();
  }, []);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), selectedId: '', quantity: 10 }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleBulkAdd = () => {
    let count = 0;
    rows.forEach((row) => {
      if (row.selectedId && row.quantity > 0) {
        const product = availableProducts.find(
          (p) => (p._id || p.sku) === row.selectedId
        );
        if (product) {
          addToCart(product, Number(row.quantity), true);
          count++;
        }
      }
    });

    if (count > 0) {
      setSubmitted(true);
      addToast({
        title: isGerman ? 'Schnellbestellung übernommen' : 'Quick Order Added',
        message: isGerman
          ? `${count} Positionen wurden erfolgreich in den Warenkorb gelegt`
          : `Added ${count} items to your shopping cart`,
        type: 'cart',
      });
      setTimeout(() => setSubmitted(false), 1500);
    }
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) return;
    const lines = csvText.split('\n');
    let imported = 0;

    lines.forEach((line) => {
      const parts = line.split(/[;,,\t]/).map((s) => s.trim());
      if (parts.length >= 2) {
        const [sku, qtyStr] = parts;
        const qty = parseInt(qtyStr) || 1;
        const product = availableProducts.find(
          (p) => p.sku?.toLowerCase() === sku.toLowerCase()
        );
        if (product) {
          addToCart(product, qty, false);
          imported++;
        }
      }
    });

    if (imported > 0) {
      setCsvFeedback(
        isGerman
          ? `✓ ${imported} Artikelpositionen erfolgreich in den Warenkorb übernommen!`
          : `✓ Successfully transferred ${imported} items into your shopping cart!`
      );
      addToast({
        title: isGerman ? 'CSV-Import erfolgreich' : 'CSV Import Successful',
        message: isGerman
          ? `${imported} Positionen wurden importiert`
          : `Imported ${imported} line items into cart`,
        type: 'success',
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } else {
      setCsvFeedback(
        isGerman
          ? 'Keine passenden Artikelnummern in der CSV gefunden.'
          : 'No matching SKUs found in the provided CSV text.'
      );
      addToast({
        title: isGerman ? 'CSV-Import fehlgeschlagen' : 'CSV Import Failed',
        message: isGerman ? 'Keine passenden SKUs gefunden' : 'No matching SKUs found',
        type: 'info',
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const formatPrice = (val) =>
    isGerman ? `${val.toFixed(2).replace('.', ',')} € *` : `€${val.toFixed(2)} *`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isGerman ? 'csv-liste / Schnellorder' : 'CSV list (Quick Order)'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('quickOrder.subtitle')}
          </p>
        </div>

        {isApproved && (
          <button
            onClick={activeTab === 'table' ? handleBulkAdd : handleCsvImport}
            className={`text-xs font-bold px-4 py-2 rounded transition flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
              submitted ? 'bg-emerald-600 text-white' : 'bg-[#0B1E3F] hover:bg-[#162e5b] text-white'
            }`}
          >
            {submitted ? <Check size={14} /> : <ShoppingCart size={14} />}
            <span>{submitted ? t('quickOrder.inCart') : t('quickOrder.toCart')}</span>
          </button>
        )}
      </div>

      {!isApproved ? (
        <div className="bg-white border border-gray-200 rounded p-8 text-center text-xs text-gray-600 space-y-2">
          <strong>{t('card.loginNotice')}</strong>
          <p>{t('quickOrder.guestNotice')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mode Switch Tabs */}
          <div className="flex border-b border-gray-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
                activeTab === 'table'
                  ? 'border-[#0B1E3F] text-[#0B1E3F]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {isGerman ? 'Tabellen-Schnelleingabe' : 'Manual Row Entry'}
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-4 py-2.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'csv'
                  ? 'border-[#0B1E3F] text-[#0B1E3F]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Upload size={13} />
              <span>{isGerman ? 'CSV-Text / Datei-Upload' : 'CSV Paste / File Upload'}</span>
            </button>
          </div>

          {/* TAB 1: TABLE MODE */}
          {activeTab === 'table' && (
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">Pos.</th>
                      <th className="py-2.5 px-3">{t('cart.article')}</th>
                      <th className="py-2.5 px-3 w-32">{t('cart.qty')}</th>
                      <th className="py-2.5 px-3 w-36 text-right">{t('cart.unitPrice')}</th>
                      <th className="py-2.5 px-3 w-36 text-right">{t('cart.total')}</th>
                      <th className="py-2.5 px-3 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row, index) => {
                      const prod = availableProducts.find(
                        (p) => (p._id || p.sku) === row.selectedId
                      );
                      const price = prod ? prod.basePrice : 0;
                      const total = price * (row.quantity || 0);

                      return (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 text-center text-gray-400 font-bold">{index + 1}</td>
                          <td className="py-2.5 px-3">
                            <select
                              value={row.selectedId}
                              onChange={(e) => updateRow(row.id, 'selectedId', e.target.value)}
                              className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-800 bg-white"
                            >
                              <option value="">{t('quickOrder.selectArticle')}</option>
                              {availableProducts.map((p) => (
                                <option key={p._id || p.sku} value={p._id || p.sku}>
                                  [{p.sku}] {isGerman ? p.name?.de : p.name?.en} ({t('card.stock')}: {p.stock})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) => updateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full border border-gray-300 rounded p-1.5 text-xs text-center text-gray-800 tabular-nums"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-gray-700 tabular-nums">
                            {prod ? formatPrice(price) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#0B1E3F] tabular-nums">
                            {prod ? formatPrice(total) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => removeRow(row.id)}
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={addRow}
                  className="text-xs font-semibold text-[#0B1E3F] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{t('quickOrder.addRow')}</span>
                </button>

                <button
                  onClick={handleBulkAdd}
                  className="bg-[#0B1E3F] hover:bg-[#162e5b] text-white text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
                >
                  {t('quickOrder.transferAll')}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CSV DIRECT PASTE & FILE UPLOAD */}
          {activeTab === 'csv' && (
            <div className="bg-white border border-gray-200 rounded p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isGerman ? 'CSV-Text einfügen (Format: SKU;Menge)' : 'Paste CSV Text (Format: SKU;Quantity)'}
                </label>
                <p className="text-[11px] text-gray-500 mb-2">
                  {isGerman
                    ? 'Kopieren Sie Artikelnummern und Mengen direkt aus Excel (eine Zeile pro Artikel, getrennt durch Semikolon oder Tabulator).'
                    : 'Copy & paste items directly from Excel or ERP (one row per item, separated by semicolon or comma).'}
                </p>
                <textarea
                  rows={6}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full font-mono text-xs p-3 border border-gray-300 rounded bg-[#fafbfc] focus:outline-none focus:border-gray-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-xs">{isGerman ? 'Oder .csv Datei wählen:' : 'Or upload .csv file:'}</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleCsvImport}
                  className="bg-[#0B1E3F] hover:bg-[#162e5b] text-white text-xs font-bold px-5 py-2 rounded transition cursor-pointer shadow-xs"
                >
                  {isGerman ? 'Positionen importieren' : 'Import Items to Cart'}
                </button>
              </div>

              {csvFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded font-semibold text-xs flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>{csvFeedback}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickOrderPage;
