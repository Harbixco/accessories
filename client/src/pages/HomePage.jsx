import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/fallbackProducts';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  const [products, setProducts] = useState(fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/products?limit=100');
        if (res.data.success && res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchCatalog();
  }, []);

  const categoryChips = [
    { key: 'All', de: 'Alle Artikel', en: 'All Articles' },
    { key: 'Smartwatches & Wearables', de: 'Smartwatches', en: 'Smartwatches' },
    { key: 'Smartphones & Endgeräte', de: 'Smartphones', en: 'Smartphones' },
    { key: 'Cases & Covers', de: 'Cases & Schutz', en: 'Cases & Protection' },
    { key: 'Power & Charging', de: 'Laden & Qi2', en: 'Charging & Qi2' },
    { key: 'Cables & Adapters', de: 'Kabel & Adapter', en: 'Cables & Adapters' },
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 1. TOP B2B HERO BANNER */}
      <section className="bg-[#0B1E3F] text-white rounded p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#162e5b]">
        <div className="space-y-2 max-w-2xl">
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
          <Link
            to="/catalog"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-semibold px-4 py-2.5 rounded transition text-center whitespace-nowrap active:scale-[0.98]"
          >
            {t('home.ctaCatalog')}
          </Link>
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
          {filteredProducts.slice(0, 12).map((p, idx) => (
            <ProductCard key={p._id || p.sku || idx} product={p} />
          ))}
        </div>

        {/* 6. "ALLE PRODUKTE ANSEHEN" / "VIEW ALL PRODUCTS" BUTTON (Matching Open Dealer Account Color) */}
        <div className="flex justify-center pt-6 pb-2">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center min-h-[48px] px-8 sm:px-12 py-3 bg-[#00d2c4] hover:bg-[#00bfae] text-black border-2 border-black rounded-[8px] text-sm sm:text-base font-black tracking-wider uppercase transition-all duration-150 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span>{isGerman ? 'ALLE PRODUKTE ANSEHEN' : 'VIEW ALL PRODUCTS'}</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
