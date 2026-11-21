import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Heart, Trash2, ShoppingCart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { t, i18n } = useTranslation();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isApproved } = useAuth();
  const { addToast } = useToast();
  const isGerman = i18n.language?.startsWith('de');

  const formatPrice = (val) =>
    isGerman ? `${val.toFixed(2).replace('.', ',')} € *` : `€${val.toFixed(2)} *`;

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, item.moq || 1, false);
    });
    addToast({
      title: isGerman ? 'Warenkorb aktualisiert' : 'Cart updated',
      message: isGerman
        ? `${wishlist.length} Artikel in den Warenkorb übertragen`
        : `Moved ${wishlist.length} articles to cart`,
      type: 'cart',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{t('nav.wishlist')}</span>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isGerman ? 'Mein Wunschzettel' : 'My Wishlist'} ({wishlist.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isGerman
              ? 'Ihre gemerkten Artikel für zukünftige Großhandelsbestellungen.'
              : 'Saved articles for your upcoming wholesale orders.'}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center space-x-2">
            {isApproved && (
              <button
                onClick={handleAddAllToCart}
                className="bg-[#0B1E3F] hover:bg-[#162e5b] text-white text-xs font-bold px-4 py-2 rounded transition flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <ShoppingCart size={14} />
                <span>{isGerman ? 'Alle in den Warenkorb' : 'Move All to Cart'}</span>
              </button>
            )}
            <button
              onClick={clearWishlist}
              className="text-xs text-gray-500 hover:text-red-600 underline px-2 py-1 cursor-pointer"
            >
              {isGerman ? 'Wunschzettel leeren' : 'Clear Wishlist'}
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center space-y-3 max-w-md mx-auto">
          <Heart size={44} className="mx-auto text-gray-300 stroke-[1.5]" />
          <h2 className="text-base font-bold text-gray-800">
            {isGerman ? 'Ihr Wunschzettel ist derzeit leer' : 'Your wishlist is currently empty'}
          </h2>
          <p className="text-xs text-gray-500">
            {isGerman
              ? 'Klicken Sie bei beliebigen Produkten auf das Herz-Symbol, um Artikel für spätere Bestellungen zu speichern.'
              : 'Click the heart icon on any product to save it for your future wholesale orders.'}
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-1.5 bg-[#0B1E3F] hover:bg-[#162e5b] text-white text-xs font-bold px-5 py-2.5 rounded transition shadow-xs"
          >
            <span>{isGerman ? 'Zum B2B Sortiment' : 'Browse Wholesale Catalog'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((item) => {
            const name = isGerman
              ? item.name?.de || item.name?.en
              : item.name?.en || item.name?.de;
            const itemId = item._id || item.sku;

            return (
              <div
                key={itemId}
                className="bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md hover:-translate-y-1 rounded p-4 flex flex-col justify-between transition-all duration-300 ease-out relative group"
              >
                {/* Remove button */}
                <button
                  onClick={() => {
                    removeFromWishlist(itemId);
                    addToast({
                      title: isGerman ? 'Wunschzettel' : 'Wishlist',
                      message: isGerman ? `${name} entfernt` : `Removed ${name}`,
                      type: 'wishlist',
                      duration: 2000,
                    });
                  }}
                  className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-600 transition p-1 cursor-pointer z-10 hover:scale-110 active:scale-90"
                  title={isGerman ? 'Entfernen' : 'Remove'}
                >
                  <Trash2 size={15} />
                </button>

                <div className="space-y-3">
                  <Link
                    to={`/product/${itemId}`}
                    className="aspect-square flex items-center justify-center p-2 bg-white overflow-hidden"
                  >
                    <img
                      src={item.images?.[0]}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="max-h-44 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div>
                    <span className="text-[10px] text-gray-400 font-mono block">SKU: {item.sku}</span>
                    <Link
                      to={`/product/${itemId}`}
                      className="text-xs font-semibold text-gray-900 hover:text-[#0B1E3F] line-clamp-2 mt-0.5 transition-colors"
                    >
                      {name}
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 space-y-2">
                  <div className="flex justify-between items-baseline">
                    {isApproved ? (
                      <span className="text-sm font-extrabold text-[#0B1E3F] tabular-nums">
                        {formatPrice(item.basePrice)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-600">
                        {t('card.loginNotice')}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      {isGerman ? 'Lager:' : 'Stock:'} {item.stock} {t('card.pieces')}
                    </span>
                  </div>

                  {isApproved && (
                    <button
                      onClick={() => {
                        addToCart(item, item.moq || 1, true);
                        addToast({
                          title: isGerman ? 'In den Warenkorb gelegt' : 'Added to Cart',
                          message: `${item.moq || 1}x ${name}`,
                          type: 'cart',
                        });
                      }}
                      className="w-full bg-[#0B1E3F] hover:bg-[#162e5b] text-white py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-2xs hover:shadow-xs"
                    >
                      <ShoppingCart size={13} />
                      <span>{t('card.buy')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
