import type { TrackingParam } from '../types.js'

// Ids of one person: a visitor, a session, a browser or an email recipient.
export const visitorIdParams: Array<TrackingParam> = [
  // Google Analytics / UTM.
  'utm_cid', // Client ID for cross-device tracking.

  // Meta / Facebook.
  'fb_action_ids', // Legacy Open Graph action tracking (user-identifying).
  'mibextid', // Share ID appended to links shared from Facebook.

  // Google Analytics cookies.
  '_ga', // GA client ID passed via URL.
  '_gl', // Cross-domain linker for session continuity.
  '_bk', // Undocumented, likely tracking-related.
  '_ke', // Undocumented, likely tracking-related.
  '_kx', // Klaviyo email tracking identifier.

  // Email marketing.
  '__s', // Drip email recipient tracking.
  'mc_eid', // Mailchimp subscriber/member ID.
  'mc_tc', // Mailchimp time of click tracking.
  'mkt_tok', // Marketo email tracking token.

  // Instagram.
  'igshid', // Instagram share ID for tracking shared content.
  'igsh', // Instagram share ID (successor to igshid).

  // HubSpot.
  'hsCtaTracking', // CTA click tracking.
  '_hsenc', // Encrypted tracking identifier.
  '_hsmi', // Email message ID.
  '__hstc', // Cross-domain visitor tracking cookie.
  '__hsfp', // Browser fingerprint for cross-domain tracking.
  '__hssc', // Session tracking (view count, session start).

  // Webtrekk / Mapp.
  'wtrid', // Webtrekk/Mapp referrer tracking ID.

  // Newsletter platforms.
  '_bhlid', // Beehiiv link tracking ID.

  // Deep linking.
  '_branch_match_id', // Branch.io match ID.
  '_branch_referrer', // Branch.io referrer tracking.

  // Misc tracking.
  'ck_subscriber_id', // ConvertKit / Kit per-recipient email tracking ID.
  'ml_subscriber', // MailerLite subscriber ID.
  'ml_subscriber_hash', // MailerLite subscriber hash.
  'oly_anon_id', // Olytics/Omeda anonymous user ID.
  'oly_enc_id', // Olytics/Omeda encrypted customer ID.
  'vero_conv', // Vero email conversion tracking.
  'vero_id', // Vero email user ID.
  'vgo_ee', // Vero email engagement tracking.

  // Blueshift email.
  /^bsft_[a-z0-9_]+$/,

  // Salesforce Marketing Cloud.
  /^sfmc_[a-z0-9_]+$/,

  // Wunderkind email.
  /^oft_[a-z0-9_]+$/,
]
