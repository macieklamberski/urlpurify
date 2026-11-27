import type { TrackingParam } from '../types.js'

// Campaign tags a site puts on its own links. The value is the same for every reader and tells the
// site where the visit came from, so stripping it removes the creator's traffic stats.
export const campaignParams: Array<TrackingParam> = [
  // Google Analytics / UTM.
  'utm_source', // Traffic source (e.g., google, newsletter).
  'utm_medium', // Marketing medium (e.g., cpc, email).
  'utm_campaign', // Campaign name.
  'utm_term', // Paid search keywords.
  'utm_content', // A/B test or ad variant identifier.
  'utm_reader', // Google News tracking.
  'utm_name', // Campaign name variant.
  'utm_viz_id', // Looker Studio visualization ID.

  // Email marketing.
  'mc_cid', // Mailchimp campaign ID.

  // Matomo / Piwik.
  'mtm_campaign', // Campaign name (modern Matomo prefix).
  'mtm_cid', // Campaign ID.
  'mtm_content', // Content variant.
  'mtm_group', // Campaign group.
  'mtm_keyword', // Search keyword.
  'mtm_medium', // Marketing medium.
  'mtm_placement', // Ad placement.
  'mtm_source', // Traffic source.
  'pk_campaign', // Legacy Piwik campaign name.
  'pk_cid', // Legacy Piwik campaign ID.
  'pk_content', // Legacy Piwik content variant.
  'pk_keyword', // Legacy Piwik keyword.
  'pk_medium', // Legacy Piwik medium.
  'pk_source', // Legacy Piwik source.

  // General tracking / referral.
  'ncid', // NBC/CNET network content tracking.
  'sr_share', // Social share referral tracking.
  'cmpid', // Generic publisher campaign ID.
  // 'ref', // Too generic, often functional.
  // 'ref_src', // Too generic, often functional.
  // 'ref_url', // Too generic, often functional.
  // 'source', // Too generic, often functional.
  // 'via', // Too generic, often functional.

  // Adobe.
  // 'cid', // Too generic, often functional: Google Maps place IDs.
  'sc_cid', // Site Catalyst campaign ID.
  's_cid', // Adobe Analytics campaign ID.

  // Webtrekk / Mapp.
  'wt_mc', // Webtrekk media code campaign tracking.
  'wt_zmc', // Webtrekk zoned media code.

  // Yahoo / Yandex.
  '_openstat', // OpenStat campaign tracking (Russian analytics).

  // Internal tracking systems.
  'itm_source', // Internal campaign source.
  'itm_medium', // Internal campaign medium.
  'itm_campaign', // Internal campaign name.
  'itm_content', // Internal campaign content variant.
  'itm_channel', // Internal marketing channel.
  'itm_audience', // Internal target audience.
  'int_source', // Alternative internal source tracking.
  'int_medium', // Alternative internal medium tracking.
  'int_campaign', // Alternative internal campaign tracking.
  'int_content', // Alternative internal content tracking.
  'int_placement', // Internal ad placement.
  'int_campaign_type', // Internal campaign type.
  'int_keycode', // Internal key code for attribution.

  // G2i tracking (developer talent network).
  'g2i_source',
  'g2i_medium',
  'g2i_campaign',
  'g2i_or_o',
  'g2i_or_p',

  // Adobe Target.
  'at_campaign', // Adobe Target campaign.
  'at_custom1', // Custom tracking field 1.
  'at_custom2', // Custom tracking field 2.
  'at_custom3', // Custom tracking field 3.
  'at_custom4', // Custom tracking field 4.
  'at_medium', // Adobe Target medium.

  // Misc tracking.
  'campaign_id', // Generic campaign ID.
  'hmb_campaign', // Unknown campaign tracking.
  'hmb_medium', // Unknown medium tracking.
  'hmb_source', // Unknown source tracking.
  'referer', // Misspelled referrer tracking.
  'referrer', // Referrer tracking.
  'xtor', // AT Internet campaign tracking.

  // Google Analytics / UTM. The de facto reserved analytics namespace,
  // including GA4 additions (utm_id, utm_source_platform) and vendor inventions.
  /^utm_[a-z0-9_-]+$/,

  // Common utm_ typo family seen in hand-typed campaign URLs.
  /^stm_[a-z0-9_-]+$/,

  // Matomo / Piwik.
  /^mtm_[a-z0-9_]+$/,
  /^pk_[a-z0-9_]+$/,
  /^piwik_[a-z0-9_]+$/,

  // Internal campaign tracking conventions.
  /^itm_[a-z0-9_]+$/,
  /^int_[a-z0-9_]+$/,

  // AT Internet (Piano Analytics), including at_custom1..n.
  /^at_[a-z0-9_]+$/,

  // G2i tracking.
  /^g2i_[a-z0-9_]+$/,

  // Coremetrics (cm_mmc, cm_mmca1..15).
  /^cm_mmca?\d*$/,
]
