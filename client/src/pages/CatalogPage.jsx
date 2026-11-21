import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/fallbackProducts';
import { ChevronRight, ChevronLeft, Filter, ChevronDown } from 'lucide-react';

const PRODUCTS_PER_PAGE = 60;

const CatalogPage = () => {
  const { t, i18n } = useTranslation();
  const { token, isApproved } = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialBrand = queryParams.get('brand') || 'All';
  const initialSearch = queryParams.get('search') || '';

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState(fallbackProducts.slice(0, PRODUCTS_PER_PAGE));
  const [total, setTotal] = useState(fallbackProducts.length);

  const isGerman = i18n.language?.startsWith('de');

  const categories = [
    { key: 'Smartwatches & Wearables', de: 'Smartwatches & Wearables', en: 'Smartwatches & Wearables' },
    { key: 'Smartphones & Endgeräte', de: 'Smartphones & Endgeräte', en: 'Smartphones & Devices' },
    { key: 'Tablets & Zubehör', de: 'Tablets & Zubehör', en: 'Tablets & Accessories' },
    { key: 'Cases & Covers', de: 'Cases & Covers', en: 'Cases & Covers' },
    { key: 'Power & Charging', de: 'Laden & Stromversorgung', en: 'Power & Charging' },
    { key: 'Cables & Adapters', de: 'Kabel & Adapter', en: 'Cables & Adapters' },
    { key: 'Gadgets & Mounts', de: 'Gadgets & Halterungen', en: 'Gadgets & Mounts' },
  ];

  const brands = ['Apple', 'Samsung', 'Otterbox', 'anco', 'Xiaomi', 'Motorola', 'PopSockets', 'Guess'];
  const devices = [
    'iPhone 16 Pro',
    'iPhone 16 Pro Max',
    'Galaxy S24 Ultra',
    'Galaxy S24',
    'Galaxy Tab A9+',
    'Universal',
  ];

  const handleBrandChange = (b) => {
    setSelectedBrand(b);
    setPage(1);
  };

  const handleCategoryChange = (c) => {
    setSelectedCategory(c);
    setPage(1);
  };

  const handleDeviceChange = (d) => {
    setSelectedDevice(d);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedDevice('All');
    setSearch('');
    setPage(1);
  };

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedBrand !== 'All') params.append('brand', selectedBrand);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedDevice !== 'All') params.append('device', selectedDevice);
        if (search.trim()) params.append('search', search.trim());
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', PRODUCTS_PER_PAGE);

        const res = await axios.get(`/api/products?${params.toString()}`);
        if (res.data.success && res.data.products) {
          const merged = res.data.products.map((p) => {
            const fb = fallbackProducts.find((f) => f.sku === p.sku);
            return {
              ...p,
              basePrice: (typeof p.basePrice === 'number' && p.basePrice > 0) ? p.basePrice : (fb?.basePrice ?? p.basePrice),
              tieredPricing: (p.tieredPricing && p.tieredPricing.length > 0) ? p.tieredPricing : (fb?.tieredPricing || []),
            };
          });
          setProducts(merged);
          setTotal(res.data.total);
          setTotalPages(res.data.pages || Math.ceil(res.data.total / PRODUCTS_PER_PAGE) || 1);
          return;
        }
      } catch (e) {
        // Fallback filter locally
      }

      let filtered = [...fallbackProducts];
      if (selectedBrand !== 'All') {
        filtered = filtered.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
      }
      if (selectedCategory !== 'All') {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
      if (selectedDevice !== 'All') {
        filtered = filtered.filter((p) =>
          p.compatibleDevices?.some((d) => d.toLowerCase().includes(selectedDevice.toLowerCase()))
        );
      }
      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.de.toLowerCase().includes(s) ||
            p.name.en.toLowerCase().includes(s) ||
            p.sku.toLowerCase().includes(s)
        );
      }
      setTotal(filtered.length);
      const computedPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE) || 1;
      setTotalPages(computedPages);

      const start = (page - 1) * PRODUCTS_PER_PAGE;
      setProducts(filtered.slice(start, start + PRODUCTS_PER_PAGE));
    };

    fetchFiltered();
  }, [selectedBrand, selectedCategory, selectedDevice, search, sort, page, token, isApproved]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{t('nav.catalog')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-3">
          {/* Mobile Filter Toggle Button (< lg) */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden w-full bg-white border border-gray-300 rounded p-3 flex items-center justify-between text-xs font-bold text-gray-800 shadow-2xs cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <Filter size={14} className="text-[#0B1E3F]" />
              <span>
                {t('filters.title')}
                {(selectedBrand !== 'All' || selectedCategory !== 'All' || selectedDevice !== 'All') && (
                  <span className="ml-1.5 bg-[#0B1E3F] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    1+
                  </span>
                )}
              </span>
            </span>
            <span className="flex items-center space-x-1 text-gray-500 text-[11px]">
              <span>{mobileFilterOpen ? (isGerman ? 'Ausblenden' : 'Hide') : (isGerman ? 'Einblenden' : 'Show')}</span>
              <ChevronDown size={14} className={`transform transition-transform duration-200 ${mobileFilterOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {/* Filter Container: Always visible on >= lg, collapsible on < lg */}
          <div className={`bg-white border border-gray-200 rounded p-4 space-y-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center space-x-1">
                <Filter size={13} />
                <span>{t('filters.title')}</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-gray-500 hover:text-red-600 underline cursor-pointer"
              >
                {t('filters.reset')}
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">{t('filters.deviceModel')}</label>
              <select
                value={selectedDevice}
                onChange={(e) => handleDeviceChange(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-gray-800"
              >
                <option value="All">{t('filters.allDevices')}</option>
                {devices.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">{t('filters.manufacturer')}</label>
              <div className="space-y-1 text-xs">
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="brandRadio"
                    checked={selectedBrand === 'All'}
                    onChange={() => handleBrandChange('All')}
                  />
                  <span>{t('filters.allManufacturers')}</span>
                </label>
                {brands.map((b, i) => (
                  <label key={i} className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="brandRadio"
                      checked={selectedBrand === b}
                      onChange={() => handleBrandChange(b)}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">{t('filters.category')}</label>
              <div className="space-y-1 text-xs">
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="catRadio"
                    checked={selectedCategory === 'All'}
                    onChange={() => handleCategoryChange('All')}
                  />
                  <span>{t('filters.allCategories')}</span>
                </label>
                {categories.map((c, i) => (
                  <label key={i} className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="catRadio"
                      checked={selectedCategory === c.key}
                      onChange={() => handleCategoryChange(c.key)}
                    />
                    <span>{isGerman ? c.de : c.en}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <span className="text-gray-600 font-medium">
              {t('filters.foundArticles')}: <strong className="text-gray-900">{total}</strong>
              {total > 0 && (
                <span className="text-gray-400 ml-2">
                  ({isGerman ? `Seite ${page} von ${totalPages} • 60 pro Seite` : `Page ${page} of ${totalPages} • 60 per page`})
                </span>
              )}
            </span>
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <span className="text-gray-500">{t('filters.sortBy')}:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 bg-white"
              >
                <option value="newest">{t('filters.sortNewest')}</option>
                <option value="price-low">{t('filters.sortPriceLow')}</option>
                <option value="price-high">{t('filters.sortPriceHigh')}</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid: single on mobile, 2 on sm, 3 on md/lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p, idx) => (
              <ProductCard key={p._id || p.sku || idx} product={p} />
            ))}
          </div>

          {/* 60 Products per Page Pagination Bar (OBizZone / ThemeWare benchmark) */}
          {totalPages > 1 && (
            <div className="bg-white border border-gray-200 rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs mt-6 shadow-2xs">
              <span className="text-gray-500 text-xs">
                {isGerman
                  ? `Zeige ${(page - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(page * PRODUCTS_PER_PAGE, total)} von ${total} Artikeln`
                  : `Showing ${(page - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(page * PRODUCTS_PER_PAGE, total)} of ${total} products`}
              </span>

              <nav className="flex items-center space-x-1.5" aria-label="Pagination">
                {/* Prev Button */}
                <button
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }
                  }}
                  disabled={page === 1}
                  className={`px-3 py-1.5 rounded border text-xs font-bold transition flex items-center space-x-1 ${
                    page === 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'border-gray-300 text-gray-700 hover:bg-[#0B1E3F] hover:text-white hover:border-[#0B1E3F] cursor-pointer active:scale-95'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={14} />
                  <span>{isGerman ? 'Vorherige' : 'Previous'}</span>
                </button>

                {/* Numbered Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      setPage(pNum);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`min-w-8 h-8 px-2 rounded border text-xs font-bold transition cursor-pointer active:scale-95 ${
                      pNum === page
                        ? 'bg-[#0B1E3F] text-white border-[#0B1E3F] shadow-xs'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                    aria-current={pNum === page ? 'page' : undefined}
                  >
                    {pNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => {
                    if (page < totalPages) {
                      setPage(page + 1);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }
                  }}
                  disabled={page === totalPages}
                  className={`px-3 py-1.5 rounded border text-xs font-bold transition flex items-center space-x-1 ${
                    page === totalPages
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'border-gray-300 text-gray-700 hover:bg-[#0B1E3F] hover:text-white hover:border-[#0B1E3F] cursor-pointer active:scale-95'
                  }`}
                  aria-label="Next Page"
                >
                  <span>{isGerman ? 'Nächste' : 'Next'}</span>
                  <ChevronRight size={14} />
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
