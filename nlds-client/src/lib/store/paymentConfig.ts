/**
 * NLDS'26 Store — Payment Configuration
 *
 * ⚠️  IMPORTANT: Replace ALL placeholder values below with the official
 * NLDS'26 bank account details before going live.
 *
 * These values are displayed to the customer on the checkout page.
 * The receipt upload is also required before order submission.
 */

export interface PaymentConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  referenceFormat: string;
  referenceExample: string;
}

/**
 * REPLACE THESE VALUES WITH THE OFFICIAL BANK DETAILS.
 */
export const PAYMENT_CONFIG: PaymentConfig = {
  bankName: "Hatton National Bank",
  accountName: "P. S. U. S. Perera",
  accountNumber: "003020588150",
  branch: "Head Office",
  referenceFormat: "Your full name + Entity",
  referenceExample: "Sasin Perera NSBM",
};
