import type { TrackingParam } from '../types.js'

// Ad, search and platform click attribution, added by the platform and not by the site.
export const clickAttributionParams: Array<TrackingParam> = [
  // Google Ads.
  'gclid', // Google Click ID for conversion tracking.
  'dclid', // DoubleClick/Display & Video 360 click ID.
  'gbraid', // iOS app-to-app measurement (privacy-compliant).
  'wbraid', // iOS web-to-app measurement (privacy-compliant).
  'gclsrc', // Click source indicator (ds=SA360, aw.ds=Google Ads via SA360).
  'gad_source', // Aggregate ad source (1=Search, 2=Display, 5=Shopping).
  'gad_campaignid', // Campaign ID for aggregate attribution.

  // Google Search Results.
  'srsltid', // Merchant Center auto-tagging for shopping results.

  // Meta / Facebook.
  'fbclid', // Facebook Click ID for ad attribution.
  'fb_action_types', // Legacy Open Graph action types (e.g., og.likes).
  'fb_source', // Click origin context within Facebook.
  'fb_ref', // Custom referral string for analytics.

  // Microsoft / LinkedIn.
  'msclkid', // Microsoft Advertising click ID.

  // Twitter / X.
  'twclid', // X/Twitter click ID for conversion tracking.
  '__twitter_impression', // Impression tracking flag on shared links.

  // TikTok.
  'ttclid', // TikTok click ID for ad attribution.

  // HubSpot.
  'hsa_acc', // HubSpot Ads account ID.
  'hsa_ad', // Ad ID.
  'hsa_cam', // Campaign ID.
  'hsa_grp', // Ad group ID.
  'hsa_kw', // Keyword.
  'hsa_mt', // Match type.
  'hsa_net', // Ad network (Google, Facebook, LinkedIn).
  'hsa_src', // Traffic source.
  'hsa_tgt', // Target audience.
  'hsa_ver', // Tracking version.

  // Adobe.
  's_kwcid', // Adobe Advertising AMO ID for attribution.
  'ef_id', // Adobe EF ID for granular event tracking.

  // Cxense / Chartbeat.
  'cx_click', // Cxense click tracking.
  'cx_recsOrder', // Cxense recommendation order.
  'cx_recsWidget', // Cxense recommendation widget ID.

  // Outbrain / Taboola.
  'obOrigUrl', // Outbrain original URL preservation.
  'dicbo', // Outbrain click ID for conversion tracking.

  // Yahoo / Yandex.
  'yclid', // Yahoo click ID for ad attribution.
  'ysclid', // Yandex click ID for ad attribution.

  // Facebook Open Graph (legacy).
  'action_object_map', // Open Graph action object mapping.
  'action_ref_map', // Open Graph action reference mapping.
  'action_type_map', // Open Graph action type mapping.

  // eBay.
  'algo_expid', // Algorithm experiment ID.
  'algo_pvid', // Page view ID for tracking.

  // Misc tracking.
  'click_sum', // Click aggregation.
  'fref', // Facebook legacy referral (predecessor to fb_source).
  'gs_l', // Google Search internal logging.
  'rb_clickid', // Unknown click ID.
  'spm', // Alibaba/AliExpress on-page click position.
  'trk', // LinkedIn tracking parameter.
  'wickedid', // Wicked Reports Facebook attribution.

  // HubSpot ads.
  /^hsa_[a-z0-9_]+$/,
]
