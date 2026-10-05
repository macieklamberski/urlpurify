import { trackingParamsLiterals } from './tracking/literals.js'
import { trackingParamsPatterns } from './tracking/patterns.js'
import type { TrackingParam, UrlUnwrapper } from './types.js'
// import { unwrap12ft } from './unwraps/12ft.js'
// import { unwrapA8Net } from './unwraps/a8Net.js'
// import { unwrapAccesstrade } from './unwraps/accesstrade.js'
// import { unwrapAceml } from './unwraps/aceml.js'
// import { unwrapAdjust } from './unwraps/adjust.js'
// import { unwrapAmazonAffiliate } from './unwraps/amazonAffiliate.js'
// import { unwrapAmazonSes } from './unwraps/amazonSes.js'
// import { unwrapAmpCache } from './unwraps/ampCache.js'
import { unwrapAnonymTo } from './unwraps/anonymTo.js'
// import { unwrapArchiveToday } from './unwraps/archiveToday.js'
// import { unwrapAvantlink } from './unwraps/avantlink.js'
// import { unwrapAwin } from './unwraps/awin.js'
// import { unwrapBarracudaLinkProtect } from './unwraps/barracudaLinkProtect.js'
import { unwrapBing } from './unwraps/bing.js'
// import { unwrapBingAds } from './unwraps/bingAds.js'
// import { unwrapBizrate } from './unwraps/bizrate.js'
// import { unwrapBolPartner } from './unwraps/bolPartner.js'
import { unwrapBlueskyRedirect } from './unwraps/bsky.js'
import { unwrapBusinessWire } from './unwraps/businessWire.js'
import { unwrapCalendly } from './unwraps/calendly.js'
// import { unwrapCiscoSecureWeb } from './unwraps/ciscoSecureWeb.js'
// import { unwrapCjNetwork } from './unwraps/cjNetwork.js'
import { unwrapCsdn } from './unwraps/csdn.js'
import { unwrapDerefMail } from './unwraps/derefMail.js'
import { unwrapDeviantartOutgoing } from './unwraps/deviantartOutgoing.js'
// import { unwrapDigidip } from './unwraps/digidip.js'
import { unwrapDisqus } from './unwraps/disqus.js'
// import { unwrapDmmAffiliate } from './unwraps/dmmAffiliate.js'
import { unwrapDouban } from './unwraps/douban.js'
// import { unwrapDuckduckgo } from './unwraps/duckduckgo.js'
import { unwrapDzen } from './unwraps/dzen.js'
// import { unwrapEbayRover } from './unwraps/ebayRover.js'
// import { unwrapEClick } from './unwraps/eClick.js'
// import { unwrapEffiliation } from './unwraps/effiliation.js'
// import { unwrapEmbedly } from './unwraps/embedly.js'
// import { unwrapEsva } from './unwraps/esva.js'
import { unwrapEvernote } from './unwraps/evernote.js'
import { unwrapFacebookShim } from './unwraps/facebook.js'
// import { unwrapFeedsportal } from './unwraps/feedsportal.js'
// import { unwrapFirebaseDynamicLinks } from './unwraps/firebaseDynamicLinks.js'
// import { unwrapFireeye } from './unwraps/fireeye.js'
import { unwrapFlipboard } from './unwraps/flipboard.js'
// import { unwrapGateSc } from './unwraps/gateSc.js'
// import { unwrapGeoriot } from './unwraps/georiot.js'
import { unwrapGitee } from './unwraps/gitee.js'
import { unwrapGoogle } from './unwraps/google.js'
// import { unwrapGoogleAds } from './unwraps/googleAds.js'
import { unwrapGoogleAmpViewer } from './unwraps/googleAmpViewer.js'
import { unwrapGoogleNews } from './unwraps/googleNews.js'
import { unwrapGoogleNewsModern } from './unwraps/googleNewsModern.js'
import { unwrapGoogleScholar } from './unwraps/googleScholar.js'
import { unwrapHashnode } from './unwraps/hashnode.js'
import { unwrapHrefLi } from './unwraps/hrefLi.js'
// import { unwrapIcptrack } from './unwraps/icptrack.js'
// import { unwrapImpact } from './unwraps/impact.js'
import { unwrapIndexHu } from './unwraps/indexHu.js'
import { unwrapInstagramShim } from './unwraps/instagram.js'
import { unwrapJianshuGo } from './unwraps/jianshuGo.js'
import { unwrapJive } from './unwraps/jive.js'
import { unwrapJuejin } from './unwraps/juejin.js'
// import { unwrapKlook } from './unwraps/klook.js'
// import { unwrapLeverAnalytics } from './unwraps/leverAnalytics.js'
import { unwrapLinkedin } from './unwraps/linkedin.js'
// import { unwrapLinksynergy } from './unwraps/linksynergy.js'
// import { unwrapMailchimp } from './unwraps/mailchimp.js'
// import { unwrapMailpanion } from './unwraps/mailpanion.js'
// import { unwrapMailpgn } from './unwraps/mailpgn.js'
// import { unwrapMailtrack } from './unwraps/mailtrack.js'
import { unwrapMedium } from './unwraps/medium.js'
// import { unwrapMimecast } from './unwraps/mimecast.js'
// import { unwrapMoshimo } from './unwraps/moshimo.js'
import { unwrapMozillaOutgoing } from './unwraps/mozillaOutgoing.js'
import { unwrapNaverOutgoing } from './unwraps/naverOutgoing.js'
// import { unwrapNicoMs } from './unwraps/nicoMs.js'
// import { unwrapOutlookSafelinks } from './unwraps/outlookSafelinks.js'
// import { unwrapPartnerAds } from './unwraps/partnerAds.js'
import { unwrapPocket } from './unwraps/pocket.js'
// import { unwrapPostmark } from './unwraps/postmark.js'
import { unwrapPrNewswire } from './unwraps/prNewswire.js'
// import { unwrapProofpointV1 } from './unwraps/proofpointV1.js'
// import { unwrapProofpointV2 } from './unwraps/proofpointV2.js'
// import { unwrapProofpointV3 } from './unwraps/proofpointV3.js'
// import { unwrapPxf } from './unwraps/pxf.js'
// import { unwrapRakutenAffiliate } from './unwraps/rakutenAffiliate.js'
// import { unwrapRecruitics } from './unwraps/recruitics.js'
import { unwrapRedditOut } from './unwraps/redditOut.js'
// import { unwrapRedirectingat } from './unwraps/redirectingat.js'
import { unwrapSegmentfault } from './unwraps/segmentfault.js'
// import { unwrapShareasale } from './unwraps/shareasale.js'
// import { unwrapSjv } from './unwraps/sjv.js'
// import { unwrapSkimlinks } from './unwraps/skimlinks.js'
// import { unwrapSlack } from './unwraps/slack.js'
// import { unwrapSmartredirect } from './unwraps/smartredirect.js'
import { unwrapSoundcloud } from './unwraps/soundcloud.js'
import { unwrapSspai } from './unwraps/sspai.js'
// import { unwrapStay22 } from './unwraps/stay22.js'
import { unwrapSteamLinkfilter } from './unwraps/steamLinkfilter.js'
// import { unwrapStreak } from './unwraps/streak.js'
import { unwrapThreadsShim } from './unwraps/threads.js'
// import { unwrapTradedoubler } from './unwraps/tradedoubler.js'
// import { unwrapTravelpayouts } from './unwraps/travelpayouts.js'
import { unwrapTumblr } from './unwraps/tumblr.js'
// import { unwrapUkgwa } from './unwraps/ukgwa.js'
// import { unwrapValuecommerce } from './unwraps/valuecommerce.js'
// import { unwrapViglink } from './unwraps/viglink.js'
import { unwrapVkAway } from './unwraps/vkAway.js'
// import { unwrapWebgains } from './unwraps/webgains.js'
// import { unwrapWordpressEmail } from './unwraps/wordpressEmail.js'
// import { unwrapWordpressGo2 } from './unwraps/wordpressGo2.js'
import { unwrapYahooSearch } from './unwraps/yahooSearch.js'
import { unwrapYandexMail } from './unwraps/yandexMail.js'
import { unwrapYouTube } from './unwraps/youtube.js'
import { unwrapZemanta } from './unwraps/zemanta.js'
import { unwrapZhihu } from './unwraps/zhihu.js'

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
  unwrapGoogleAmpViewer,
  unwrapGoogleNews,
  unwrapGoogleNewsModern,
  unwrapGoogleScholar,
  unwrapYahooSearch,
  unwrapYouTube,

  // Email and security gateways.
  // unwrapAceml,
  // unwrapAmazonSes,
  // unwrapBarracudaLinkProtect,
  // unwrapCiscoSecureWeb,
  // unwrapEsva,
  // unwrapFireeye,
  // unwrapIcptrack,
  // unwrapLeverAnalytics,
  // unwrapMailchimp,
  // unwrapMailpanion,
  // unwrapMailpgn,
  // unwrapMailtrack,
  // unwrapMimecast,
  // unwrapOutlookSafelinks,
  // unwrapPostmark,
  // unwrapProofpointV1,
  // unwrapProofpointV2,
  // unwrapProofpointV3,
  // unwrapSlack,
  // unwrapStreak,
  // unwrapWordpressEmail,

  // Affiliate networks.
  // unwrapA8Net,
  // unwrapAccesstrade,
  // unwrapAdjust,
  // unwrapAmazonAffiliate,
  // unwrapAvantlink,
  // unwrapAwin,
  // unwrapBizrate,
  // unwrapBolPartner,
  // unwrapCjNetwork,
  // unwrapDigidip,
  // unwrapDmmAffiliate,
  // unwrapEbayRover,
  // unwrapEClick,
  // unwrapEffiliation,
  // unwrapFirebaseDynamicLinks,
  // unwrapGateSc,
  // unwrapGeoriot,
  // unwrapImpact,
  // unwrapKlook,
  // unwrapLinksynergy,
  // unwrapMoshimo,
  // unwrapPartnerAds,
  // unwrapPxf,
  // Rakuten Japan's own program, separate from the LinkSynergy network in unwrapLinksynergy.
  // Opt-in like the rest of the group: unwrapping drops the publisher's commission.
  // unwrapRakutenAffiliate,
  // unwrapRecruitics,
  // unwrapRedirectingat,
  // unwrapShareasale,
  // unwrapSjv,
  // unwrapSkimlinks,
  // unwrapSmartredirect,
  // unwrapStay22,
  // unwrapTradedoubler,
  // unwrapTravelpayouts,
  // unwrapValuecommerce,
  // unwrapViglink,
  // unwrapWebgains,
  // unwrapWordpressGo2,

  // Ad networks.
  // unwrapBingAds,
  // unwrapGoogleAds,

  // Social and community platforms.
  unwrapAnonymTo,
  unwrapBlueskyRedirect,
  unwrapCalendly,
  unwrapDerefMail,
  unwrapDeviantartOutgoing,
  unwrapDisqus,
  unwrapDouban,
  unwrapDzen,
  unwrapFacebookShim,
  unwrapFlipboard,
  unwrapHrefLi,
  unwrapIndexHu,
  unwrapInstagramShim,
  unwrapJive,
  unwrapLinkedin,
  unwrapMedium,
  unwrapNaverOutgoing,
  // unwrapNicoMs,
  unwrapPocket,
  unwrapRedditOut,
  unwrapSoundcloud,
  unwrapSteamLinkfilter,
  unwrapThreadsShim,
  unwrapTumblr,
  unwrapVkAway,
  unwrapYandexMail,

  // Developer and publishing platforms.
  unwrapCsdn,
  unwrapEvernote,
  unwrapGitee,
  unwrapHashnode,
  unwrapJianshuGo,
  unwrapJuejin,
  unwrapSegmentfault,
  unwrapSspai,
  unwrapZhihu,

  // Press release wires.
  unwrapBusinessWire,
  unwrapPrNewswire,

  // Cache and proxy services.
  // unwrap12ft,
  // unwrapAmpCache,
  // unwrapArchiveToday, // Snapshot of a page at a point in time, not a redirect
  // unwrapEmbedly,
  unwrapMozillaOutgoing,
  // unwrapUkgwa,

  // Legacy aggregators.
  // unwrapFeedsportal,
  unwrapZemanta,
]
