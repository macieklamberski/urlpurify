import type { UrlUnwrapper } from './types.js'
// import { unwrapAceml } from './unwraps/aceml.js'
// import { unwrapAdjust } from './unwraps/adjust.js'
// import { unwrapAmazonAffiliate } from './unwraps/amazonAffiliate.js'
// import { unwrapAmpCache } from './unwraps/ampCache.js'
// import { unwrapAwin } from './unwraps/awin.js'
import { unwrapBing } from './unwraps/bing.js'
import { unwrapBlueskyRedirect } from './unwraps/bsky.js'
// import { unwrapCjNetwork } from './unwraps/cjNetwork.js'
// import { unwrapDigidip } from './unwraps/digidip.js'
// import { unwrapDisqus } from './unwraps/disqus.js'
// import { unwrapDouban } from './unwraps/douban.js'
// import { unwrapDuckduckgo } from './unwraps/duckduckgo.js'
// import { unwrapEbayRover } from './unwraps/ebayRover.js'
// import { unwrapEffiliation } from './unwraps/effiliation.js'
// import { unwrapEmbedly } from './unwraps/embedly.js'
import { unwrapFacebookShim } from './unwraps/facebook.js'
// import { unwrapFeedsportal } from './unwraps/feedsportal.js'
// import { unwrapFirebaseDynamicLinks } from './unwraps/firebaseDynamicLinks.js'
// import { unwrapFlipboard } from './unwraps/flipboard.js'
// import { unwrapGateSc } from './unwraps/gateSc.js'
// import { unwrapGeoriot } from './unwraps/georiot.js'
// import { unwrapGitee } from './unwraps/gitee.js'
import { unwrapGoogle } from './unwraps/google.js'
import { unwrapGoogleAmpViewer } from './unwraps/googleAmpViewer.js'
import { unwrapGoogleNews } from './unwraps/googleNews.js'
import { unwrapGoogleNewsModern } from './unwraps/googleNewsModern.js'
import { unwrapGoogleScholar } from './unwraps/googleScholar.js'
// import { unwrapHashnode } from './unwraps/hashnode.js'
import { unwrapHrefLi } from './unwraps/hrefLi.js'
// import { unwrapIcptrack } from './unwraps/icptrack.js'
// import { unwrapIdealoPartner } from './unwraps/idealoPartner.js'
import { unwrapInstagramShim } from './unwraps/instagram.js'
// import { unwrapJianshuGo } from './unwraps/jianshuGo.js'
// import { unwrapJuejin } from './unwraps/juejin.js'
// import { unwrapLeverAnalytics } from './unwraps/leverAnalytics.js'
// import { unwrapLinksynergy } from './unwraps/linksynergy.js'
// import { unwrapMailchimp } from './unwraps/mailchimp.js'
// import { unwrapMailpanion } from './unwraps/mailpanion.js'
// import { unwrapMailpgn } from './unwraps/mailpgn.js'
// import { unwrapMailtrack } from './unwraps/mailtrack.js'
// import { unwrapMedium } from './unwraps/medium.js'
// import { unwrapMimecast } from './unwraps/mimecast.js'
// import { unwrapMozillaOutgoing } from './unwraps/mozillaOutgoing.js'
// import { unwrapNicoMs } from './unwraps/nicoMs.js'
// import { unwrapOutlookSafelinks } from './unwraps/outlookSafelinks.js'
// import { unwrapPartnerAds } from './unwraps/partnerAds.js'
// import { unwrapPocket } from './unwraps/pocket.js'
// import { unwrapPostmark } from './unwraps/postmark.js'
// import { unwrapProofpointV1 } from './unwraps/proofpointV1.js'
// import { unwrapProofpointV2 } from './unwraps/proofpointV2.js'
// import { unwrapProofpointV3 } from './unwraps/proofpointV3.js'
// import { unwrapPxf } from './unwraps/pxf.js'
// import { unwrapRecruitics } from './unwraps/recruitics.js'
import { unwrapRedditOut } from './unwraps/redditOut.js'
// import { unwrapValuecommerce } from './unwraps/valuecommerce.js'
// import { unwrapViglink } from './unwraps/viglink.js'
import { unwrapThreadsShim } from './unwraps/threads.js'
// import { unwrapRedirectingat } from './unwraps/redirectingat.js'
// import { unwrapSegmentfault } from './unwraps/segmentfault.js'
// import { unwrapShareasale } from './unwraps/shareasale.js'
// import { unwrapSjv } from './unwraps/sjv.js'
// import { unwrapSkimlinks } from './unwraps/skimlinks.js'
// import { unwrapSlack } from './unwraps/slack.js'
// import { unwrapSmartredirect } from './unwraps/smartredirect.js'
// import { unwrapSspai } from './unwraps/sspai.js'
// import { unwrapSteamLinkfilter } from './unwraps/steamLinkfilter.js'
// import { unwrapTradedoubler } from './unwraps/tradedoubler.js'
import { unwrapTumblr } from './unwraps/tumblr.js'
import { unwrapVkAway } from './unwraps/vkAway.js'
import { unwrapYahooSearch } from './unwraps/yahooSearch.js'
import { unwrapYouTube } from './unwraps/youtube.js'

