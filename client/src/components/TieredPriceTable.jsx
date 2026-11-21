import React from 'react';
import { useTranslation } from 'react-i18next';

const TieredPriceTable = ({ tieredPricing, basePrice, moq }) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language.startsWith('de');

  if (!tieredPricing || tieredPricing.length === 0) return null;

  const sortedTiers = [
    { minQty: moq || 1, price: basePrice },
    ...tieredPricing,
  ].sort((a, b) => a.minQty - b.minQty);

  return (
    <div className="border border-gray-200 rounded overflow-hidden text-xs my-3 bg-white">
      <div className="bg-gray-100 px-3 py-1.5 font-bold text-gray-700 text-[11px] border-b border-gray-200 flex justify-between">
        <span>{t('product.tieredTitle')}</span>
        <span className="font-normal text-gray-500">{t('product.exclVat')}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[280px]">
          <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="py-1.5 px-3">{t('product.tableQuantity')}</th>
              <th className="py-1.5 px-3 text-right">{t('product.tableUnitPrice')}</th>
              <th className="py-1.5 px-3 text-right">{t('product.tableSavings')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTiers.map((tier, idx) => {
              const savingsPct =
                basePrice > 0 ? Math.round(((basePrice - tier.price) / basePrice) * 100) : 0;

              const formattedPrice = isGerman
                ? `${tier.price.toFixed(2).replace('.', ',')} € *`
                : `€${tier.price.toFixed(2)} *`;

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-1.5 px-3 font-medium text-gray-800">
                    {t('product.fromUnits', { count: tier.minQty })}
                  </td>
                  <td className="py-1.5 px-3 font-bold text-[#0B1E3F] text-right">
                    {formattedPrice}
                  </td>
                  <td className="py-1.5 px-3 text-right text-emerald-700 font-semibold">
                    {savingsPct > 0 ? `-${savingsPct}%` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TieredPriceTable;
