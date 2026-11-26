/**
 * Helper to determine if a product is an available iPhone Case.
 * Currently, BC Accessories is launching with iPhone cases; other product lines display "Coming Soon".
 */
export const isIphoneCase = (product) => {
  if (!product) return false;
  if (product.isAvailable !== undefined) return Boolean(product.isAvailable);
  if (product.isComingSoon !== undefined) return !product.isComingSoon;

  const sku = (product.sku || '').toLowerCase();
  const nameEn = (product.name?.en || '').toLowerCase();
  const nameDe = (product.name?.de || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const devices = (product.compatibleDevices || []).map((d) => String(d).toLowerCase());

  // Aesthetic case lines
  if (sku.startsWith('bca-aes-') || sku.startsWith('bca-cas-aes-')) return true;

  // Check if compatible devices or name mentions iPhone and is a case/cover
  const mentionsIphone =
    devices.some((d) => d.includes('iphone')) ||
    nameEn.includes('iphone') ||
    nameDe.includes('iphone') ||
    sku.includes('ip16') ||
    sku.includes('ip15') ||
    sku.includes('ip14');

  const isCase =
    cat.includes('case') ||
    cat.includes('cover') ||
    nameEn.includes('case') ||
    nameDe.includes('hülle') ||
    nameEn.includes('cover');

  return mentionsIphone && isCase;
};

export const isProductAvailable = (product) => {
  return isIphoneCase(product);
};

/**
 * Sorts an array of products so that in-stock / available products (iPhone cases) appear first.
 */
export const sortAvailableFirst = (products = []) => {
  return [...products].sort((a, b) => {
    const aAvail = isProductAvailable(a);
    const bAvail = isProductAvailable(b);
    if (aAvail && !bAvail) return -1;
    if (!aAvail && bAvail) return 1;
    return 0;
  });
};