// import { unwrapZhihu } from './unwraps/zhihu.js'

import { trackingParamsLiterals } from './tracking/literals.js'
import { trackingParamsPatterns } from './tracking/patterns.js'
import type { TrackingParam } from './types.js'

export { trackingParamsLiterals } from './tracking/literals.js'
export { trackingParamsPatterns } from './tracking/patterns.js'

// Combined default list applied by cleanUrl and stripTrackingParams.
export const defaultTrackingParams: Array<TrackingParam> = [
  ...trackingParamsLiterals,
  ...trackingParamsPatterns,
]

export const defaultUnwrappers: Array<UrlUnwrapper> = [
  // Search engines.
  unwrapBing,
  // unwrapDuckduckgo,
  unwrapGoogle,
  unwrapGoogleNews,
  unwrapGoogleNewsModern,
  unwrapGoogleScholar,
  unwrapGoogleAmpViewer,
  unwrapYahooSearch,
  unwrapYouTube,

  // Email and security gateways.
  // unwrapOutlookSafelinks,
  // unwrapProofpointV1,
  // unwrapProofpointV2,
  // unwrapProofpointV3,
  // unwrapMimecast,
  // unwrapPostmark,
  // unwrapAceml,
  // unwrapIcptrack,
  // unwrapMailchimp,
  // unwrapMailtrack,
  // unwrapMailpanion,
  // unwrapMailpgn,
  // unwrapLeverAnalytics,
  // unwrapSlack,

  // Affiliate networks.
  // unwrapShareasale,
  // unwrapAwin,
  // unwrapLinksynergy,
  // unwrapSkimlinks,
  // unwrapRedirectingat,
  // unwrapTradedoubler,
  // unwrapCjNetwork,
  // unwrapValuecommerce,
  // unwrapViglink,
  // unwrapPxf,
  // unwrapSjv,
  // unwrapEbayRover,
  // unwrapAmazonAffiliate,
  // unwrapAdjust,
  // unwrapGateSc,
  // unwrapSmartredirect,
  // unwrapEffiliation,
  // unwrapPartnerAds,
  // unwrapIdealoPartner,
  // unwrapDigidip,
  // unwrapRecruitics,
  // unwrapGeoriot,
  // unwrapFirebaseDynamicLinks,

  // Social and community platforms.
  unwrapFacebookShim,
  unwrapInstagramShim,
  unwrapThreadsShim,
  // unwrapPocket,
  unwrapTumblr,
  unwrapHrefLi,
  unwrapVkAway,
  unwrapRedditOut,
  unwrapBlueskyRedirect,
  // unwrapDisqus,
  // unwrapSteamLinkfilter,
  // unwrapDouban,
  // unwrapNicoMs,
  // unwrapMedium,
  // unwrapFlipboard,

  // Developer and publishing platforms.
  // unwrapZhihu,
  // unwrapJuejin,
  // unwrapSspai,
  // unwrapJianshuGo,
  // unwrapSegmentfault,
  // unwrapGitee,
  // unwrapHashnode,

  // Cache and proxy services.
  // unwrapAmpCache,
  // unwrapEmbedly,
  // unwrapMozillaOutgoing,

  // Legacy aggregators.
  // unwrapFeedsportal,
]
