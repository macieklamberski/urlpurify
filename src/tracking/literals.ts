// Known tracking parameters that carry no content, only analytics state.
export const trackingParamsLiterals = [
  // Google Analytics / UTM.
  'utm_source', // Traffic source (e.g., google, newsletter).
  'utm_medium', // Marketing medium (e.g., cpc, email).
  'utm_campaign', // Campaign name.
  'utm_term', // Paid search keywords.
  'utm_content', // A/B test or ad variant identifier.
  'utm_reader', // Google News tracking.
  'utm_name', // Campaign name variant.
  'utm_cid', // Client ID for cross-device tracking.
  'utm_viz_id', // Looker Studio visualization ID.

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
  'usqp', // AMP cache serving artifact.

  // Meta / Facebook.
  'fbclid', // Facebook Click ID for ad attribution.
  'fb_action_ids', // Legacy Open Graph action tracking (user-identifying).
  'fb_action_types', // Legacy Open Graph action types (e.g., og.likes).
  'fb_source', // Click origin context within Facebook.
  'fb_ref', // Custom referral string for analytics.
  'mibextid', // Share ID appended to links shared from Facebook.

  // Google Analytics cookies.
  '_ga', // GA client ID passed via URL.
  '_gl', // Cross-domain linker for session continuity.
  '_bk', // Undocumented, likely tracking-related.
  '_ke', // Undocumented, likely tracking-related.
  '_kx', // Klaviyo email tracking identifier.

  // Email marketing.
  '__s', // Drip email recipient tracking.
  'mc_cid', // Mailchimp campaign ID.
  'mc_eid', // Mailchimp subscriber/member ID.
  'mc_tc', // Mailchimp time of click tracking.
  'mkt_tok', // Marketo email tracking token.

  // Microsoft / LinkedIn.
  'msclkid', // Microsoft Advertising click ID.

  // Twitter / X.
  'twclid', // X/Twitter click ID for conversion tracking.
  '__twitter_impression', // Impression tracking flag on shared links.

  // TikTok.
  'ttclid', // TikTok click ID for ad attribution.

  // Instagram.
  'igshid', // Instagram share ID for tracking shared content.
  'igsh', // Instagram share ID (successor to igshid).

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
  'hsCtaTracking', // CTA click tracking.
  '_hsenc', // Encrypted tracking identifier.
  '_hsmi', // Email message ID.
  '__hstc', // Cross-domain visitor tracking cookie.
  '__hsfp', // Browser fingerprint for cross-domain tracking.
  '__hssc', // Session tracking (view count, session start).

  // Adobe.
  'cid', // Adobe Analytics campaign tracking (s.campaign).
  's_kwcid', // Adobe Advertising AMO ID for attribution.
  'sc_cid', // Site Catalyst campaign ID.
  'ef_id', // Adobe EF ID for granular event tracking.
  's_cid', // Adobe Analytics campaign ID.

  // Webtrekk / Mapp.
  'wt_mc', // Webtrekk media code campaign tracking.
  'wt_zmc', // Webtrekk zoned media code.
  'wtrid', // Webtrekk/Mapp referrer tracking ID.

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
  '_openstat', // OpenStat campaign tracking (Russian analytics).
  'guccounter', // Yahoo/Verizon consent redirect counter.
  'guce_referrer', // Yahoo/Verizon consent redirect referrer URL.
  'guce_referrer_sig', // Yahoo/Verizon consent redirect referrer signature.

  // Affiliate networks.
  'awinaffid', // Awin affiliate/publisher ID.
  'awinmid', // Awin merchant/advertiser ID.
  'clickref', // Affiliate sub-campaign tracking (SubID).
  'afftrack', // ShareASale affiliate tracking.
  'sscid', // ShareASale click ID.
  'awc', // Awin click ID.
  'cjevent', // CJ Affiliate click ID.
  'cjdata', // CJ Affiliate encrypted tracking data.
  'irclickid', // Impact Radius click ID.
  'irgwc', // Impact Radius global web conversion flag.
  'ir_adid', // Impact Radius ad ID.
  'ir_campaignid', // Impact Radius campaign ID.
  'ir_partnerid', // Impact Radius partner ID.

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

  // WordPress. Safe in feed context: feeds only serve published content, never drafts.
  'doing_wp_cron', // Triggers WP scheduled tasks. Feeds ignore this.
  'preview', // Enables draft preview. Feeds never include drafts.
  'preview_id', // Post ID for preview. Feeds never include drafts.
  'preview_nonce', // Security token for preview. Feeds never include drafts.
  'replytocom', // Comment reply form positioning. Feeds have no comments.

  // Cache busters.
  '_', // jQuery/generic timestamp cache buster.
  'timestamp', // Generic timestamp.
  'ts', // Timestamp shorthand.
  'cb', // Cache buster shorthand.
  'cachebuster', // Generic cache buster.
  // 'cHash', // TYPO3 security hash. Required for TYPO3 pages to render.
  'nocache', // Force bypass cache.
  'rand', // Random value.
  'random', // Random value.
  'sbdcrw', // Unknown cache buster.
  'forceByPassCache', // Force cache bypass.
  'sucurianticache', // Sucuri CDN cache bypass.
  'cleancache', // Force cache clear.
  'rebuildcache', // Force cache rebuild.
  'kontrol_health_check_timestamp', // Kontrol health monitoring.

  // A/B testing.
  // 'userab', // A/B test variant. May affect which content is served.

  // Facebook Open Graph (legacy).
  'action_object_map', // Open Graph action object mapping.
  'action_ref_map', // Open Graph action reference mapping.
  'action_type_map', // Open Graph action type mapping.

  // eBay.
  'algo_expid', // Algorithm experiment ID.
  'algo_pvid', // Page view ID for tracking.

  // Adobe Target.
  'at_campaign', // Adobe Target campaign.
  'at_custom1', // Custom tracking field 1.
  'at_custom2', // Custom tracking field 2.
  'at_custom3', // Custom tracking field 3.
  'at_custom4', // Custom tracking field 4.
  'at_medium', // Adobe Target medium.
  'at_preview_index', // Preview index.

  // Newsletter platforms.
  '_bhlid', // Beehiiv link tracking ID.

  // Deep linking.
  '_branch_match_id', // Branch.io match ID.
  '_branch_referrer', // Branch.io referrer tracking.

  // Reader apps.
  '__readwiseLocation', // Readwise Reader position tracking.

  // Misc tracking.
  'campaign_id', // Generic campaign ID.
  'click_sum', // Click aggregation.
  'fref', // Facebook legacy referral (predecessor to fb_source).
  'gs_l', // Google Search internal logging.
  'hmb_campaign', // Unknown campaign tracking.
  'hmb_medium', // Unknown medium tracking.
  'hmb_source', // Unknown source tracking.
  'ck_subscriber_id', // ConvertKit / Kit per-recipient email tracking ID.
  'ml_subscriber', // MailerLite subscriber ID.
  'ml_subscriber_hash', // MailerLite subscriber hash.
  'oly_anon_id', // Olytics/Omeda anonymous user ID.
  'oly_enc_id', // Olytics/Omeda encrypted customer ID.
  'rb_clickid', // Unknown click ID.
  'referer', // Misspelled referrer tracking.
  'referrer', // Referrer tracking.
  'spm', // Alibaba/AliExpress affiliate tracking.
  'trk', // LinkedIn tracking parameter.
  'vero_conv', // Vero email conversion tracking.
  'vero_id', // Vero email user ID.
  'vgo_ee', // Vero email engagement tracking.
  'wickedid', // Wicked Reports Facebook attribution.
  'xtor', // AT Internet campaign tracking.
]
