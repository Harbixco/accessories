import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Helper to determine active unit price according to quantity tier
export const calculateTierPrice = (product, quantity) => {
  if (!product || !product.basePrice) return 0;
  let unitPrice = product.basePrice;

  if (product.tieredPricing && product.tieredPricing.length > 0) {
    const tiers = [...product.tieredPricing].sort((a, b) => b.minQty - a.minQty);
    for (const tier of tiers) {
      if (quantity >= tier.minQty) {
        unitPrice = tier.price;
        break;
      }
    }
  }
  return unitPrice;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('bc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => {
    localStorage.setItem('bc_cart', JSON.stringify(items));
  }, [items]);

  const triggerCartPulse = () => {
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 450);
  };

  const addToCart = (product, quantity = null, openDrawer = true) => {
    const qtyToAdd = quantity || product.moq || 1;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.product._id || item.product.sku) === (product._id || product.sku)
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        const newQty = newItems[existingIndex].quantity + qtyToAdd;
        const unitPrice = calculateTierPrice(product, newQty);
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQty,
          unitPriceNet: unitPrice,
          totalPriceNet: Number((unitPrice * newQty).toFixed(2)),
        };
        return newItems;
      } else {
        const unitPrice = calculateTierPrice(product, qtyToAdd);
        return [
          ...prevItems,
          {
            product,
            quantity: qtyToAdd,
            unitPriceNet: unitPrice,
            totalPriceNet: Number((unitPrice * qtyToAdd).toFixed(2)),
          },
        ];
      }
    });

    triggerCartPulse();
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if ((item.product._id || item.product.sku) === productId) {
            const minAllowed = item.product.moq || 1;
            const validQty = Math.max(minAllowed, newQuantity);
            const unitPrice = calculateTierPrice(item.product, validQty);
            return {
              ...item,
              quantity: validQty,
              unitPriceNet: unitPrice,
              totalPriceNet: Number((unitPrice * validQty).toFixed(2)),
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => (item.product._id || item.product.sku) !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Wholesale Calculations
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalNet = Number(items.reduce((acc, i) => acc + i.totalPriceNet, 0).toFixed(2));
  const vatAmount = Number((totalNet * 0.19).toFixed(2));
  const shippingCostNet = totalNet >= 500 || totalNet === 0 ? 0 : 9.90;
  const totalGross = Number((totalNet + vatAmount + shippingCostNet).toFixed(2));

  const minOrderValue = 150.00;
  const isMovMet = totalNet >= minOrderValue;
  const amountToMov = Number(Math.max(0, minOrderValue - totalNet).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalNet,
        vatAmount,
        shippingCostNet,
        totalGross,
        minOrderValue,
        isMovMet,
        amountToMov,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartPulse,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
