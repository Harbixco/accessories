import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('bc_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlistPulse, setWishlistPulse] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bc_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const triggerWishlistPulse = () => {
    setWishlistPulse(true);
    setTimeout(() => setWishlistPulse(false), 450);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => (item._id || item.sku) === productId
    );
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product._id || product.sku)) {
      setWishlist((prev) => [...prev, product]);
      triggerWishlistPulse();
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter((item) => (item._id || item.sku) !== productId)
    );
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.sku;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        wishlistPulse,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
