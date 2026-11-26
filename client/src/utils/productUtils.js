/**
 * Helper to determine if a product is a Laptop / Notebook.
 */
export const isLaptop = (product) => {
  if (!product) return false;
  const sku = (product.sku || '').toLowerCase();
  const nameEn = (product.name?.en || '').toLowerCase();
  const nameDe = (product.name?.de || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  return (
    sku.startsWith('bca-lap-') ||
    cat.includes('laptop') ||
    cat.includes('notebook') ||
    nameEn.includes('macbook') ||
    nameDe.includes('macbook') ||
    nameEn.includes('thinkpad') ||
    nameDe.includes('thinkpad') ||
    nameEn.includes('surface laptop') ||
    nameDe.includes('surface laptop')
  );
};

/**
 * Helper to determine if a product is an available item.
 * Laptops are available now; other lines display Coming Soon.
 */
export const isProductAvailable = (product) => {
  if (!product) return false;
  if (product.isAvailable !== undefined) return Boolean(product.isAvailable);
  if (product.isComingSoon !== undefined) return !product.isComingSoon;

  return isLaptop(product);
};

/**
 * Sorts an array of products so that in-stock / available products (Laptops) appear first.
 */
export const sortAvailableFirst = (products = []) => {
  return [...products].sort((a, b) => {
    const aLap = isLaptop(a);
    const bLap = isLaptop(b);
    if (aLap && !bLap) return -1;
    if (!aLap && bLap) return 1;

    const aAvail = isProductAvailable(a);
    const bAvail = isProductAvailable(b);
    if (aAvail && !bAvail) return -1;
    if (!aAvail && bAvail) return 1;

    return 0;
  });
};
