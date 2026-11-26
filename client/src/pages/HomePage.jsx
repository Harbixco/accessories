import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/fallbackProducts';
import { sortAvailableFirst } from '../utils/productUtils';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { isApproved, token } = useAuth();
  const isGerman = i18n.language?.startsWith('de');

  const [products, setProducts] = useState(() => sortAvailableFirst(fallbackProducts));
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/products?limit=100');
        if (res.data.success && res.data.products && res.data.products.length > 0) {
          const apiProducts = res.data.products;
          const missingFallbacks = fallbackProducts.filter(
            (fb) => !apiProducts.some((p) => p.sku === fb.sku)
          );
          const merged = [...apiProducts, ...missingFallbacks].map((p) => {
            const fb = fallbackProducts.find((f) => f.sku === p.sku);
            return {
              ...fb,
              ...p,
              basePrice: (typeof p.basePrice === 'number' && p.basePrice > 0) ? p.basePrice : (fb?.basePrice ?? p.basePrice),
              tieredPricing: (p.tieredPricing && p.tieredPricing.length > 0) ? p.tieredPricing : (fb?.tieredPricing || []),
            };
          });
          setProducts(sortAvailableFirst(merged));
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchCatalog();
  }, [token, isApproved]);

  const categoryChips = [
    { key: 'All', de: 'Alle Artikel', en: 'All Articles' },
    { key: 'Laptops & Notebooks', de: 'Laptops & MacBooks (Lieferbar)', en: 'Laptops & MacBooks (In Stock)' },
    { key: 'Smartwatches & Wearables', de: 'Smartwatches (Demnächst)', en: 'Smartwatches (Coming Soon)' },
    { key: 'Smartphones & Endgeräte', de: 'Smartphones (Demnächst)', en: 'Smartphones (Coming Soon)' },
    { key: 'Power & Charging', de: 'Laden & Qi2 (Demnächst)', en: 'Power & Charging (Coming Soon)' },
    { key: 'Cables & Adapters', de: 'Kabel (Demnächst)', en: 'Cables (Coming Soon)' },
  ];

  const sortedProducts = sortAvailableFirst(products);
  const filteredProducts =
    selectedCategory === 'All'
      ? sortedProducts
      : sortedProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 1. TOP B2B HERO BANNER */}
      <section className="bg-[#0B1E3F] text-white rounded p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#162e5b]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#00d2c4]/20 border border-[#00d2c4]/40 px-2.5 py-1 rounded text-[11px] font-bold text-[#00d2c4]">
            <Sparkles size={13} />
            <span>{isGerman ? 'Laptops & MacBooks • Jetzt sofort ab Lager lieferbar' : 'Laptops & MacBooks • In Stock & Ready to Ship'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-normal leading-snug text-white">
            {t('home.title')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed max-w-xl">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <Link
            to="/register"
            className="bg-[#00d2c4] hover:bg-[#00bfae] text-[#061224] text-xs font-bold px-5 py-2.5 rounded transition text-center whitespace-nowrap active:scale-[0.98] shadow-xs"
          >
            {t('home.ctaRegister')}
          </Link>
          <button
            onClick={() => setSelectedCategory('Laptops & Notebooks')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-semibold px-4 py-2.5 rounded transition text-center whitespace-nowrap active:scale-[0.98] cursor-pointer"
          >
            {isGerman ? 'Laptops & MacBooks ansehen' : 'View Laptops & MacBooks'}
          </button>
        </div>
      </section>

      {/* 2. DIVERSE WHOLESALE PRODUCT CATALOG GRID WITH FAST FILTER TABS */}
      <section className="space-y-3">
        <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {t('home.catalogHeadline')}
            </h2>
            <span className="text-xs text-gray-500 tabular-nums">
              {filteredProducts.length} {t('home.articlesAvailable')}
            </span>
          </div>

          {/* Instant Category Filter Chips (No reload) */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {categoryChips.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95 ${
                  selectedCategory === cat.key
                    ? 'bg-[#0B1E3F] text-white font-bold shadow-2xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                {isGerman ? cat.de : cat.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 24).map((p, idx) => (
            <ProductCard key={p._id || p.sku || idx} product={p} />
          ))}
        </div>

        {/* B2B Catalog Discovery CTA */}
        <div className="flex justify-center pt-8 pb-4">
          <Link
            to="/catalog"
            className="group inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 bg-[#00d2c4] hover:bg-[#00bfae] text-[#061224] text-sm sm:text-base font-bold rounded shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span>{isGerman ? 'Gesamtes Sortiment anzeigen (1.500+ Artikel)' : 'Explore Full Wholesale Catalog (1,500+ Items)'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
