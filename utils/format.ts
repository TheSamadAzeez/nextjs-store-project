/**
 * Formats a number as a USD currency string
 * @param amount - The amount to format. If null, defaults to 0
 * @returns The formatted currency string with USD symbol and commas
 * @example
 * formatCurrency(1234.56) // returns "$1,234.56"
 * formatCurrency(null) // returns "$0.00"
 */
export const formatCurrency = (amount: number | null) => {
  const value = amount || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
