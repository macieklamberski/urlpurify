// Tracking parameter families matched by pattern instead of enumeration.
// These namespaces are reserved by their analytics vendors by convention,
// so new and misspelled variants keep appearing in the wild faster than a
// literal list can track them. Patterns are tested against the lowercased
// param name and must be anchored.
export const trackingParamsPatterns: Array<RegExp> = [
  // Google Analytics / UTM. The de facto reserved analytics namespace,
  // including GA4 additions (utm_id, utm_source_platform) and vendor inventions.
  /^utm_[a-z0-9_-]+$/,
  // Common utm_ typo family seen in hand-typed campaign URLs.
  /^stm_[a-z0-9_-]+$/,
  // HubSpot ads.
  /^hsa_[a-z0-9_]+$/,
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
  // Blueshift email.
  /^bsft_[a-z0-9_]+$/,
  // Salesforce Marketing Cloud.
  /^sfmc_[a-z0-9_]+$/,
  // Wunderkind email.
  /^oft_[a-z0-9_]+$/,
  // Coremetrics (cm_mmc, cm_mmca1..15).
  /^cm_mmca?\d*$/,
]
