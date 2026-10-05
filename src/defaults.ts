import { trackingParamsLiterals } from './tracking/literals.js'
import { trackingParamsPatterns } from './tracking/patterns.js'
import type { TrackingParam, UrlUnwrapper } from './types.js'
// import { unwrap12ft } from './unwraps/12ft.js'
// import { unwrap2performant } from './unwraps/2performant.js'
// import { unwrapA8Net } from './unwraps/a8Net.js'
// import { unwrapAccesstrade } from './unwraps/accesstrade.js'
// import { unwrapAceml } from './unwraps/aceml.js'
// import { unwrapAdcell } from './unwraps/adcell.js'
// import { unwrapAdjust } from './unwraps/adjust.js'
// import { unwrapAdmitad } from './unwraps/admitad.js'
// import { unwrapAmazonAffiliate } from './unwraps/amazonAffiliate.js'
// import { unwrapAmazonSes } from './unwraps/amazonSes.js'
// import { unwrapAmpCache } from './unwraps/ampCache.js'
import { unwrapAnonymTo } from './unwraps/anonymTo.js'
// import { unwrapAppsflyerOnelink } from './unwraps/appsflyerOnelink.js'
// import { unwrapApptrkr } from './unwraps/apptrkr.js'
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
import { unwrapCanva } from './unwraps/canva.js'
// import { unwrapCcbill } from './unwraps/ccbill.js'
// import { unwrapCiscoSecureWeb } from './unwraps/ciscoSecureWeb.js'
// import { unwrapCjNetwork } from './unwraps/cjNetwork.js'
// import { unwrapConstantContact } from './unwraps/constantContact.js'
import { unwrapCsdn } from './unwraps/csdn.js'
import { unwrapDatalifeEngine } from './unwraps/datalifeEngine.js'
import { unwrapDerefMail } from './unwraps/derefMail.js'
import { unwrapDeviantartOutgoing } from './unwraps/deviantartOutgoing.js'
// import { unwrapDigidip } from './unwraps/digidip.js'
import { unwrapDisqus } from './unwraps/disqus.js'
// import { unwrapDmmAffiliate } from './unwraps/dmmAffiliate.js'
import { unwrapDouban } from './unwraps/douban.js'
import { unwrapDropbox } from './unwraps/dropbox.js'
// import { unwrapDuckduckgo } from './unwraps/duckduckgo.js'
import { unwrapDzen } from './unwraps/dzen.js'
// import { unwrapEbayRover } from './unwraps/ebayRover.js'
// import { unwrapEdgepilot } from './unwraps/edgepilot.js'
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
// import { unwrapHornetsecurity } from './unwraps/hornetsecurity.js'
import { unwrapHrefLi } from './unwraps/hrefLi.js'
// import { unwrapHubspotSidekick } from './unwraps/hubspotSidekick.js'
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
import { unwrapLivejournal } from './unwraps/livejournal.js'
// import { unwrapMailchimp } from './unwraps/mailchimp.js'
// import { unwrapMailinblack } from './unwraps/mailinblack.js'
// import { unwrapMailpanion } from './unwraps/mailpanion.js'
// import { unwrapMailpgn } from './unwraps/mailpgn.js'
// import { unwrapMailtrack } from './unwraps/mailtrack.js'
// import { unwrapMcas } from './unwraps/mcas.js'
import { unwrapMedium } from './unwraps/medium.js'
// import { unwrapMimecast } from './unwraps/mimecast.js'
// import { unwrapMoshimo } from './unwraps/moshimo.js'
import { unwrapMozillaOutgoing } from './unwraps/mozillaOutgoing.js'
import { unwrapNaverOutgoing } from './unwraps/naverOutgoing.js'
import { unwrapNewswire } from './unwraps/newswire.js'
// import { unwrapNicoMs } from './unwraps/nicoMs.js'
import { unwrapOkRu } from './unwraps/okRu.js'
// import { unwrapOutlookSafelinks } from './unwraps/outlookSafelinks.js'
// import { unwrapPartnerAds } from './unwraps/partnerAds.js'
import { unwrapPocket } from './unwraps/pocket.js'
// import { unwrapPostmark } from './unwraps/postmark.js'
import { unwrapPrNewswire } from './unwraps/prNewswire.js'
// import { unwrapProofpointV1 } from './unwraps/proofpointV1.js'
// import { unwrapProofpointV2 } from './unwraps/proofpointV2.js'
// import { unwrapProofpointV3 } from './unwraps/proofpointV3.js'
// import { unwrapRakutenAffiliate } from './unwraps/rakutenAffiliate.js'
// import { unwrapRecruitics } from './unwraps/recruitics.js'
import { unwrapRedditOut } from './unwraps/redditOut.js'
// import { unwrapRedirectingat } from './unwraps/redirectingat.js'
import { unwrapResearchgate } from './unwraps/researchgate.js'
import { unwrapSegmentfault } from './unwraps/segmentfault.js'
// import { unwrapShareasale } from './unwraps/shareasale.js'
// import { unwrapSkimlinks } from './unwraps/skimlinks.js'
// import { unwrapSlack } from './unwraps/slack.js'
// import { unwrapSmartredirect } from './unwraps/smartredirect.js'
// import { unwrapSophos } from './unwraps/sophos.js'
import { unwrapSoundcloud } from './unwraps/soundcloud.js'
// import { unwrapSquarespaceEmail } from './unwraps/squarespaceEmail.js'
import { unwrapSspai } from './unwraps/sspai.js'
// import { unwrapStay22 } from './unwraps/stay22.js'
import { unwrapSteamLinkfilter } from './unwraps/steamLinkfilter.js'
// import { unwrapStreak } from './unwraps/streak.js'
import { unwrapThreadsShim } from './unwraps/threads.js'
// import { unwrapTitanhqLinklock } from './unwraps/titanhqLinklock.js'
// import { unwrapTopsec } from './unwraps/topsec.js'
// import { unwrapTradedoubler } from './unwraps/tradedoubler.js'
// import { unwrapTradetracker } from './unwraps/tradetracker.js'
// import { unwrapTravelpayouts } from './unwraps/travelpayouts.js'
// import { unwrapTrendMicro } from './unwraps/trendMicro.js'
// import { unwrapTrustwaveScanmail } from './unwraps/trustwaveScanmail.js'
import { unwrapTumblr } from './unwraps/tumblr.js'
// import { unwrapUkgwa } from './unwraps/ukgwa.js'
// import { unwrapVadeSecure } from './unwraps/vadeSecure.js'
// import { unwrapValuecommerce } from './unwraps/valuecommerce.js'
import { unwrapVanilla } from './unwraps/vanilla.js'
import { unwrapVbulletin } from './unwraps/vbulletin.js'
// import { unwrapViglink } from './unwraps/viglink.js'
import { unwrapVkAway } from './unwraps/vkAway.js'
// import { unwrapVuture } from './unwraps/vuture.js'
// import { unwrapWebgains } from './unwraps/webgains.js'
// import { unwrapWikiwix } from './unwraps/wikiwix.js'
// import { unwrapWordpressEmail } from './unwraps/wordpressEmail.js'
// import { unwrapWordpressGo2 } from './unwraps/wordpressGo2.js'
import { unwrapYahooJapan } from './unwraps/yahooJapan.js'
import { unwrapYahooSearch } from './unwraps/yahooSearch.js'
import { unwrapYandexMail } from './unwraps/yandexMail.js'
import { unwrapYelp } from './unwraps/yelp.js'
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
  unwrapYahooJapan,
  unwrapYahooSearch,
  unwrapYouTube,

  // Email and security gateways.
  // unwrapAceml,
  // unwrapAmazonSes,
  // unwrapBarracudaLinkProtect,
  // unwrapCiscoSecureWeb,
  // unwrapConstantContact,
  // unwrapEdgepilot,
  // unwrapEsva,
  // unwrapFireeye,
  // unwrapHornetsecurity,
  // unwrapHubspotSidekick,
  // unwrapIcptrack,
  // unwrapLeverAnalytics,
  // unwrapMailchimp,
  // unwrapMailinblack,
  // unwrapMailpanion,
  // unwrapMailpgn,
  // unwrapMailtrack,
  // unwrapMcas,
  // unwrapMimecast,
  // unwrapOutlookSafelinks,
  // unwrapPostmark,
  // unwrapProofpointV1,
  // unwrapProofpointV2,
  // unwrapProofpointV3,
  // unwrapSlack,
  // unwrapSophos,
  // unwrapSquarespaceEmail,
  // unwrapStreak,
  // unwrapTitanhqLinklock,
  // unwrapTopsec,
  // unwrapTrendMicro,
  // unwrapTrustwaveScanmail,
  // unwrapVadeSecure,
  // unwrapVuture,
  // unwrapWordpressEmail,

  // Affiliate networks.
  // unwrap2performant,
  // unwrapA8Net,
  // unwrapAccesstrade,
  // unwrapAdcell,
  // unwrapAdjust,
  // unwrapAdmitad,
  // unwrapAmazonAffiliate,
  // unwrapAppsflyerOnelink,
  // unwrapApptrkr,
  // unwrapAvantlink,
  // unwrapAwin,
  // unwrapBizrate,
  // unwrapBolPartner,
  // unwrapCcbill,
  // unwrapCjNetwork,
  // unwrapDigidip,
  // unwrapDmmAffiliate,
  // unwrapEbayRover,
  // unwrapEffiliation,
  // unwrapFirebaseDynamicLinks,
  // unwrapGateSc,
  // unwrapGeoriot,
  // unwrapImpact,
  // unwrapKlook,
  // unwrapLinksynergy,
  // unwrapMoshimo,
  // unwrapPartnerAds,
  // Rakuten Japan's own program, separate from the LinkSynergy network in unwrapLinksynergy.
  // Opt-in like the rest of the group: unwrapping drops the publisher's commission.
  // unwrapRakutenAffiliate,
  // unwrapRecruitics,
  // unwrapRedirectingat,
  // unwrapShareasale,
  // unwrapSkimlinks,
  // unwrapSmartredirect,
  // unwrapStay22,
  // unwrapTradedoubler,
  // unwrapTradetracker,
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
  unwrapCanva,
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
  unwrapLivejournal,
  unwrapMedium,
  unwrapNaverOutgoing,
  // unwrapNicoMs,
  unwrapOkRu,
  unwrapPocket,
  unwrapRedditOut,
  unwrapSoundcloud,
  unwrapSteamLinkfilter,
  unwrapThreadsShim,
  unwrapTumblr,
  unwrapVanilla,
  unwrapVbulletin,
  unwrapVkAway,
  unwrapYandexMail,
  unwrapYelp,

  // Developer and publishing platforms.
  unwrapCsdn,
  unwrapDatalifeEngine,
  unwrapDropbox,
  unwrapEvernote,
  unwrapGitee,
  unwrapHashnode,
  unwrapJianshuGo,
  unwrapJuejin,
  unwrapResearchgate,
  unwrapSegmentfault,
  unwrapSspai,
  unwrapZhihu,

  // Press release wires.
  unwrapBusinessWire,
  unwrapNewswire,
  unwrapPrNewswire,

  // Cache and proxy services.
  // unwrap12ft,
  // unwrapAmpCache,
  // unwrapArchiveToday, // Snapshot of a page at a point in time, not a redirect
  // unwrapEmbedly,
  unwrapMozillaOutgoing,
  // unwrapUkgwa,
  // unwrapWikiwix,

  // Legacy aggregators.
  // unwrapFeedsportal,
  unwrapZemanta,
]
