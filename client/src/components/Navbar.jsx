import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Search,
  Home,
  Heart,
  User,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Layers,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn, isApproved, isPending, isAdmin, logout } = useAuth();
  const { totalItemsCount, totalNet, cartPulse, setIsCartDrawerOpen } = useCart();
  const { wishlistCount, wishlistPulse } = useWishlist();
  const navigate = useNavigate();

  const isGerman = i18n.language.startsWith('de');

  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCurrentCategory, setMobileCurrentCategory] = useState(null); // null | 'products' | 'brands' | 'apple' | 'samsung' | 'other'

  // Lock background scroll when mobile offcanvas menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [flyoutMenu, setFlyoutMenu] = useState(null);
  const flyoutTimeoutRef = useRef(null);

  const handleMouseEnterNav = (menuName) => {
    if (flyoutTimeoutRef.current) clearTimeout(flyoutTimeoutRef.current);
    setFlyoutMenu(menuName);
  };

  const handleMouseLeaveNav = () => {
    flyoutTimeoutRef.current = setTimeout(() => {
      setFlyoutMenu(null);
    }, 160);
  };

  // Live Warehouse Cutoff Countdown to 14:00 CET
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(14, 0, 0, 0);

      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diff = Math.max(0, cutoff - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll detection for Sticky Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const langRef = useRef(null);
  const serviceRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setServiceDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('bc_language', langCode);
    setLangDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formattedTotal = isGerman
    ? `${totalNet.toFixed(2).replace('.', ',')} €*`
    : `€${totalNet.toFixed(2)}*`;

  const padZero = (n) => String(n).padStart(2, '0');

  return (
    <header className="bg-white border-b border-gray-200 text-gray-800 font-sans relative">
      {/* 0. AUTHENTIC GERMAN WHOLESALE DISPATCH COUNTDOWN BAR */}
      <div className="bg-[#0B1E3F] text-white text-[11px] py-1 px-3 sm:px-4 border-b border-[#1b3461]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center gap-1 font-medium">
          {/* Mobile Layout (< sm): Clean, single-line centered countdown without cramped multi-line word breaks */}
          <div className="flex sm:hidden items-center justify-center space-x-1.5 text-gray-200 text-[11px] py-0.5">
            <span className="text-[#00d2c4] shrink-0">⚡</span>
            <span className="whitespace-nowrap">
              {isGerman ? 'Same-Day Versand:' : 'Same-day dispatch:'}
            </span>
            <span className="bg-white/20 text-white font-mono font-bold px-1.5 py-0.5 rounded text-[10px] tabular-nums tracking-wide shadow-2xs shrink-0">
              {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
            </span>
            <span className="text-gray-300 text-[10px] whitespace-nowrap">
              (DHL / UPS)
            </span>
          </div>

          {/* Desktop & Tablet Layout (>= sm): Full wholesale dispatch banner */}
          <div className="hidden sm:flex items-center space-x-1.5 text-gray-200">
            <span className="text-[#00d2c4] shrink-0">⚡</span>
            <span className="whitespace-nowrap">
              {isGerman ? 'Bestellen Sie innerhalb von' : 'Order within the next'}
            </span>
            <span className="bg-white/15 text-white font-mono font-bold px-1.5 py-0.5 rounded text-[11px] tabular-nums tracking-wide shrink-0">
              {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
            </span>
            <span className="whitespace-nowrap">
              {isGerman
                ? 'für Same-Day Versand heute per DHL & UPS Express'
                : 'for same-day dispatch today via DHL & UPS Express'}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[10px] text-gray-300">
            <span>✓ 100% {isGerman ? 'Deutsche Handelsware' : 'German Wholesale Stock'}</span>
            <span>✓ {isGerman ? 'Staffelpreise ab Stück 1' : 'Volume Tiers from Unit 1'}</span>
            <span>✓ {isGerman ? 'Frachtfrei ab 500 €' : 'Free Shipping above €500'}</span>
          </div>
        </div>
      </div>

      {/* 1. TOP UTILITY BAR (Flag + Language Dropdown, Service/help dropdown) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1.5 pb-1">
        <div className="flex justify-end items-center space-x-5 text-xs text-gray-600">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 hover:text-gray-900 font-normal focus:outline-none py-0.5 cursor-pointer transition-colors"
            >
              <span className="text-sm leading-none">{isGerman ? '🇩🇪' : '🇬🇧'}</span>
              <span className="text-gray-700 text-xs">{isGerman ? 'Deutsch' : 'English'}</span>
              <ChevronDown
                size={11}
                className={`text-gray-500 transition-transform duration-200 ${
                  langDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-white border border-gray-300 rounded shadow-lg z-50 py-1.5 text-xs animate-dropdown">
                <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-300 transform rotate-45"></div>
                <button
                  type="button"
                  onClick={() => selectLanguage('de')}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 hover:bg-gray-100 transition cursor-pointer ${
                    isGerman ? 'font-bold bg-gray-50' : 'font-normal text-gray-700'
                  }`}
                >
                  <span className="text-sm">🇩🇪</span>
                  <span>Deutsch</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectLanguage('en')}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 hover:bg-gray-100 transition cursor-pointer ${
                    !isGerman ? 'font-bold bg-gray-50' : 'font-normal text-gray-700'
                  }`}
                >
                  <span className="text-sm">🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* Service/help Dropdown */}
          <div className="relative" ref={serviceRef}>
            <button
              onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              className="flex items-center space-x-1 hover:text-gray-900 font-normal focus:outline-none py-0.5 cursor-pointer transition-colors"
            >
              <span className="text-gray-700 text-xs">{isGerman ? 'Service/Hilfe' : 'Service/help'}</span>
              <ChevronDown
                size={11}
                className={`text-gray-500 transition-transform duration-200 ${
                  serviceDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {serviceDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-300 rounded shadow-lg z-50 py-1.5 text-xs animate-dropdown">
                <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white border-t border-l border-gray-300 transform rotate-45"></div>
                <Link
                  to="/rma"
                  onClick={() => setServiceDropdownOpen(false)}
                  className="block px-3 py-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  {isGerman ? 'RMA & Reklamation' : 'RMA & Returns'}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setServiceDropdownOpen(false)}
                  className="block px-3 py-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  {isGerman ? 'FAQ / Kontakt' : 'FAQ / Contact'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search input, Wishlist, Account, Shopping cart) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src="/logo.jpg"
              alt="BC Accessories"
              className="h-11 sm:h-13 w-auto object-contain hover:opacity-95 transition-opacity"
            />
          </Link>

          {/* Center Search Input with Blue Icon */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isGerman ? 'Suchbegriff eingeben...' : 'Enter search term...'}
                className="w-full border border-gray-300 rounded-sm py-2 pl-3 pr-9 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 bg-white"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1976d2] hover:text-[#115293] transition cursor-pointer"
                title="Search"
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* Right Header Navigation Items */}
          <div className="flex items-center space-x-5 text-xs text-gray-700">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:flex items-center space-x-1.5 hover:text-gray-900 font-normal transition-colors"
            >
              <div className="relative">
                <Heart
                  size={14}
                  className={`transition-colors duration-200 ${
                    wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'fill-current text-gray-800'
                  }`}
                />
                {wishlistCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center tabular-nums shadow-xs transition-transform ${
                      wishlistPulse ? 'animate-badge-bounce bg-rose-600' : 'bg-red-600'
                    }`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span>{isGerman ? 'Wunschzettel' : 'Wishlist'}</span>
            </Link>

            {/* My account */}
            <div className="relative" ref={accountRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center space-x-1.5 hover:text-gray-900 font-normal cursor-pointer transition-colors"
                >
                  <User size={14} className="fill-current text-gray-800" />
                  <span className="max-w-[120px] truncate font-medium">
                    {user?.companyName}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`text-gray-500 transition-transform duration-200 ${
                      accountDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 hover:text-gray-900 font-normal transition-colors"
                >
                  <User size={14} className="fill-current text-gray-800" />
                  <span>{isGerman ? 'Mein Konto' : 'My account'}</span>
                </Link>
              )}

              {accountDropdownOpen && isLoggedIn && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-300 rounded shadow-xl z-50 py-1.5 text-xs animate-dropdown">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 truncate">{user?.companyName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    {isApproved ? (
                      <div className="mt-1.5 inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <ShieldCheck size={11} className="text-emerald-600" />
                        <span>{isGerman ? 'B2B Preise aktiv' : 'B2B Prices Active'}</span>
                      </div>
                    ) : isPending ? (
                      <div className="mt-1.5 inline-flex items-center space-x-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        <Clock size={11} className="text-amber-600" />
                        <span>{isGerman ? 'In Prüfung (Pending)' : 'Under Verification'}</span>
                      </div>
                    ) : (
                      <div className="mt-1.5 inline-flex items-center space-x-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        <X size={11} className="text-rose-600" />
                        <span>{isGerman ? 'Verifizierung abgelehnt' : 'Verification Rejected'}</span>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-3 py-1.5 hover:bg-gray-100 text-blue-700 font-semibold transition-colors"
                    >
                      Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-red-600 border-t border-gray-100 mt-1 cursor-pointer flex items-center space-x-1.5 transition-colors"
                  >
                    <LogOut size={13} />
                    <span>{isGerman ? 'Abmelden' : 'Log out'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart (Opens Slide-over Cart Drawer) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center space-x-2 border border-gray-300 rounded-sm px-2.5 py-1.5 hover:bg-gray-50 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingBag size={15} className="text-gray-800" />
                {totalItemsCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums transition-transform ${
                      cartPulse ? 'animate-badge-bounce bg-emerald-600' : 'bg-[#0B1E3F]'
                    }`}
                  >
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="font-normal text-gray-800 whitespace-nowrap hidden sm:inline">
                {isGerman ? 'Warenkorb' : 'Shopping cart'}
              </span>
              <span className="font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                {isApproved ? formattedTotal : (isGerman ? '0,00 €*' : '€0.00*')}
              </span>
            </button>

            {/* Mobile menu toggle (Shopware 6 ThemeWare offcanvas trigger) */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(true);
                setMobileCurrentCategory(null);
              }}
              className="md:hidden text-gray-700 hover:text-gray-900 p-1.5 rounded transition cursor-pointer"
              aria-label="Menu"
              title="Navigation"
            >
              <Menu size={22} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <form onSubmit={handleSearch} className="mt-2 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isGerman ? 'Suchbegriff eingeben...' : 'Enter search term...'}
              className="w-full border border-gray-300 rounded-sm py-1.5 pl-3 pr-8 text-xs text-gray-700 bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1976d2]"
            >
              <Search size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* 3. LIGHT GRAY NAVIGATION BAR (Shopware 6 ThemeWare Benchmark from talksky.de/en) */}
      <nav 
        className="bg-[#dcdfe3] border-t border-b border-[#cbd0d6] hidden md:block relative z-40"
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center text-[13px] font-bold text-gray-800 space-x-7 py-2">
            {/* Home Icon */}
            <li>
              <Link to="/" className="text-gray-800 hover:text-black flex items-center" title="Home">
                <Home size={16} className="fill-current" />
              </Link>
            </li>

            {/* products */}
            <li onMouseEnter={() => handleMouseEnterNav('products')}>
              <Link 
                to="/catalog" 
                className={`hover:text-black transition flex items-center space-x-1 ${
                  flyoutMenu === 'products' ? 'text-black' : ''
                }`}
              >
                <span>{isGerman ? 'Produkte' : 'products'}</span>
              </Link>
            </li>

            {/* Brands */}
            <li onMouseEnter={() => handleMouseEnterNav('brands')}>
              <Link 
                to="/catalog" 
                className={`hover:text-black transition flex items-center space-x-1 ${
                  flyoutMenu === 'brands' ? 'text-black' : ''
                }`}
              >
                <span>Brands</span>
              </Link>
            </li>

            {/* Apple */}
            <li onMouseEnter={() => handleMouseEnterNav('apple')}>
              <Link 
                to="/catalog?brand=Apple" 
                className={`hover:text-black transition flex items-center space-x-1 ${
                  flyoutMenu === 'apple' ? 'text-black' : ''
                }`}
              >
                <span>Apple</span>
              </Link>
            </li>

            {/* Samsung */}
            <li onMouseEnter={() => handleMouseEnterNav('samsung')}>
              <Link 
                to="/catalog?brand=Samsung" 
                className={`hover:text-black transition flex items-center space-x-1 ${
                  flyoutMenu === 'samsung' ? 'text-black' : ''
                }`}
              >
                <span>Samsung</span>
              </Link>
            </li>

            {/* other devices (blue color like talksky) */}
            <li onMouseEnter={() => handleMouseEnterNav('other')}>
              <Link
                to="/catalog"
                className={`text-[#2b78c5] hover:text-[#185ba0] transition flex items-center space-x-1 ${
                  flyoutMenu === 'other' ? 'underline' : ''
                }`}
              >
                <span>{isGerman ? 'weitere Geräte' : 'other devices'}</span>
              </Link>
            </li>

            {/* Sale */}
            <li onMouseEnter={() => handleMouseEnterNav(null)}>
              <Link to="/catalog?sort=price-low" className="hover:text-black transition">
                Sale
              </Link>
            </li>

            {/* new */}
            <li onMouseEnter={() => handleMouseEnterNav(null)}>
              <Link to="/catalog?sort=newest" className="hover:text-black transition">
                {isGerman ? 'Neu' : 'new'}
              </Link>
            </li>
          </ul>
        </div>

        {/* MEGA-FLYOUT DROPDOWN CONTAINER (talksky.de ThemeWare Style) */}
        {flyoutMenu && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b-2 border-[#0B1E3F] shadow-2xl z-50 animate-fadeIn"
            onMouseEnter={() => handleMouseEnterNav(flyoutMenu)}
            onMouseLeave={handleMouseLeaveNav}
          >
            {/* 1. PRODUCTS FLYOUT */}
            {flyoutMenu === 'products' && (
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    {isGerman ? 'Schutz & Hüllen' : 'Cases & Protection'}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>
                      <Link to="/catalog?category=Cases%20%26%20Covers" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Cases & Schutzhüllen' : 'Cases & Covers'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=magsafe" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'MagSafe Magnet-Cases' : 'MagSafe Magnetic Cases'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=panzerglas" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? '9H Displayschutz Panzerglas' : '9H Tempered Screen Glass'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=privacy" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Anti-Spy Privacy Glas' : 'Anti-Spy Privacy Glass'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=lens" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Kamera-Linsenschutz' : 'Camera Lens Protectors'}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    {isGerman ? 'Laden & Stromversorgung' : 'Power & Charging'}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>
                      <Link to="/catalog?category=Power%20%26%20Charging" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Alle Ladegeräte & Akkus' : 'All Chargers & Power'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=qi2" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Qi2 15W Schnellladestationen' : 'Qi2 15W Charging Stations'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=gan" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'GaN Netzteile (30W - 65W)' : 'GaN Fast Wall Adapters'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=powerbank" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Magnetische Powerbanks' : 'Magnetic Power Banks'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=car" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Kfz-Lüftungslader 15W' : 'Car Wireless Fast Chargers'}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    {isGerman ? 'Kabel & Adapter' : 'Cables & Adapters'}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>
                      <Link to="/catalog?category=Cables%20%26%20Adapters" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Alle Daten- & Ladekabel' : 'All Data & Charging Cables'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=100w" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Geflochtene USB-C 100W Kabel' : 'Braided USB-C 100W Cables'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=lightning" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Apple MFi Lightning Kabel' : 'Apple MFi Lightning Cables'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=3-in-1" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? '3-in-1 Universal-Ladekabel' : '3-in-1 Universal Cables'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?search=dac" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Hi-Res Audio DAC Adapter' : 'Hi-Res Audio DAC Adapters'}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    {isGerman ? 'Wearables & Gadgets' : 'Wearables & Gadgets'}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>
                      <Link to="/catalog?category=Smartwatches%20%26%20Wearables" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Smartwatches & Armbänder' : 'Smartwatches & Straps'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?category=Gadgets%20%26%20Mounts" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Halterungen & Tischständer' : 'Phone Mounts & Desk Stands'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?category=Tablets%20%26%20Zubeh%C3%B6r" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        {isGerman ? 'Tablets & Smart Folios' : 'Tablets & Smart Folios'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/catalog?brand=PopSockets" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">
                        PopSockets MagSafe Grips
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link to="/catalog" onClick={() => setFlyoutMenu(null)} className="text-xs font-bold text-[#1976d2] hover:underline flex items-center space-x-1">
                      <span>{isGerman ? 'Gesamtsortiment ansehen →' : 'View complete catalog →'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BRANDS FLYOUT */}
            {flyoutMenu === 'brands' && (
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-6">
                {[
                  { name: 'Apple', desc: isGerman ? 'Original iPhone, Watch & MFi' : 'Original iPhone, Watch & MFi', link: '/catalog?brand=Apple' },
                  { name: 'Samsung', desc: isGerman ? 'Galaxy S24, Tab, Watch & Power' : 'Galaxy S24, Tab, Watch & Power', link: '/catalog?brand=Samsung' },
                  { name: 'Otterbox', desc: isGerman ? 'Defender, React & Heavy-Duty' : 'Defender, React & Heavy-Duty', link: '/catalog?brand=Otterbox' },
                  { name: 'anco', desc: isGerman ? 'Qi2 Wireless, GaN & Panzerglas' : 'Qi2 Wireless, GaN & Tempered Glass', link: '/catalog?brand=anco' },
                  { name: 'Xiaomi', desc: isGerman ? 'Redmi Note 13, 65W Power' : 'Redmi Note 13, 65W Power', link: '/catalog?brand=Xiaomi' },
                  { name: 'Motorola', desc: isGerman ? 'moto g17, G-Serie B2B' : 'moto g17, G-Series B2B', link: '/catalog?brand=Motorola' },
                  { name: 'PopSockets', desc: isGerman ? 'MagSafe PopGrips & Mounts' : 'MagSafe PopGrips & Mounts', link: '/catalog?brand=PopSockets' },
                  { name: 'Guess', desc: isGerman ? 'Vintage 4G Logo Leder Cases' : 'Vintage 4G Logo Leather Cases', link: '/catalog?brand=Guess' },
                ].map((b, i) => (
                  <Link
                    key={i}
                    to={b.link}
                    onClick={() => setFlyoutMenu(null)}
                    className="p-3 rounded border border-gray-200 hover:border-[#0B1E3F] hover:bg-gray-50 transition group"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-[#0B1E3F] block text-sm">{b.name}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5 block">{b.desc}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* 3. APPLE FLYOUT */}
            {flyoutMenu === 'apple' && (
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    iPhone 16 / 15 Serie
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Apple&device=iPhone%2016%20Pro" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">iPhone 16 Pro</Link></li>
                    <li><Link to="/catalog?brand=Apple&device=iPhone%2016%20Pro%20Max" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">iPhone 16 Pro Max</Link></li>
                    <li><Link to="/catalog?brand=Apple&device=iPhone%2016" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">iPhone 16</Link></li>
                    <li><Link to="/catalog?brand=Apple&device=iPhone%2015%20Pro" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">iPhone 15 Pro</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Apple Watch & iPad
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Apple&device=Apple%20Watch" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Apple Watch Series 10 / Ultra</Link></li>
                    <li><Link to="/catalog?search=milanese" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">{isGerman ? 'Titanium Milanese Armbänder' : 'Titanium Milanese Loops'}</Link></li>
                    <li><Link to="/catalog?brand=Apple&category=Tablets%20%26%20Zubeh%C3%B6r" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">iPad Pro / Air Schutz</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    {isGerman ? 'Laden & Zubehör' : 'Charging & Accessories'}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Apple&category=Power%20%26%20Charging" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">30W USB-C Netzteile</Link></li>
                    <li><Link to="/catalog?search=lightning" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">MFi Lightning & USB-C Kabel</Link></li>
                    <li><Link to="/catalog?search=magsafe" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">MagSafe Wireless Zubehör</Link></li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link to="/catalog?brand=Apple" onClick={() => setFlyoutMenu(null)} className="text-xs font-bold text-[#1976d2] hover:underline">
                      {isGerman ? 'Alle Apple Artikel anzeigen →' : 'View all Apple items →'}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SAMSUNG FLYOUT */}
            {flyoutMenu === 'samsung' && (
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Galaxy S24 Serie
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Samsung&device=Galaxy%20S24%20Ultra" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Galaxy S24 Ultra</Link></li>
                    <li><Link to="/catalog?brand=Samsung&device=Galaxy%20S24" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Galaxy S24</Link></li>
                    <li><Link to="/catalog?brand=Samsung&device=Galaxy%20S24%2B" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Galaxy S24+</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Galaxy Tab & Watch
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Samsung&device=Galaxy%20Tab%20A9%2B" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Galaxy Tab A9+ WiFi / 5G</Link></li>
                    <li><Link to="/catalog?search=book%20cover" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Samsung Smart Book Cover</Link></li>
                    <li><Link to="/catalog?search=galaxy%20watch" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Galaxy Watch 7 / 6 Armbänder</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    {isGerman ? 'Laden & Originalzubehör' : 'Charging & Original Supply'}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?search=ep-t4510" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Super Fast Charging 45W</Link></li>
                    <li><Link to="/catalog?brand=Samsung&category=Cases%20%26%20Covers" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Samsung Clear Cover OEM</Link></li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link to="/catalog?brand=Samsung" onClick={() => setFlyoutMenu(null)} className="text-xs font-bold text-[#1976d2] hover:underline">
                      {isGerman ? 'Alle Samsung Artikel anzeigen →' : 'View all Samsung items →'}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 5. OTHER DEVICES FLYOUT */}
            {flyoutMenu === 'other' && (
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Xiaomi
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Xiaomi" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Redmi Note 13 Pro+ 5G</Link></li>
                    <li><Link to="/catalog?brand=Xiaomi&category=Power%20%26%20Charging" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Xiaomi 65W Powerbanks</Link></li>
                    <li><Link to="/catalog?brand=Xiaomi" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">{isGerman ? 'Xiaomi Hüllen & Glas' : 'Xiaomi Cases & Glass'}</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Motorola
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?brand=Motorola" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Motorola moto g17</Link></li>
                    <li><Link to="/catalog?brand=Motorola" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">G-Serie B2B Bundles</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-3">
                    Universal Zubehör
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li><Link to="/catalog?category=Gadgets%20%26%20Mounts" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">{isGerman ? 'Universal Kfz-Halterungen' : 'Universal Car Mounts'}</Link></li>
                    <li><Link to="/catalog?category=Cables%20%26%20Adapters" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">Multi-Ladekabel & OTG Adapter</Link></li>
                    <li><Link to="/catalog?search=stand" onClick={() => setFlyoutMenu(null)} className="hover:text-[#0B1E3F] hover:font-bold transition block">{isGerman ? 'Aluminium Tischständer' : 'Desktop Stands'}</Link></li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link to="/catalog" onClick={() => setFlyoutMenu(null)} className="text-xs font-bold text-[#1976d2] hover:underline">
                      {isGerman ? 'Gesamtsortiment öffnen →' : 'Open full catalog →'}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 4. SLIM STICKY HEADER ON SCROLL */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-200 animate-slide-in-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center shrink-0">
              <img src="/logo.jpg" alt="BC Accessories" className="h-8 w-auto object-contain" />
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isGerman ? 'Suchbegriff eingeben...' : 'Search wholesale items...'}
                  className="w-full border border-gray-300 rounded-sm py-1.5 pl-3 pr-8 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1976d2]">
                  <Search size={14} />
                </button>
              </div>
            </form>

            <div className="flex items-center space-x-3 text-xs">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center space-x-1.5 bg-[#0B1E3F] hover:bg-[#162e5b] text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer active:scale-[0.98]"
              >
                <ShoppingBag size={14} />
                <span className="tabular-nums">
                  {isApproved ? formattedTotal : (isGerman ? '0,00 €*' : '€0.00*')}
                </span>
                {totalItemsCount > 0 && (
                  <span className="bg-[#00d2c4] text-[#061224] text-[9px] font-extrabold rounded-full px-1.5 py-0.2 ml-1 tabular-nums">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOPWARE 6 THEMEWARE OFFCANVAS MOBILE NAVIGATION (talksky.de benchmark) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileCurrentCategory(null);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel (slides from left) */}
          <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-50 overflow-hidden transform transition-transform duration-300 ease-out">
            {/* 1. Offcanvas Header */}
            <div className="bg-[#f7f8fa] border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
              {mobileCurrentCategory ? (
                <button
                  type="button"
                  onClick={() => setMobileCurrentCategory(null)}
                  className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 hover:text-[#0B1E3F] transition cursor-pointer"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                  <span>{isGerman ? 'Zurück' : 'Back'}</span>
                </button>
              ) : (
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                  {isGerman ? 'Kategorien' : 'Categories'}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileCurrentCategory(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-700 rounded transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2. Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 text-xs">
              {/* ROOT LEVEL */}
              {!mobileCurrentCategory && (
                <div className="py-1">
                  {/* products */}
                  <div className="flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100">
                    <Link
                      to="/catalog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3.5 font-semibold text-gray-800 text-[13px]"
                    >
                      {isGerman ? 'Produkte' : 'products'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileCurrentCategory('products')}
                      className="px-4 py-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                      aria-label="Open products category"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Brands */}
                  <div className="flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100">
                    <Link
                      to="/catalog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3.5 font-semibold text-gray-800 text-[13px]"
                    >
                      Brands
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileCurrentCategory('brands')}
                      className="px-4 py-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                      aria-label="Open Brands category"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Apple */}
                  <div className="flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100">
                    <Link
                      to="/catalog?brand=Apple"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3.5 font-semibold text-gray-800 text-[13px]"
                    >
                      Apple
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileCurrentCategory('apple')}
                      className="px-4 py-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                      aria-label="Open Apple category"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Samsung */}
                  <div className="flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100">
                    <Link
                      to="/catalog?brand=Samsung"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3.5 font-semibold text-gray-800 text-[13px]"
                    >
                      Samsung
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileCurrentCategory('samsung')}
                      className="px-4 py-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                      aria-label="Open Samsung category"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* other devices */}
                  <div className="flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100">
                    <Link
                      to="/catalog?device=All"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3.5 font-semibold text-[#2b78c5] text-[13px]"
                    >
                      {isGerman ? 'weitere Geräte' : 'other devices'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileCurrentCategory('other')}
                      className="px-4 py-3.5 text-[#2b78c5] hover:text-[#195a9b] cursor-pointer"
                      aria-label="Open other devices category"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Sale */}
                  <Link
                    to="/catalog?sort=price-low"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3.5 font-bold text-red-600 hover:bg-red-50 text-[13px] transition border-b border-gray-100"
                  >
                    Sale
                  </Link>

                  {/* new */}
                  <Link
                    to="/catalog?sort=newest"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3.5 font-semibold text-gray-800 hover:bg-gray-50 text-[13px] transition border-b border-gray-100"
                  >
                    {isGerman ? 'Neu' : 'new'}
                  </Link>
                </div>
              )}

              {/* SUB-LEVEL: PRODUCTS */}
              {mobileCurrentCategory === 'products' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCurrentCategory(null)}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-100 border-b border-gray-100 cursor-pointer font-medium"
                  >
                    <Layers size={14} className="text-gray-500" />
                    <span>{isGerman ? 'Alle Kategorien anzeigen' : 'Show all categories'}</span>
                  </button>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {isGerman ? 'Produkte' : 'products'}
                  </div>
                  <Link
                    to="/catalog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 font-bold text-[#1976d2] bg-blue-50/40 hover:bg-blue-50 border-b border-gray-100 text-xs"
                  >
                    {isGerman ? 'Alle Produkte anzeigen' : 'Show products'}
                  </Link>
                  <div className="divide-y divide-gray-100">
                    <Link to="/catalog?category=Cases%20%26%20Covers" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Hüllen, Bumper & MagSafe Cases' : 'Cases, Covers & MagSafe'}
                    </Link>
                    <Link to="/catalog?category=Screen%20Protection" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Panzerglas & Displayschutz (9H Full Glue)' : '9H Tempered Glass & Screen Protection'}
                    </Link>
                    <Link to="/catalog?category=Power%20%26%20Charging" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Laden, GaN Netzteile & Qi2 Ladestationen' : 'Charging, GaN Adapters & Qi2 Docks'}
                    </Link>
                    <Link to="/catalog?category=Cables%20%26%20Adapters" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Kabel, Multi-Ladekabel & USB-C OTG' : 'Cables, Multi-Cables & USB-C Adapters'}
                    </Link>
                    <Link to="/catalog?category=Smartwatches%20%26%20Wearables" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Smartwatches, Fitnessbänder & Armbänder' : 'Smartwatches, Fitness Trackers & Straps'}
                    </Link>
                    <Link to="/catalog?category=Gadgets%20%26%20Mounts" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Kfz-Halterungen & Tischständer' : 'Car Mounts & Desktop Stands'}
                    </Link>
                    <Link to="/catalog?category=Tablets%20%26%20Zubeh%C3%B6r" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      {isGerman ? 'Tablets & Folio Book Covers' : 'Tablets & Book Cover Folios'}
                    </Link>
                  </div>
                </div>
              )}

              {/* SUB-LEVEL: BRANDS */}
              {mobileCurrentCategory === 'brands' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCurrentCategory(null)}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-100 border-b border-gray-100 cursor-pointer font-medium"
                  >
                    <Layers size={14} className="text-gray-500" />
                    <span>{isGerman ? 'Alle Kategorien anzeigen' : 'Show all categories'}</span>
                  </button>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Brands / Hersteller
                  </div>
                  <Link
                    to="/catalog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 font-bold text-[#1976d2] bg-blue-50/40 hover:bg-blue-50 border-b border-gray-100 text-xs"
                  >
                    {isGerman ? 'Alle Marken im Katalog' : 'Show all brands'}
                  </Link>
                  <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                    {['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Guess', 'Pitaka', 'Anker', 'Baseus', 'PopSockets', 'Belkin', 'Spigen', 'Otterbox'].map((b) => (
                      <Link
                        key={b}
                        to={`/catalog?brand=${encodeURIComponent(b)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 hover:bg-gray-50 font-semibold text-gray-800 text-xs"
                      >
                        {b}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-LEVEL: APPLE */}
              {mobileCurrentCategory === 'apple' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCurrentCategory(null)}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-100 border-b border-gray-100 cursor-pointer font-medium"
                  >
                    <Layers size={14} className="text-gray-500" />
                    <span>{isGerman ? 'Alle Kategorien anzeigen' : 'Show all categories'}</span>
                  </button>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Apple
                  </div>
                  <Link
                    to="/catalog?brand=Apple"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 font-bold text-[#1976d2] bg-blue-50/40 hover:bg-blue-50 border-b border-gray-100 text-xs"
                  >
                    {isGerman ? 'Alle Apple-Artikel anzeigen' : 'Show Apple'}
                  </Link>
                  <div className="divide-y divide-gray-100">
                    <Link to="/catalog?brand=Apple&device=iPhone%2016%20Pro" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      iPhone 16 Pro & Pro Max
                    </Link>
                    <Link to="/catalog?brand=Apple&device=iPhone%2016" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      iPhone 16 & 16 Plus
                    </Link>
                    <Link to="/catalog?brand=Apple&device=iPhone%2015%20Pro" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      iPhone 15 Pro / Series
                    </Link>
                    <Link to="/catalog?brand=Apple&device=Apple%20Watch" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Apple Watch Series 10 & Titanium Milanese
                    </Link>
                    <Link to="/catalog?brand=Apple&category=Tablets%20%26%20Zubeh%C3%B6r" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      iPad Pro / Air Schutzhüllen
                    </Link>
                    <Link to="/catalog?brand=Apple&category=Power%20%26%20Charging" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      30W USB-C PD Netzteile
                    </Link>
                    <Link to="/catalog?search=lightning" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      MFi Lightning & USB-C Kabel
                    </Link>
                    <Link to="/catalog?search=magsafe" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      MagSafe Magnetisches Zubehör
                    </Link>
                  </div>
                </div>
              )}

              {/* SUB-LEVEL: SAMSUNG */}
              {mobileCurrentCategory === 'samsung' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCurrentCategory(null)}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-100 border-b border-gray-100 cursor-pointer font-medium"
                  >
                    <Layers size={14} className="text-gray-500" />
                    <span>{isGerman ? 'Alle Kategorien anzeigen' : 'Show all categories'}</span>
                  </button>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Samsung
                  </div>
                  <Link
                    to="/catalog?brand=Samsung"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 font-bold text-[#1976d2] bg-blue-50/40 hover:bg-blue-50 border-b border-gray-100 text-xs"
                  >
                    {isGerman ? 'Alle Samsung-Artikel anzeigen' : 'Show Samsung'}
                  </Link>
                  <div className="divide-y divide-gray-100">
                    <Link to="/catalog?brand=Samsung&device=Galaxy%20S24%20Ultra" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Galaxy S24 Ultra
                    </Link>
                    <Link to="/catalog?brand=Samsung&device=Galaxy%20S24" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Galaxy S24 & S24+
                    </Link>
                    <Link to="/catalog?brand=Samsung&device=Galaxy%20Tab%20A9%2B" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Galaxy Tab A9+ WiFi / 5G
                    </Link>
                    <Link to="/catalog?search=book%20cover" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Samsung Smart Book Cover Folio
                    </Link>
                    <Link to="/catalog?search=galaxy%20watch" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Galaxy Watch 7 / 6 Armbänder
                    </Link>
                    <Link to="/catalog?search=ep-t4510" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Super Fast Charging 2.0 45W
                    </Link>
                    <Link to="/catalog?brand=Samsung&category=Cases%20%26%20Covers" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Samsung Original Clear Cover
                    </Link>
                  </div>
                </div>
              )}

              {/* SUB-LEVEL: OTHER DEVICES */}
              {mobileCurrentCategory === 'other' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCurrentCategory(null)}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-100 border-b border-gray-100 cursor-pointer font-medium"
                  >
                    <Layers size={14} className="text-gray-500" />
                    <span>{isGerman ? 'Alle Kategorien anzeigen' : 'Show all categories'}</span>
                  </button>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-[#2b78c5] uppercase tracking-wider">
                    {isGerman ? 'weitere Geräte' : 'other devices'}
                  </div>
                  <Link
                    to="/catalog?device=All"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 font-bold text-[#1976d2] bg-blue-50/40 hover:bg-blue-50 border-b border-gray-100 text-xs"
                  >
                    {isGerman ? 'Alle weiteren Geräte anzeigen' : 'Show other devices'}
                  </Link>
                  <div className="divide-y divide-gray-100">
                    <Link to="/catalog?brand=Xiaomi" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Xiaomi Redmi Note 13 Pro+ 5G & Powerbanks
                    </Link>
                    <Link to="/catalog?brand=Motorola" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Motorola moto g17 & G-Serie
                    </Link>
                    <Link to="/catalog?category=Gadgets%20%26%20Mounts" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Universal Kfz-Halterungen & MagSafe
                    </Link>
                    <Link to="/catalog?search=stand" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Aluminium Tischständer & Docking Stations
                    </Link>
                    <Link to="/catalog?category=Cables%20%26%20Adapters" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                      Universal Multi-Ladekabel 3-in-1
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Offcanvas Footer (ThemeWare Utility Area) */}
            <div className="bg-[#f7f8fa] border-t border-gray-200 p-4 space-y-3 shrink-0 text-xs">
              {/* Language Selector */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600 text-[11px]">{isGerman ? 'Sprache / Language:' : 'Language:'}</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('de')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border ${
                      isGerman ? 'bg-white border-gray-400 text-gray-900 shadow-2xs font-bold' : 'bg-gray-100 border-transparent text-gray-600'
                    }`}
                  >
                    🇩🇪 DE
                  </button>
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('en')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border ${
                      !isGerman ? 'bg-white border-gray-400 text-gray-900 shadow-2xs font-bold' : 'bg-gray-100 border-transparent text-gray-600'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>

              {/* User Account / Login */}
              {isLoggedIn ? (
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 truncate max-w-[180px]">{user?.companyName}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    {isApproved && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        B2B
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center w-full py-1.5 bg-[#0B1E3F] text-white rounded font-bold text-xs"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold text-xs cursor-pointer"
                  >
                    {isGerman ? 'Abmelden' : 'Logout'}
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded font-bold text-xs"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-[#00D2C4] hover:bg-[#00baa7] text-[#061224] rounded font-bold text-xs shadow-xs"
                  >
                    {isGerman ? 'Konto eröffnen' : 'Open Account'}
                  </Link>
                </div>
              )}

              {/* Support & Legal Links */}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-[11px] text-gray-500">
                <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="hover:underline">{isGerman ? 'Katalog' : 'Catalog'}</Link>
                <Link to="/rma" onClick={() => setMobileMenuOpen(false)} className="hover:underline">RMA</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:underline">{isGerman ? 'Kontakt' : 'Contact'}</Link>
                <Link to="/shipping-payment" onClick={() => setMobileMenuOpen(false)} className="hover:underline">{isGerman ? 'Versand' : 'Shipping'}</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
