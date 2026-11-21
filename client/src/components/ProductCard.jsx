import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Check, Tag, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { isApproved } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const isGerman = i18n.language?.startsWith('de');
  const name = isGerman ? (product.name?.de || product.name?.en) : (product.name?.en || product.name?.de);

  const [quantity, setQuantity] = useState(product.moq || 1);
  const [added, setAdded] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);
  const [showTierTooltip, setShowTierTooltip] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity, true);
    setAdded(true);
    addToast({
      title: isGerman ? 'In den Warenkorb gelegt' : 'Added to Shopping Cart',
      message: `${quantity}x ${name}`,
      type: 'cart',
    });
    setTimeout(() => setAdded(false), 1200);
  };

  const productId = product._id || product.sku;
  const inWishlist = isInWishlist(productId);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartPulsing(true);
    const addedToWishlist = toggleWishlist(product);
    addToast({
      title: addedToWishlist
        ? (isGerman ? 'Auf Wunschzettel gemerkt' : 'Saved to Wishlist')
        : (isGerman ? 'Vom Wunschzettel entfernt' : 'Removed from Wishlist'),
      message: name,
      type: 'wishlist',
      duration: 2500,
    });
    setTimeout(() => setHeartPulsing(false), 400);
  };

  // Approximate commercial UVP / MSRP (typically ~1.45x net for consumer electronics)
  const estimatedUvp = product.basePrice ? (product.basePrice * 1.45).toFixed(2) : null;
  const lowestTier = product.tieredPricing && product.tieredPricing.length > 0
    ? [...product.tieredPricing].sort((a, b) => a.price - b.price)[0]
    : null;

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 rounded transition-all duration-300 ease-out flex flex-col h-full group p-3.5 relative">
      {/* Top Image Canvas with Spec Icons */}
      <div className="relative aspect-square mb-2.5 flex items-center justify-center bg-white overflow-hidden">
        <Link to={`/product/${productId}`} className="w-full h-full flex items-center justify-center p-2">
          <img
            src={product.images?.[0] || '/products/case-clear.jpg'}
            alt={name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/products/case-clear.jpg';
            }}
            className="max-h-full max-w-full object-contain group-hover:scale-106 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Energy Label (A/B/C) */}
        {product.energyClass && (
          <div className="absolute top-2 right-12 z-10 flex items-center">
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-l text-white ${
                product.energyClass === 'A'
                  ? 'bg-emerald-600'
                  : product.energyClass === 'B'
                  ? 'bg-lime-600'
                  : 'bg-yellow-500'
              }`}
            >
              {product.energyClass}
            </span>
            <span className="text-[8px] bg-gray-200 text-gray-700 px-1 py-0.5 font-bold rounded-r border border-l-0 border-gray-300">
              G
            </span>
          </div>
        )}

        {/* Spec Icons Column */}
        {product.features && product.features.length > 0 && (
          <div className="absolute top-2 right-1.5 flex flex-col gap-1 z-10 text-[9px] text-gray-600">
            {product.features.map((feat, i) => (
              <span
                key={i}
                className="w-6 h-5 border border-gray-300 bg-white/95 rounded-xs flex items-center justify-center font-bold text-[8px] text-blue-700 shadow-2xs uppercase"
                title={feat}
              >
                {feat === 'Bluetooth' ? 'ᛒ' : feat === 'Wi-Fi' ? 'Wi-Fi' : feat === 'NFC' ? 'N' : feat}
              </span>
            ))}
          </div>
        )}

        {/* Packaging Unit (VPE) Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-gray-100/90 border border-gray-300 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
            VPE: {product.moq || 1}
          </span>
        </div>

        {/* Bundle Badge */}
        {product.bundleBadge && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-red-600 text-white text-[10px] font-black tracking-wider px-2 py-0.5 rounded-xs uppercase shadow-xs">
              {product.bundleBadge}
            </span>
          </div>
        )}

        {/* Wishlist Heart Toggle with Haptic Pop Animation */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute bottom-2 right-2 z-20 p-1.5 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-red-500 transition shadow-xs border border-gray-200 cursor-pointer active:scale-90 ${
            heartPulsing ? 'animate-heart-pop' : ''
          }`}
          title={inWishlist ? (isGerman ? 'Vom Wunschzettel entfernen' : 'Remove from Wishlist') : (isGerman ? 'Auf den Wunschzettel' : 'Add to Wishlist')}
        >
          <Heart
            size={13}
            className={`transition-colors duration-200 ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Centered Product details button */}
      <div className="text-center mb-2">
        <Link
          to={`/product/${productId}`}
          className="inline-block border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black text-[11px] font-semibold px-4 py-1 rounded-xs bg-[#fafbfc] hover:bg-white transition-all shadow-2xs hover:shadow-xs"
        >
          {t('card.productDetails')}
        </Link>
      </div>

      {/* Title with Live Radar-Pulsing Green Stock Indicator */}
      <div className="flex-1 mb-2">
        <div className="flex items-start space-x-1.5">
          <span className="relative flex h-2.5 w-2.5 mt-1 shrink-0" title={t('card.inStock')}>
            <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Link
            to={`/product/${productId}`}
            className="text-xs font-semibold text-gray-900 hover:text-[#0B1E3F] line-clamp-2 leading-snug transition-colors"
          >
            {name}
          </Link>
        </div>
        <div className="text-[10px] text-gray-400 font-mono mt-1 pl-4 flex justify-between items-center">
          <span>{t('card.artNr')}: {product.sku}</span>
          {product.ean && <span className="text-[9px] text-gray-400 font-mono">{product.ean}</span>}
        </div>
      </div>

      {/* Pricing / Purchasing Area */}
      <div className="pt-2 border-t border-gray-100 mt-auto">
        {isApproved ? (
          <div className="space-y-1.5">
            {/* Dual Pricing: MSRP vs Dealer Net */}
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-base font-extrabold text-[#0B1E3F] tabular-nums">
                  {isGerman
                    ? `${product.basePrice?.toFixed(2).replace('.', ',')} € *`
                    : `€${product.basePrice?.toFixed(2)} *`}
                </span>
                {estimatedUvp && (
                  <span className="text-[10px] text-gray-400 line-through ml-2 tabular-nums">
                    UVP {isGerman ? `${estimatedUvp.replace('.', ',')} €` : `€${estimatedUvp}`}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 tabular-nums">
                {t('card.stock')}: <strong className="text-gray-800">{product.stock}</strong> {t('card.pieces')}
              </span>
            </div>

            {/* Tiered pricing pill with quick hover preview */}
            {lowestTier && (
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTierTooltip(true)}
                  onMouseLeave={() => setShowTierTooltip(false)}
                  className="w-full text-left text-[10px] text-blue-700 bg-blue-50/70 hover:bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 flex items-center justify-between cursor-help transition-colors"
                >
                  <span className="flex items-center gap-1 font-medium">
                    <Tag size={10} />
                    <span>
                      {isGerman
                        ? `ab ${lowestTier.minQty} Stk: ${lowestTier.price.toFixed(2).replace('.', ',')} € *`
                        : `from ${lowestTier.minQty} pcs: €${lowestTier.price.toFixed(2)} *`}
                    </span>
                  </span>
                  <span className="text-[9px] font-bold text-blue-600">Staffel ▾</span>
                </button>

                {/* Micro-Tooltip for Tier Table */}
                {showTierTooltip && (
                  <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-gray-300 shadow-xl rounded p-2 text-[10px] z-30 animate-dropdown">
                    <span className="font-bold text-gray-900 block mb-1">Mengenstaffel netto:</span>
                    {product.tieredPricing.map((tp, idx) => (
                      <div key={idx} className="flex justify-between py-0.5 border-b border-gray-100 last:border-0 tabular-nums">
                        <span className="text-gray-600">ab {tp.minQty} Stk.</span>
                        <strong className="text-[#0B1E3F]">
                          {isGerman ? `${tp.price.toFixed(2).replace('.', ',')} €` : `€${tp.price.toFixed(2)}`}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 pt-0.5">
              <input
                type="number"
                min={product.moq || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-xs border border-gray-300 py-1.5 font-bold text-gray-800 rounded-sm tabular-nums focus:border-[#0B1E3F] transition-colors"
              />
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-1.5 px-2 rounded-sm text-xs font-bold flex items-center justify-center space-x-1 transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-2xs ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-gradient-to-b from-[#102a54] to-[#0B1E3F] hover:from-[#16386b] hover:to-[#102a54] text-white hover:shadow-xs'
                }`}
              >
                {added ? (
                  <>
                    <Check size={12} className="stroke-[3]" />
                    <span>{t('card.inCart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={12} />
                    <span>{t('card.buy')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#fafbfc] border border-gray-200 py-2 px-2 rounded-xs text-center">
            <span className="block text-[10px] font-bold text-gray-700">
              {t('card.loginNotice')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
