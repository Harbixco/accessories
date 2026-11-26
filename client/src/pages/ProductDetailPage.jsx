import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart, calculateTierPrice } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import TieredPriceTable from '../components/TieredPriceTable';
import { fallbackProducts } from '../data/fallbackProducts';
import { isProductAvailable } from '../utils/productUtils';
import { ShoppingCart, Check, ChevronRight, Heart } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { isApproved, token } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const isGerman = i18n.language.startsWith('de');

  const [product, setProduct] = useState(() => {
    return fallbackProducts.find((p) => p._id === id || p.sku === id) || fallbackProducts[0];
  });
  const isAvailable = isProductAvailable(product);
  const [quantity, setQuantity] = useState(product?.moq || 1);
  const [added, setAdded] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        if (res.data.success && res.data.product) {
          const p = res.data.product;
          const fb = fallbackProducts.find((f) => f.sku === p.sku || f._id === p._id);
          const merged = {
            ...p,
            basePrice: (typeof p.basePrice === 'number' && p.basePrice > 0) ? p.basePrice : (fb?.basePrice ?? p.basePrice),
            tieredPricing: (p.tieredPricing && p.tieredPricing.length > 0) ? p.tieredPricing : (fb?.tieredPricing || []),
          };
          setProduct(merged);
          setQuantity(p.moq || 1);
          return;
        }
      } catch (err) {
        // Fallback
      }

      const match =
        fallbackProducts.find((p) => p._id === id || p.sku === id) || fallbackProducts[0];
      if (match) {
        setProduct(match);
        setQuantity(match.moq || 1);
      }
    };
    fetchProduct();
  }, [id, token, isApproved]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs">
        <p>{t('filters.noArticles')}</p>
        <Link to="/catalog" className="text-[#0B1E3F] underline font-bold mt-2 inline-block">
          {t('nav.catalog')}
        </Link>
      </div>
    );
  }

  const name = isGerman ? product.name?.de : product.name?.en;
  const description = isGerman ? product.description?.de : product.description?.en;
  const unitPrice = calculateTierPrice(product, quantity);
  const lineTotal = Number((unitPrice * quantity).toFixed(2));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    addToast({
      title: isGerman ? 'In den Warenkorb gelegt' : 'Added to Cart',
      message: `${quantity}x ${name}`,
      type: 'cart',
    });
    setTimeout(() => setAdded(false), 1200);
  };

  const handleToggleWishlist = () => {
    setHeartAnimating(true);
    const addedToWishlist = toggleWishlist(product);
    addToast({
      title: addedToWishlist
        ? (isGerman ? 'Wunschzettel' : 'Wishlist')
        : (isGerman ? 'Entfernt' : 'Removed'),
      message: addedToWishlist
        ? (isGerman ? `${name} gemerkt` : `Saved ${name}`)
        : (isGerman ? `${name} entfernt` : `Removed ${name}`),
      type: 'wishlist',
      duration: 2500,
    });
    setTimeout(() => setHeartAnimating(false), 400);
  };

  const formattedUnitPrice = isGerman
    ? `${unitPrice.toFixed(2).replace('.', ',')} € *`
    : `€${unitPrice.toFixed(2)} *`;

  const formattedLineTotal = isGerman
    ? `${lineTotal.toFixed(2).replace('.', ',')} €`
    : `€${lineTotal.toFixed(2)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Breadcrumb */}
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <Link to="/catalog" className="hover:underline">{t('nav.catalog')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800 truncate">{name}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Product Image */}
        <div className="md:col-span-5 flex items-center justify-center p-4 border border-gray-100 rounded bg-white">
          <img
            src={product.images?.[0] || '/products/case-clear.jpg'}
            alt={name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/products/case-clear.jpg';
            }}
            className="max-h-96 max-w-full object-contain"
          />
        </div>

        {/* Right: Product Details & Purchase Box */}
        <div className="md:col-span-7 space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              {product.brand}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5 leading-snug">
              {name}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1 font-mono">
              <span>{t('product.sku')}: {product.sku}</span>
              {product.ean && <span>• {t('product.ean')}: {product.ean}</span>}
            </div>
          </div>

          {isAvailable ? (
            <div className="text-xs text-gray-700 flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-medium">
                {t('product.readyToShip')} • {t('product.stockLevel')}: {product.stock} {t('product.units')}
              </span>
            </div>
          ) : (
            <div className="text-xs text-amber-900 flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="font-bold">
                {isGerman ? 'Demnächst verfügbar • Diese Modellreihe wird in Kürze freigeschaltet' : 'Coming Soon • This product line will be available soon'}
              </span>
            </div>
          )}

          {product.compatibleDevices && product.compatibleDevices.length > 0 && (
            <div className="text-xs text-gray-700">
              <span className="font-bold block mb-1">{t('product.fitsDevices')}</span>
              <div className="flex flex-wrap gap-1">
                {product.compatibleDevices.map((d, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] border border-gray-200">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
            {description}
          </div>

          <div className="border-t border-gray-200 pt-4">
            {isApproved ? (
              <div className="space-y-4">
                <TieredPriceTable
                  tieredPricing={product.tieredPricing}
                  basePrice={product.basePrice}
                  moq={product.moq}
                />

                <div className="bg-gray-50 border border-gray-200 rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-2xl font-extrabold text-[#0B1E3F]">
                      {formattedUnitPrice}
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      * {t('product.plusShipping')}
                    </span>
                    <span className="text-[11px] text-gray-600 font-semibold block mt-1">
                      {t('product.totalFor')} {quantity} {t('product.piecesNet')}: {formattedLineTotal}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isAvailable ? (
                      <>
                        <input
                          type="number"
                          min={product.moq || 1}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || 1))}
                          className="w-16 border border-gray-300 rounded p-2 text-center text-xs font-bold text-gray-800"
                        />
                        <button
                          onClick={handleAddToCart}
                          className={`flex-1 sm:flex-none px-6 py-2.5 rounded text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                            added
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0B1E3F] hover:bg-[#162e5b] text-white'
                          }`}
                        >
                          {added ? (
                            <>
                              <Check size={14} />
                              <span>{t('product.added')}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              <span>{t('product.addToCart')}</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-6 py-2.5 rounded text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 cursor-not-allowed select-none"
                      >
                        {isGerman ? 'Demnächst verfügbar' : 'Coming Soon'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`p-2.5 rounded border transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-90 ${
                        isInWishlist(product._id || product.sku)
                          ? 'border-red-300 bg-red-50 text-red-600 shadow-2xs'
                          : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-600'
                      }`}
                      title={isInWishlist(product._id || product.sku) ? (isGerman ? 'Auf dem Wunschzettel' : 'In Wishlist') : (isGerman ? 'Auf den Wunschzettel' : 'Add to Wishlist')}
                    >
                      <Heart
                        size={16}
                        className={`transition-colors duration-200 ${
                          isInWishlist(product._id || product.sku) ? 'fill-red-500 text-red-500' : 'text-gray-500'
                        } ${heartAnimating ? 'animate-heart-pop' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center space-y-2">
                <span className="text-sm font-bold text-gray-800 block">
                  {t('card.loginNotice')}
                </span>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {t('product.loginPrompt')}
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-[#0B1E3F] text-white text-xs font-bold px-5 py-2 rounded"
                >
                  {t('product.loginNow')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
