/**
 * AI Feature Availability
 *
 * Controls whether AI-powered features are accessible to users.
 * When false, all AI-dependent interactions are blocked and the
 * maintenance modal is shown instead.
 *
 * Set NEXT_PUBLIC_AI_FEATURES_ENABLED=true in your .env to enable.
 */
export const AI_FEATURES_ENABLED =
  process.env.NEXT_PUBLIC_AI_FEATURES_ENABLED === 'true';
