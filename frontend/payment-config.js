'use strict';

/**
 * CENTRALIZED PAYMENT CONFIGURATION
 * ==================================
 * 
 * This module centralizes all Paddle payment configuration.
 * Do not scatter payment credentials or price IDs across the codebase.
 * 
 * All values are production environment only.
 * Never use sandbox tokens or test prices.
 */

const PAYMENT_CONFIG = {
  // Paddle production client-side token
  paddleToken: 'live_e6b6b97077f98b60b8d40def0e3',
  
  // Paddle production price IDs
  setupPriceId: 'pri_01m1shqcndzt6xxxlkcq4nz4ptv',
  monthlyPriceId: 'pri_01m1sj4rgc3px4x85yppq5ysh2',
  
  // Success redirect
  successUrl: 'https://dentalai.site/onboarding',
  
  // Pricing display (for reference)
  pricing: {
    setupFee: 500,
    monthlyRecurring: 500,
    dueToday: 1000
  }
};

/**
 * Validate that a Paddle price ID matches the expected format
 * @param {string} value - The price ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePaddlePriceId(value) {
  if (typeof value !== 'string') {
    console.error('[Paddle Validation] Price ID is not a string:', typeof value);
    return false;
  }
  
  const trimmed = String(value).trim();
  const isValid = /^pri_[a-zA-Z0-9]+$/.test(trimmed);
  
  if (!isValid) {
    console.error('[Paddle Validation] Invalid price ID format:', trimmed);
  }
  
  return isValid;
}

/**
 * Validate the entire payment configuration before checkout
 * @returns {boolean} - True if all values are valid, false otherwise
 */
function validatePaymentConfig() {
  console.log('[Payment Config] Validating configuration...');
  
  const errors = [];
  
  if (!PAYMENT_CONFIG.paddleToken || typeof PAYMENT_CONFIG.paddleToken !== 'string') {
    errors.push('Paddle token is missing or invalid');
  }
  
  if (!validatePaddlePriceId(PAYMENT_CONFIG.setupPriceId)) {
    errors.push(`Setup price ID is invalid: "${PAYMENT_CONFIG.setupPriceId}"`);
  }
  
  if (!validatePaddlePriceId(PAYMENT_CONFIG.monthlyPriceId)) {
    errors.push(`Monthly price ID is invalid: "${PAYMENT_CONFIG.monthlyPriceId}"`);
  }
  
  if (errors.length > 0) {
    console.error('[Payment Config] Configuration errors:', errors);
    return false;
  }
  
  console.log('[Payment Config] ✅ Configuration is valid');
  return true;
}

/**
 * Get clean, trimmed price IDs for checkout
 * @returns {object} - { setupPriceId, monthlyPriceId } or null if invalid
 */
function getCleanPriceIds() {
  if (!validatePaymentConfig()) {
    return null;
  }
  
  return {
    setupPriceId: String(PAYMENT_CONFIG.setupPriceId).trim(),
    monthlyPriceId: String(PAYMENT_CONFIG.monthlyPriceId).trim()
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PAYMENT_CONFIG,
    validatePaddlePriceId,
    validatePaymentConfig,
    getCleanPriceIds
  };
}
