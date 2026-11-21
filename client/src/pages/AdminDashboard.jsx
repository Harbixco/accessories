import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  X,
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  Truck,
  CreditCard,
  Building,
  UserCheck,
  ArrowLeft,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [activeTab, setActiveTab] = useState('dealers'); // 'dealers' | 'orders'
  const [dealers, setDealers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: 'success' });

  // Filters for Dealers
  const [dealerFilter, setDealerFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [dealerSearch, setDealerSearch] = useState('');

  // Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const [dealersRes, statsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/dealers?status=all'),
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/orders'),
      ]);

      if (dealersRes.data.success) setDealers(dealersRes.data.dealers);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
    } catch (err) {
      console.warn('Could not fetch admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateDealerStatus = async (dealerId, newStatus) => {
    try {
      const res = await axios.patch(`/api/admin/dealers/${dealerId}/status`, {
        b2bStatus: newStatus,
      });
      if (res.data.success) {
        setMsg({
          text: isGerman
            ? `Händlerstatus erfolgreich auf "${newStatus === 'approved' ? 'Freigeschaltet' : 'Abgelehnt'}" gesetzt!`
            : `Dealer status successfully updated to "${newStatus}"!`,
          type: newStatus === 'approved' ? 'success' : 'info',
        });
        fetchAdminData();
        setTimeout(() => setMsg({ text: '', type: 'success' }), 4000);
      }
    } catch (err) {
      setMsg({
        text: isGerman ? 'Fehler beim Aktualisieren des Status.' : 'Failed to update status.',
        type: 'error',
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setMsg({
          text: isGerman ? `Auftragsstatus auf "${newStatus}" aktualisiert.` : `Order status updated to "${newStatus}".`,
          type: 'success',
        });
        fetchAdminData();
        setTimeout(() => setMsg({ text: '', type: 'success' }), 3000);
      }
    } catch (err) {
      setMsg({
        text: isGerman ? 'Fehler beim Aktualisieren des Auftrags.' : 'Failed to update order.',
        type: 'error',
      });
    }
  };

  // Filtered dealers
  const filteredDealers = dealers.filter((d) => {
    const matchesFilter =
      dealerFilter === 'all' ? true : d.b2bStatus === dealerFilter;
    const q = dealerSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.companyName?.toLowerCase().includes(q) ||
      d.vatId?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.contactName?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.poNumber?.toLowerCase().includes(q) ||
      o.dealer?.companyName?.toLowerCase().includes(q) ||
      o.dealer?.vatId?.toLowerCase().includes(q)
    );
  });

  const pendingCount = dealers.filter((d) => d.b2bStatus === 'pending').length;
  const approvedCount = dealers.filter((d) => d.b2bStatus === 'approved').length;
  const rejectedCount = dealers.filter((d) => d.b2bStatus === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Bar */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            BC Accessories GmbH &bull; B2B Wholesale ERP
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">
            {isGerman ? 'Händlerverwaltung & B2B-Portal' : 'Dealer Management & Wholesale Portal'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="bg-white border border-gray-300 hover:border-gray-500 text-gray-700 px-2.5 py-1.5 rounded flex items-center space-x-1.5 transition cursor-pointer font-semibold shadow-2xs"
              title={isGerman ? 'Sprache wählen' : 'Select language'}
            >
              <span className="text-sm leading-none">{isGerman ? '🇩🇪' : '🇬🇧'}</span>
              <span>{isGerman ? 'Deutsch' : 'English'}</span>
              <ChevronDown
                size={11}
                className={`text-gray-500 transition-transform duration-200 ${
                  langDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-gray-300 rounded shadow-lg z-50 py-1 text-xs animate-dropdown">
                <button
                  type="button"
                  onClick={() => selectLanguage('de')}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 hover:bg-gray-100 transition cursor-pointer ${
                    isGerman ? 'font-bold bg-gray-50 text-gray-900' : 'font-normal text-gray-700'
                  }`}
                >
                  <span className="text-sm">🇩🇪</span>
                  <span>Deutsch (DE)</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectLanguage('en')}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 hover:bg-gray-100 transition cursor-pointer ${
                    !isGerman ? 'font-bold bg-gray-50 text-gray-900' : 'font-normal text-gray-700'
                  }`}
                >
                  <span className="text-sm">🇬🇧</span>
                  <span>English (EN)</span>
                </button>
              </div>
            )}
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 bg-white border border-gray-300 hover:border-gray-500 text-gray-700 px-3 py-1.5 rounded transition font-semibold"
          >
            <ArrowLeft size={13} />
            <span>{isGerman ? 'Zum Shop' : 'Back to Shop'}</span>
          </Link>
          <div className="hidden sm:inline-flex items-center space-x-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded border border-gray-200 font-medium">
            <Shield size={13} className="text-[#0B1E3F]" />
            <span>{user?.email || 'admin@bc-accessories.de'}</span>
          </div>
          <button
            onClick={fetchAdminData}
            disabled={refreshing}
            className="bg-white border border-gray-300 hover:border-gray-500 text-gray-700 px-3 py-1.5 rounded flex items-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-2xs font-semibold"
            title="Refresh"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>{isGerman ? 'Aktualisieren' : 'Refresh'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded flex items-center space-x-1.5 transition cursor-pointer font-semibold"
            title={isGerman ? 'Abmelden' : 'Logout'}
          >
            <LogOut size={13} />
            <span>{isGerman ? 'Abmelden' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Alert message */}
      {msg.text && (
        <div
          className={`p-3 rounded text-xs font-bold transition flex items-center justify-between border ${
            msg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{msg.text}</span>
          <button
            onClick={() => setMsg({ text: '', type: 'success' })}
            className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Key Metrics Cards (Simple, High-Density, Professional) */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Dealers */}
          <div
            onClick={() => {
              setActiveTab('dealers');
              setDealerFilter('pending');
            }}
            className={`bg-white p-4 rounded border transition-all cursor-pointer ${
              pendingCount > 0
                ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                {isGerman ? 'Ausstehende Anträge' : 'Pending Verification'}
              </span>
              {pendingCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </div>
            <span className="text-2xl font-black text-amber-600 block mt-1 tabular-nums">
              {stats.pendingDealers}
            </span>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {pendingCount > 0
                ? (isGerman ? 'Prüfung & USt-IdNr. Validierung erforderlich' : 'Action required')
                : (isGerman ? 'Alle Anträge bearbeitet' : 'All applications reviewed')}
            </span>
          </div>

          {/* Active B2B Dealers */}
          <div
            onClick={() => {
              setActiveTab('dealers');
              setDealerFilter('approved');
            }}
            className="bg-white p-4 rounded border border-gray-200 hover:border-gray-300 transition cursor-pointer"
          >
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
              {isGerman ? 'Aktive Fachhändler' : 'Active Dealers'}
            </span>
            <span className="text-2xl font-black text-emerald-600 block mt-1 tabular-nums">
              {stats.approvedDealers}
            </span>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {isGerman ? 'Verifiziert für Großhandel' : 'Verified B2B wholesale access'}
            </span>
          </div>

          {/* Wholesale Orders */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white p-4 rounded border border-gray-200 hover:border-gray-300 transition cursor-pointer"
          >
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
              {isGerman ? 'Großhandels-Aufträge' : 'Wholesale Orders'}
            </span>
            <span className="text-2xl font-black text-[#0B1E3F] block mt-1 tabular-nums">
              {stats.totalOrders}
            </span>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {isGerman ? 'Bestellungen im System' : 'Total orders recorded'}
            </span>
          </div>

          {/* Total Net Revenue */}
          <div className="bg-white p-4 rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
              {isGerman ? 'Gesamtumsatz (netto)' : 'Total Net Revenue'}
            </span>
            <span className="text-2xl font-black text-gray-900 block mt-1 tabular-nums">
              {isGerman
                ? `${stats.totalRevenue.toFixed(2).replace('.', ',')} €`
                : `€${stats.totalRevenue.toFixed(2)}`}
            </span>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {isGerman ? 'Exkl. 19% MwSt.' : 'Excl. 19% VAT'}
            </span>
          </div>
        </div>
      )}

      {/* 3. Tab Switcher */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-6 min-w-max pb-0.5">
          <button
            onClick={() => setActiveTab('dealers')}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'dealers'
                ? 'border-[#0B1E3F] text-[#0B1E3F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>{isGerman ? 'Händleranträge & Konten' : 'Dealer Applications & Accounts'}</span>
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
              {dealers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#0B1E3F] text-[#0B1E3F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>{isGerman ? 'Großhandelsbestellungen' : 'Wholesale Orders'}</span>
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
              {orders.length}
            </span>
          </button>
        </nav>
      </div>

      {/* 4. Tab 1: Dealers List */}
      {activeTab === 'dealers' && (
        <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-2xs space-y-3">
          {/* Controls Bar: Status Pills & Search */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-[#fafbfc]">
            {/* Status Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setDealerFilter('all')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  dealerFilter === 'all'
                    ? 'bg-[#0B1E3F] text-white shadow-2xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isGerman ? 'Alle' : 'All'} ({dealers.length})
              </button>
              <button
                onClick={() => setDealerFilter('pending')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  dealerFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white border border-amber-200 text-amber-800 hover:bg-amber-50'
                }`}
              >
                {isGerman ? 'In Prüfung' : 'Pending'} ({pendingCount})
              </button>
              <button
                onClick={() => setDealerFilter('approved')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  dealerFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isGerman ? 'Freigeschaltet' : 'Approved'} ({approvedCount})
              </button>
              <button
                onClick={() => setDealerFilter('rejected')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  dealerFilter === 'rejected'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isGerman ? 'Abgelehnt' : 'Rejected'} ({rejectedCount})
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={dealerSearch}
                onChange={(e) => setDealerSearch(e.target.value)}
                placeholder={isGerman ? 'Firma, USt-IdNr. oder E-Mail suchen...' : 'Search company, VAT ID or email...'}
                className="w-full border border-gray-300 rounded py-1.5 pl-3 pr-8 text-xs text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-gray-500"
              />
              <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200 tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">{isGerman ? 'Unternehmen & Rechtsform' : 'Company & Legal Form'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'USt-IdNr. (VAT ID)' : 'VAT ID'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Ansprechpartner & Kontakt' : 'Contact Person'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Anschrift' : 'Address'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Status' : 'Status'}</th>
                  <th className="py-2.5 px-4 text-center">{isGerman ? 'Aktionen' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDealers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-gray-400 text-xs">
                      {isGerman ? 'Keine Händlerkonten für die gewählten Filter gefunden.' : 'No dealer accounts match the criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredDealers.map((d) => {
                    const billing = d.billingAddress || {};
                    const cityStr = [billing.postalCode, billing.city].filter(Boolean).join(' ');

                    return (
                      <tr key={d._id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Company */}
                        <td className="py-3 px-4">
                          <strong className="block text-gray-900 font-bold">{d.companyName}</strong>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-medium border border-gray-200">
                            {d.legalForm || 'GmbH'}
                          </span>
                        </td>

                        {/* VAT ID with VIES Check Link */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-gray-900 block text-xs">
                            {d.vatId}
                          </span>
                          <a
                            href="https://ec.europa.eu/taxation_customs/vies/#/vat-validation"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#1976d2] hover:underline inline-flex items-center gap-0.5 mt-0.5"
                            title="EU VIES VAT-Check"
                          >
                            <span>VIES Check</span>
                            <ExternalLink size={9} />
                          </a>
                        </td>

                        {/* Contact & Email */}
                        <td className="py-3 px-4">
                          <span className="text-gray-800 font-semibold block">{d.contactName}</span>
                          <a href={`mailto:${d.email}`} className="text-[11px] text-gray-500 hover:text-black hover:underline block">
                            {d.email}
                          </a>
                          {d.phone && <span className="text-[10px] text-gray-400 block font-mono">{d.phone}</span>}
                        </td>

                        {/* Address */}
                        <td className="py-3 px-4 text-gray-600 text-[11px]">
                          <span>{billing.street || '—'}</span>
                          <span className="block text-gray-500">{cityStr || 'Deutschland'}</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          {d.b2bStatus === 'approved' && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              <span>{isGerman ? 'Freigeschaltet' : 'Approved'}</span>
                            </span>
                          )}
                          {d.b2bStatus === 'pending' && (
                            <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                              <span>{isGerman ? 'In Prüfung' : 'Pending'}</span>
                            </span>
                          )}
                          {d.b2bStatus === 'rejected' && (
                            <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              <span>{isGerman ? 'Abgelehnt' : 'Rejected'}</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center space-x-1.5 whitespace-nowrap">
                          {d.b2bStatus !== 'approved' && (
                            <button
                              onClick={() => handleUpdateDealerStatus(d._id, 'approved')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-[10px] font-bold transition inline-flex items-center space-x-1 cursor-pointer shadow-2xs active:scale-95"
                            >
                              <Check size={11} className="stroke-[3]" />
                              <span>{isGerman ? 'Freigeben' : 'Approve'}</span>
                            </button>
                          )}
                          {d.b2bStatus !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateDealerStatus(d._id, 'rejected')}
                              className="bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-[10px] font-semibold transition inline-flex items-center space-x-1 border border-gray-300 cursor-pointer active:scale-95"
                            >
                              <X size={11} />
                              <span>{isGerman ? 'Ablehnen' : 'Reject'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Orders List */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-2xs space-y-3">
          {/* Search Bar for Orders */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#fafbfc]">
            <span className="text-xs font-bold text-gray-700">
              {isGerman ? 'Eingegangene Großhandelsaufträge' : 'Recorded Wholesale Orders'} ({filteredOrders.length})
            </span>
            <div className="relative w-72">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder={isGerman ? 'Auftrags-Nr., Kommission, Händler...' : 'Order nr, PO, dealer...'}
                className="w-full border border-gray-300 rounded py-1.5 pl-3 pr-8 text-xs text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-gray-500"
              />
              <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200 tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">{isGerman ? 'Auftragsnummer' : 'Order Nr.'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Fachhändler' : 'Wholesale Dealer'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Positionen' : 'Items'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Warenwert (netto)' : 'Net Total'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Zahlungsart & Status' : 'Payment'}</th>
                  <th className="py-2.5 px-4">{isGerman ? 'Lieferstatus' : 'Fulfillment'}</th>
                  <th className="py-2.5 px-4 text-center">{isGerman ? 'Aktion' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400 text-xs">
                      {isGerman ? 'Bisher keine Bestellungen erfasst.' : 'No orders recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Order Nr & Date */}
                      <td className="py-3 px-4">
                        <strong className="block text-gray-900 font-bold font-mono">{o.orderNumber}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(o.createdAt).toLocaleDateString(isGerman ? 'de-DE' : 'en-US')}
                        </span>
                        {o.poNumber && (
                          <span className="block text-[10px] text-gray-500 font-semibold">
                            PO: {o.poNumber}
                          </span>
                        )}
                      </td>

                      {/* Dealer */}
                      <td className="py-3 px-4">
                        <strong className="block text-gray-900">{o.dealer?.companyName || 'Fachhändler'}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {o.dealer?.vatId || o.dealer?.email}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">
                          {o.items?.reduce((sum, it) => sum + it.quantity, 0) || o.items?.length || 1} Stk.
                        </span>
                        <span className="block text-[10px] text-gray-400">
                          {o.items?.length} {isGerman ? 'Positionen' : 'lines'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0B1E3F] block tabular-nums">
                          {isGerman
                            ? `${o.totalNet?.toFixed(2).replace('.', ',')} €`
                            : `€${o.totalNet?.toFixed(2)}`}
                        </span>
                        <span className="text-[10px] text-gray-400 block tabular-nums">
                          {isGerman
                            ? `${o.totalGross?.toFixed(2).replace('.', ',')} € brutto`
                            : `€${o.totalGross?.toFixed(2)} gross`}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4">
                        <span className="text-gray-800 block text-[11px] font-medium leading-tight">
                          {o.paymentMethod || 'Prepayment'}
                        </span>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            o.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {o.paymentStatus || 'Pending'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.status === 'Dispatched'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : o.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {o.status}
                        </span>
                        {o.trackingCode && (
                          <span className="block text-[9px] text-gray-400 font-mono mt-0.5 truncate max-w-[120px]">
                            {o.trackingCode}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {o.status === 'Received' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'Processing')}
                            className="bg-[#0B1E3F] hover:bg-[#162e5b] text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            {isGerman ? 'In Bearbeitung' : 'Process'}
                          </button>
                        )}
                        {o.status === 'Processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'Dispatched')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            {isGerman ? 'Versenden' : 'Dispatch'}
                          </button>
                        )}
                        {o.status === 'Dispatched' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'Delivered')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            {isGerman ? 'Zugestellt' : 'Deliver'}
                          </button>
                        )}
                        {o.status === 'Delivered' && (
                          <span className="text-[10px] text-gray-400 font-bold">✓ {isGerman ? 'Abgeschlossen' : 'Completed'}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
