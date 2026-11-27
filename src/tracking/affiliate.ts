import type { TrackingParam } from '../types.js'

// Affiliate network ids. Stripping them removes the publisher's commission.
export const affiliateParams: Array<TrackingParam> = [
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
]
