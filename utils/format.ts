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

/**
 * Formats a date as a string in 'Month Day, Year' format
 * @param date - The date to format
 * @returns The formatted date string
 * @example
 * formatDate(new Date('2023-10-05')) // returns "October 5, 2023"
 */
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
