import { Analytics } from '@vercel/analytics/react';

/**
 * Mounts Vercel's aggregated analytics without application-specific events.
 * It intentionally has no inputs, identifiers, or access to user data.
 */
export function AnonymousAnalytics() {
  return <Analytics />;
}
