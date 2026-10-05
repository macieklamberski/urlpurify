import { trackingParamsLiterals } from './tracking/literals.js'
import { trackingParamsPatterns } from './tracking/patterns.js'
import type { TrackingParam, UrlUnwrapper } from './types.js'
// import { unwrap12ft } from './unwraps/12ft.js'
// import { unwrap2performant } from './unwraps/2performant.js'
import { unwrap4pda } from './unwraps/4pda.js'
// import { unwrapA8Net } from './unwraps/a8Net.js'
// import { unwrapAcast } from './unwraps/acast.js'
// import { unwrapAccesstrade } from './unwraps/accesstrade.js'
// import { unwrapAceml } from './unwraps/aceml.js'
// import { unwrapAdcell } from './unwraps/adcell.js'
// import { unwrapAdjust } from './unwraps/adjust.js'
// import { unwrapAdmitad } from './unwraps/admitad.js'
// import { unwrapAdrecord } from './unwraps/adrecord.js'
// import { unwrapAdtraction } from './unwraps/adtraction.js'
// import { unwrapAffilae } from './unwraps/affilae.js'
// import { unwrapAffiliateFuture } from './unwraps/affiliateFuture.js'
// import { unwrapAffiliatesOne } from './unwraps/affiliatesOne.js'
// import { unwrapAliexpress } from './unwraps/aliexpress.js'
import { unwrapAliyun } from './unwraps/aliyun.js'
// import { unwrapAmazonAffiliate } from './unwraps/amazonAffiliate.js'
// import { unwrapAmazonSes } from './unwraps/amazonSes.js'
// import { unwrapAmpCache } from './unwraps/ampCache.js'
// import { unwrapAnchor } from './unwraps/anchor.js'
// import { unwrapAnonymouse } from './unwraps/anonymouse.js'
import { unwrapAnonymTo } from './unwraps/anonymTo.js'
// import { unwrapAppsflyerOnelink } from './unwraps/appsflyerOnelink.js'
// import { unwrapApptrkr } from './unwraps/apptrkr.js'
// import { unwrapArchiveToday } from './unwraps/archiveToday.js'
// import { unwrapArquivo } from './unwraps/arquivo.js'
import { unwrapArxiv } from './unwraps/arxiv.js'
import { unwrapAsk } from './unwraps/ask.js'
// import { unwrapAugure } from './unwraps/augure.js'
// import { unwrapAvantlink } from './unwraps/avantlink.js'
// import { unwrapAwin } from './unwraps/awin.js'
// import { unwrapAxigen } from './unwraps/axigen.js'
// import { unwrapBacLacWebArchive } from './unwraps/bacLacWebArchive.js'
import { unwrapBale } from './unwraps/bale.js'
// import { unwrapBananatag } from './unwraps/bananatag.js'
// import { unwrapBarracudaLinkProtect } from './unwraps/barracudaLinkProtect.js'
import { unwrapBing } from './unwraps/bing.js'
// import { unwrapBingAds } from './unwraps/bingAds.js'
// import { unwrapBizrate } from './unwraps/bizrate.js'
// import { unwrapBlubrry } from './unwraps/blubrry.js'
// import { unwrapBolPartner } from './unwraps/bolPartner.js'
import { unwrapBridgyFed } from './unwraps/bridgyFed.js'
import { unwrapBlueskyRedirect } from './unwraps/bsky.js'
import { unwrapBusinessWire } from './unwraps/businessWire.js'
// import { unwrapButton } from './unwraps/button.js'
// import { unwrapBuyAt } from './unwraps/buyAt.js'
// import { unwrapBuybox } from './unwraps/buybox.js'
// import { unwrapBuzzstream } from './unwraps/buzzstream.js'
import { unwrapBytedance } from './unwraps/bytedance.js'
// import { unwrapCake } from './unwraps/cake.js'
import { unwrapCalendly } from './unwraps/calendly.js'
import { unwrapCanva } from './unwraps/canva.js'
// import { unwrapCcbill } from './unwraps/ccbill.js'
// import { unwrapChartable } from './unwraps/chartable.js'
// import { unwrapCheckPointHarmony } from './unwraps/checkPointHarmony.js'
// import { unwrapCiscoSecureWeb } from './unwraps/ciscoSecureWeb.js'
// import { unwrapCjNetwork } from './unwraps/cjNetwork.js'
// import { unwrapCleverbridge } from './unwraps/cleverbridge.js'
// import { unwrapCloudhq } from './unwraps/cloudhq.js'
// import { unwrapCommissionFactory } from './unwraps/commissionFactory.js'
// import { unwrapCommunicationads } from './unwraps/communicationads.js'
// import { unwrapConstantContact } from './unwraps/constantContact.js'
// import { unwrapContactMonkey } from './unwraps/contactMonkey.js'
// import { unwrapConvertiser } from './unwraps/convertiser.js'
import { unwrapCsdn } from './unwraps/csdn.js'
// import { unwrapCse360 } from './unwraps/cse360.js'
// import { unwrapCuelinks } from './unwraps/cuelinks.js'
import { unwrapDasBlog } from './unwraps/dasBlog.js'
import { unwrapDatalifeEngine } from './unwraps/datalifeEngine.js'
import { unwrapDerefMail } from './unwraps/derefMail.js'
import { unwrapDeviantartOutgoing } from './unwraps/deviantartOutgoing.js'
// import { unwrapDigidip } from './unwraps/digidip.js'
// import { unwrapDigikala } from './unwraps/digikala.js'
// import { unwrapDirectMail } from './unwraps/directMail.js'
import { unwrapDisqus } from './unwraps/disqus.js'
// import { unwrapDmmAffiliate } from './unwraps/dmmAffiliate.js'
// import { unwrapDognet } from './unwraps/dognet.js'
import { unwrapDouban } from './unwraps/douban.js'
import { unwrapDropbox } from './unwraps/dropbox.js'
// import { unwrapDuckduckgo } from './unwraps/duckduckgo.js'
// import { unwrapDuomai } from './unwraps/duomai.js'
// import { unwrapDyn } from './unwraps/dyn.js'
import { unwrapDzen } from './unwraps/dzen.js'
// import { unwrapEasyMarketing } from './unwraps/easyMarketing.js'
// import { unwrapEbayRover } from './unwraps/ebayRover.js'
// import { unwrapEClick } from './unwraps/eClick.js'
// import { unwrapEdgepilot } from './unwraps/edgepilot.js'
// import { unwrapEffiliation } from './unwraps/effiliation.js'
// import { unwrapEhub } from './unwraps/ehub.js'
// import { unwrapElasticEmail } from './unwraps/elasticEmail.js'
// import { unwrapEmbedly } from './unwraps/embedly.js'
// import { unwrapEpn } from './unwraps/epn.js'
// import { unwrapEsva } from './unwraps/esva.js'
// import { unwrapEulerian } from './unwraps/eulerian.js'
import { unwrapEvernote } from './unwraps/evernote.js'
// import { unwrapExpediaAffiliate } from './unwraps/expediaAffiliate.js'
import { unwrapFacebookShim } from './unwraps/facebook.js'
// import { unwrapFanbridge } from './unwraps/fanbridge.js'
// import { unwrapFeedblitz } from './unwraps/feedblitz.js'
// import { unwrapFeedsportal } from './unwraps/feedsportal.js'
import { unwrapFeedStatistics } from './unwraps/feedStatistics.js'
import { unwrapFinalsite } from './unwraps/finalsite.js'
// import { unwrapFirebaseDynamicLinks } from './unwraps/firebaseDynamicLinks.js'
// import { unwrapFireeye } from './unwraps/fireeye.js'
// import { unwrapFirstory } from './unwraps/firstory.js'
// import { unwrapFiverr } from './unwraps/fiverr.js'
// import { unwrapFlexoffers } from './unwraps/flexoffers.js'
import { unwrapFlipboard } from './unwraps/flipboard.js'
// import { unwrapFortimail } from './unwraps/fortimail.js'
import { unwrapFtc } from './unwraps/ftc.js'
// import { unwrapGateSc } from './unwraps/gateSc.js'
// import { unwrapGeoriot } from './unwraps/georiot.js'
import { unwrapGitee } from './unwraps/gitee.js'
// import { unwrapGlueUp } from './unwraps/glueUp.js'
import { unwrapGoogle } from './unwraps/google.js'
// import { unwrapGoogleAds } from './unwraps/googleAds.js'
import { unwrapGoogleAmpViewer } from './unwraps/googleAmpViewer.js'
import { unwrapGoogleNews } from './unwraps/googleNews.js'
import { unwrapGoogleNewsModern } from './unwraps/googleNewsModern.js'
import { unwrapGoogleScholar } from './unwraps/googleScholar.js'
// import { unwrapGroupon } from './unwraps/groupon.js'
// import { unwrapGurunavi } from './unwraps/gurunavi.js'
import { unwrapHackerone } from './unwraps/hackerone.js'
import { unwrapHashnode } from './unwraps/hashnode.js'
// import { unwrapHasoffers } from './unwraps/hasoffers.js'
import { unwrapHearthis } from './unwraps/hearthis.js'
// import { unwrapHellohq } from './unwraps/hellohq.js'
import { unwrapHirkereso } from './unwraps/hirkereso.js'
import { unwrapHorde } from './unwraps/horde.js'
// import { unwrapHornetsecurity } from './unwraps/hornetsecurity.js'
import { unwrapHrefLi } from './unwraps/hrefLi.js'
// import { unwrapHubspotSidekick } from './unwraps/hubspotSidekick.js'
// import { unwrapIcptrack } from './unwraps/icptrack.js'
// import { unwrapIgafnl } from './unwraps/igafnl.js'
// import { unwrapImpact } from './unwraps/impact.js'
import { unwrapIndexHu } from './unwraps/indexHu.js'
// import { unwrapInsiderAffiliate } from './unwraps/insiderAffiliate.js'
import { unwrapInstagramShim } from './unwraps/instagram.js'
// import { unwrapIntranetQuorum } from './unwraps/intranetQuorum.js'
// import { unwrapInvolveAsia } from './unwraps/involveAsia.js'
import { unwrapIrs } from './unwraps/irs.js'
import { unwrapJianshuGo } from './unwraps/jianshuGo.js'
import { unwrapJive } from './unwraps/jive.js'
import { unwrapJuejin } from './unwraps/juejin.js'
// import { unwrapJustwatch } from './unwraps/justwatch.js'
// import { unwrapKlook } from './unwraps/klook.js'
// import { unwrapLazada } from './unwraps/lazada.js'
import { unwrapLd246 } from './unwraps/ld246.js'
// import { unwrapLeverAnalytics } from './unwraps/leverAnalytics.js'
// import { unwrapLinkA } from './unwraps/linkA.js'
// import { unwrapLinkconnector } from './unwraps/linkconnector.js'
import { unwrapLinkedin } from './unwraps/linkedin.js'
// import { unwrapLinksynergy } from './unwraps/linksynergy.js'
// import { unwrapLinktrust } from './unwraps/linktrust.js'
// import { unwrapLinkwise } from './unwraps/linkwise.js'
import { unwrapLivejournal } from './unwraps/livejournal.js'
// import { unwrapLnkam } from './unwraps/lnkam.js'
// import { unwrapLocWebArchive } from './unwraps/locWebArchive.js'
// import { unwrapMagellan } from './unwraps/magellan.js'
// import { unwrapMagnetmail } from './unwraps/magnetmail.js'
// import { unwrapMail2easy } from './unwraps/mail2easy.js'
// import { unwrapMailchimp } from './unwraps/mailchimp.js'
// import { unwrapMailinblack } from './unwraps/mailinblack.js'
// import { unwrapMailpanion } from './unwraps/mailpanion.js'
// import { unwrapMailpgn } from './unwraps/mailpgn.js'
import { unwrapMailRu } from './unwraps/mailRu.js'
// import { unwrapMailstat } from './unwraps/mailstat.js'
// import { unwrapMailtrack } from './unwraps/mailtrack.js'
// import { unwrapMandrill } from './unwraps/mandrill.js'
import { unwrapMarketwire } from './unwraps/marketwire.js'
// import { unwrapMcas } from './unwraps/mcas.js'
import { unwrapMedium } from './unwraps/medium.js'
// import { unwrapMegalodon } from './unwraps/megalodon.js'
// import { unwrapMimecast } from './unwraps/mimecast.js'
// import { unwrapMintDownloads } from './unwraps/mintDownloads.js'
// import { unwrapMoshimo } from './unwraps/moshimo.js'
import { unwrapMozillaOutgoing } from './unwraps/mozillaOutgoing.js'
// import { unwrapMyNewsletterBuilder } from './unwraps/myNewsletterBuilder.js'
// import { unwrapNatlibNz } from './unwraps/natlibNz.js'
import { unwrapNaverOutgoing } from './unwraps/naverOutgoing.js'
// import { unwrapNcls } from './unwraps/ncls.js'
// import { unwrapNdlWarp } from './unwraps/ndlWarp.js'
// import { unwrapNetaffiliation } from './unwraps/netaffiliation.js'
import { unwrapNetcentrum } from './unwraps/netcentrum.js'
import { unwrapNewswire } from './unwraps/newswire.js'
// import { unwrapNicoMs } from './unwraps/nicoMs.js'
// import { unwrapNimble } from './unwraps/nimble.js'
// import { unwrapNlaWebarchive } from './unwraps/nlaWebarchive.js'
import { unwrapNodeseek } from './unwraps/nodeseek.js'
import { unwrapOkRu } from './unwraps/okRu.js'
// import { unwrapOp3 } from './unwraps/op3.js'
import { unwrapOsnova } from './unwraps/osnova.js'
// import { unwrapOutlookSafelinks } from './unwraps/outlookSafelinks.js'
// import { unwrapOutlookWebAccess } from './unwraps/outlookWebAccess.js'
// import { unwrapPagefreezer } from './unwraps/pagefreezer.js'
// import { unwrapPartnerAds } from './unwraps/partnerAds.js'
import { unwrapPhilpapers } from './unwraps/philpapers.js'
// import { unwrapPipedrive } from './unwraps/pipedrive.js'
import { unwrapPocket } from './unwraps/pocket.js'
// import { unwrapPodcorn } from './unwraps/podcorn.js'
// import { unwrapPodscribe } from './unwraps/podscribe.js'
// import { unwrapPodsights } from './unwraps/podsights.js'
// import { unwrapPodtrac } from './unwraps/podtrac.js'
// import { unwrapPostmark } from './unwraps/postmark.js'
// import { unwrapPrezly } from './unwraps/prezly.js'
import { unwrapPrNewswire } from './unwraps/prNewswire.js'
// import { unwrapProofpointIsolation } from './unwraps/proofpointIsolation.js'
// import { unwrapProofpointV1 } from './unwraps/proofpointV1.js'
// import { unwrapProofpointV2 } from './unwraps/proofpointV2.js'
// import { unwrapProofpointV3 } from './unwraps/proofpointV3.js'
import { unwrapPrweb } from './unwraps/prweb.js'
// import { unwrapRakutenAffiliate } from './unwraps/rakutenAffiliate.js'
import { unwrapRamblerMail } from './unwraps/ramblerMail.js'
// import { unwrapRecruitics } from './unwraps/recruitics.js'
import { unwrapRedditOut } from './unwraps/redditOut.js'
import { unwrapRediffmail } from './unwraps/rediffmail.js'
// import { unwrapRedirectingat } from './unwraps/redirectingat.js'
import { unwrapResearchgate } from './unwraps/researchgate.js'
// import { unwrapReverbnation } from './unwraps/reverbnation.js'
// import { unwrapReviveAdserver } from './unwraps/reviveAdserver.js'
// import { unwrapSalesdoubler } from './unwraps/salesdoubler.js'
// import { unwrapSalesflare } from './unwraps/salesflare.js'
// import { unwrapSalesforceiq } from './unwraps/salesforceiq.js'
// import { unwrapSalsa } from './unwraps/salsa.js'
import { unwrapSapHelp } from './unwraps/sapHelp.js'
// import { unwrapSbsAd } from './unwraps/sbsAd.js'
import { unwrapSegmentfault } from './unwraps/segmentfault.js'
import { unwrapSerendipity } from './unwraps/serendipity.js'
// import { unwrapShareasale } from './unwraps/shareasale.js'
// import { unwrapSkimlinks } from './unwraps/skimlinks.js'
import { unwrapSkyrock } from './unwraps/skyrock.js'
// import { unwrapSlack } from './unwraps/slack.js'
// import { unwrapSlickdeals } from './unwraps/slickdeals.js'
// import { unwrapSmartAdserver } from './unwraps/smartAdserver.js'
// import { unwrapSmartredirect } from './unwraps/smartredirect.js'
// import { unwrapSmry } from './unwraps/smry.js'
// import { unwrapSophos } from './unwraps/sophos.js'
import { unwrapSoundcloud } from './unwraps/soundcloud.js'
// import { unwrapSquarespaceEmail } from './unwraps/squarespaceEmail.js'
import { unwrapSspai } from './unwraps/sspai.js'
// import { unwrapStay22 } from './unwraps/stay22.js'
import { unwrapSteamLinkfilter } from './unwraps/steamLinkfilter.js'
// import { unwrapStreak } from './unwraps/streak.js'
// import { unwrapStreamsend } from './unwraps/streamsend.js'
// import { unwrapSurugaya } from './unwraps/surugaya.js'
// import { unwrapSymantecClicktime } from './unwraps/symantecClicktime.js'
// import { unwrapSymplicity } from './unwraps/symplicity.js'
// import { unwrapTargetCircle } from './unwraps/targetCircle.js'
import { unwrapThreadsShim } from './unwraps/threads.js'
import { unwrapTiktok } from './unwraps/tiktok.js'
// import { unwrapTitanhqLinklock } from './unwraps/titanhqLinklock.js'
// import { unwrapTopsec } from './unwraps/topsec.js'
// import { unwrapToucharcade } from './unwraps/toucharcade.js'
// import { unwrapTracdelight } from './unwraps/tracdelight.js'
// import { unwrapTradedoubler } from './unwraps/tradedoubler.js'
// import { unwrapTradetracker } from './unwraps/tradetracker.js'
// import { unwrapTravelpayouts } from './unwraps/travelpayouts.js'
// import { unwrapTrendMicro } from './unwraps/trendMicro.js'
// import { unwrapTriplelift } from './unwraps/triplelift.js'
// import { unwrapTrustwaveScanmail } from './unwraps/trustwaveScanmail.js'
// import { unwrapTrxHub } from './unwraps/trxHub.js'
import { unwrapTumblr } from './unwraps/tumblr.js'
// import { unwrapTwitterRedirect } from './unwraps/twitterRedirect.js'
// import { unwrapTwoCheckout } from './unwraps/twoCheckout.js'
// import { unwrapUinterbox } from './unwraps/uinterbox.js'
// import { unwrapUkgwa } from './unwraps/ukgwa.js'
// import { unwrapUkWebArchive } from './unwraps/ukWebArchive.js'
// import { unwrapUnescoWebArchive } from './unwraps/unescoWebArchive.js'
// import { unwrapUnhcrWebArchive } from './unwraps/unhcrWebArchive.js'
// import { unwrapUnisender } from './unwraps/unisender.js'
// import { unwrapVadeSecure } from './unwraps/vadeSecure.js'
// import { unwrapValuecommerce } from './unwraps/valuecommerce.js'
import { unwrapVanilla } from './unwraps/vanilla.js'
import { unwrapVbulletin } from './unwraps/vbulletin.js'
// import { unwrapVefsafn } from './unwraps/vefsafn.js'
// import { unwrapVgWort } from './unwraps/vgWort.js'
// import { unwrapViglink } from './unwraps/viglink.js'
import { unwrapVirgool } from './unwraps/virgool.js'
import { unwrapVkAway } from './unwraps/vkAway.js'
// import { unwrapVuture } from './unwraps/vuture.js'
// import { unwrapWebcitation } from './unwraps/webcitation.js'
// import { unwrapWebgains } from './unwraps/webgains.js'
// import { unwrapWebharvest } from './unwraps/webharvest.js'
// import { unwrapWikiwix } from './unwraps/wikiwix.js'
// import { unwrapWikizero } from './unwraps/wikizero.js'
// import { unwrapWordpressEmail } from './unwraps/wordpressEmail.js'
// import { unwrapWordpressGo2 } from './unwraps/wordpressGo2.js'
// import { unwrapWorldNomads } from './unwraps/worldNomads.js'
import { unwrapWpPoczta } from './unwraps/wpPoczta.js'
import { unwrapXengentr } from './unwraps/xengentr.js'
import { unwrapYahooJapan } from './unwraps/yahooJapan.js'
import { unwrapYahooSearch } from './unwraps/yahooSearch.js'
// import { unwrapYamm } from './unwraps/yamm.js'
import { unwrapYandexMail } from './unwraps/yandexMail.js'
import { unwrapYelp } from './unwraps/yelp.js'
import { unwrapYouTube } from './unwraps/youtube.js'
// import { unwrapZanox } from './unwraps/zanox.js'
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
  unwrapAsk,
  unwrapBing,
  // unwrapDuckduckgo,
  unwrapGoogle,
  unwrapGoogleAmpViewer,
  unwrapGoogleNews,
  unwrapGoogleNewsModern,
  unwrapGoogleScholar,
  unwrapHirkereso,
  unwrapYahooJapan,
  unwrapYahooSearch,
  unwrapYouTube,

  // Email and security gateways.
  // unwrapAceml,
  // unwrapAmazonSes,
  // unwrapAugure,
  // unwrapAxigen,
  // unwrapBananatag,
  // unwrapBarracudaLinkProtect,
  // unwrapBuzzstream,
  // unwrapCheckPointHarmony,
  // unwrapCiscoSecureWeb,
  // unwrapCloudhq,
  // unwrapConstantContact,
  // unwrapContactMonkey,
  // unwrapCse360,
  // unwrapDirectMail,
  // unwrapDyn,
  // unwrapEdgepilot,
  // unwrapElasticEmail,
  // unwrapEsva,
  // unwrapFanbridge,
  // unwrapFireeye,
  // unwrapFortimail,
  // unwrapGlueUp,
  // unwrapHellohq,
  // unwrapHornetsecurity,
  // unwrapHubspotSidekick,
  // unwrapIcptrack,
  // unwrapIgafnl,
  // unwrapIntranetQuorum,
  // unwrapLeverAnalytics,
  // unwrapMagnetmail,
  // unwrapMail2easy,
  // unwrapMailchimp,
  // unwrapMailinblack,
  // unwrapMailpanion,
  // unwrapMailpgn,
  // unwrapMailstat,
  // unwrapMailtrack,
  // unwrapMandrill,
  // unwrapMcas,
  // unwrapMimecast,
  // unwrapMyNewsletterBuilder,
  // unwrapNimble,
  // unwrapOutlookSafelinks,
  // unwrapOutlookWebAccess,
  // unwrapPipedrive,
  // unwrapPostmark,
  // unwrapPrezly,
  // unwrapProofpointIsolation,
  // unwrapProofpointV1,
  // unwrapProofpointV2,
  // unwrapProofpointV3,
  // unwrapReverbnation,
  // unwrapSalesflare,
  // unwrapSalesforceiq,
  // unwrapSalsa,
  // unwrapSlack,
  // unwrapSophos,
  // unwrapSquarespaceEmail,
  // unwrapStreak,
  // unwrapStreamsend,
  // unwrapSymantecClicktime,
  // unwrapSymplicity,
  // unwrapTitanhqLinklock,
  // unwrapTopsec,
  // unwrapTrendMicro,
  // unwrapTrustwaveScanmail,
  // unwrapTwitterRedirect,
  // unwrapUnisender,
  // unwrapVadeSecure,
  // unwrapVuture,
  // unwrapWordpressEmail,
  // unwrapYamm,

  // Affiliate networks.
  // unwrap2performant,
  // unwrapA8Net,
  // unwrapAccesstrade,
  // unwrapAdcell,
  // unwrapAdjust,
  // unwrapAdmitad,
  // unwrapAdrecord,
  // unwrapAdtraction,
  // unwrapAffilae,
  // unwrapAffiliateFuture,
  // unwrapAffiliatesOne,
  // unwrapAliexpress,
  // unwrapAmazonAffiliate,
  // unwrapAppsflyerOnelink,
  // unwrapApptrkr,
  // unwrapAvantlink,
  // unwrapAwin,
  // unwrapBizrate,
  // unwrapBolPartner,
  // unwrapButton,
  // unwrapBuyAt,
  // unwrapBuybox,
  // unwrapCake,
  // unwrapCcbill,
  // unwrapCjNetwork,
  // unwrapCleverbridge,
  // unwrapCommissionFactory,
  // unwrapCommunicationads,
  // unwrapConvertiser,
  // unwrapCuelinks,
  // unwrapDigidip,
  // unwrapDigikala,
  // unwrapDmmAffiliate,
  // unwrapDognet,
  // unwrapDuomai,
  // unwrapEasyMarketing,
  // unwrapEbayRover,
  // unwrapEClick,
  // unwrapEffiliation,
  // unwrapEhub,
  // unwrapEpn,
  // unwrapEulerian,
  // unwrapExpediaAffiliate,
  // unwrapFirebaseDynamicLinks,
  // unwrapFiverr,
  // unwrapFlexoffers,
  // unwrapGateSc,
  // unwrapGeoriot,
  // unwrapGroupon,
  // unwrapGurunavi,
  // unwrapHasoffers,
  // unwrapImpact,
  // unwrapInsiderAffiliate,
  // unwrapInvolveAsia,
  // unwrapJustwatch,
  // unwrapKlook,
  // unwrapLazada,
  // unwrapLinkA,
  // unwrapLinkconnector,
  // unwrapLinksynergy,
  // unwrapLinktrust,
  // unwrapLinkwise,
  // unwrapLnkam,
  // unwrapMoshimo,
  // unwrapNcls,
  // unwrapNetaffiliation,
  // unwrapPartnerAds,
  // Rakuten Japan's own program, separate from the LinkSynergy network in unwrapLinksynergy.
  // Opt-in like the rest of the group: unwrapping drops the publisher's commission.
  // unwrapRakutenAffiliate,
  // unwrapRecruitics,
  // unwrapRedirectingat,
  // unwrapSalesdoubler,
  // unwrapSbsAd,
  // unwrapShareasale,
  // unwrapSkimlinks,
  // unwrapSlickdeals,
  // unwrapSmartredirect,
  // unwrapStay22,
  // unwrapSurugaya,
  // unwrapTargetCircle,
  // unwrapToucharcade,
  // unwrapTracdelight,
  // unwrapTradedoubler,
  // unwrapTradetracker,
  // unwrapTravelpayouts,
  // unwrapTrxHub,
  // unwrapTwoCheckout,
  // unwrapUinterbox,
  // unwrapValuecommerce,
  // unwrapVgWort,
  // unwrapViglink,
  // unwrapWebgains,
  // unwrapWordpressGo2,
  // unwrapWorldNomads,
  // unwrapZanox,

  // Ad networks.
  // unwrapBingAds,
  // unwrapGoogleAds,
  // unwrapReviveAdserver,
  // unwrapSmartAdserver,
  // unwrapTriplelift,

  // Podcast analytics prefixes.
  // unwrapAcast,
  // unwrapAnchor,
  // unwrapBlubrry,
  // unwrapChartable,
  // unwrapFirstory,
  // unwrapMagellan,
  // unwrapOp3,
  // unwrapPodcorn,
  // unwrapPodscribe,
  // unwrapPodsights,
  // unwrapPodtrac,

  // Social and community platforms.
  unwrap4pda,
  unwrapAnonymTo,
  unwrapBale,
  unwrapBlueskyRedirect,
  unwrapBridgyFed,
  unwrapBytedance,
  unwrapCalendly,
  unwrapCanva,
  unwrapDerefMail,
  unwrapDeviantartOutgoing,
  unwrapDisqus,
  unwrapDouban,
  unwrapDzen,
  unwrapFacebookShim,
  unwrapFlipboard,
  unwrapHearthis,
  unwrapHorde,
  unwrapHrefLi,
  unwrapIndexHu,
  unwrapInstagramShim,
  unwrapJive,
  unwrapLinkedin,
  unwrapLivejournal,
  unwrapMailRu,
  unwrapMedium,
  unwrapNaverOutgoing,
  unwrapNetcentrum,
  // unwrapNicoMs,
  unwrapNodeseek,
  unwrapOkRu,
  unwrapOsnova,
  unwrapPocket,
  unwrapRamblerMail,
  unwrapRedditOut,
  unwrapRediffmail,
  unwrapSkyrock,
  unwrapSoundcloud,
  unwrapSteamLinkfilter,
  unwrapThreadsShim,
  unwrapTiktok,
  unwrapTumblr,
  unwrapVanilla,
  unwrapVbulletin,
  unwrapVkAway,
  unwrapWpPoczta,
  unwrapXengentr,
  unwrapYandexMail,
  unwrapYelp,

  // Developer and publishing platforms.
  unwrapAliyun,
  unwrapArxiv,
  unwrapCsdn,
  unwrapDasBlog,
  unwrapDatalifeEngine,
  unwrapDropbox,
  unwrapEvernote,
  unwrapFeedStatistics,
  unwrapFinalsite,
  unwrapGitee,
  unwrapHackerone,
  unwrapHashnode,
  unwrapJianshuGo,
  unwrapJuejin,
  unwrapLd246,
  // unwrapMintDownloads,
  unwrapPhilpapers,
  unwrapResearchgate,
  unwrapSapHelp,
  unwrapSegmentfault,
  unwrapSerendipity,
  unwrapSspai,
  unwrapVirgool,
  unwrapZhihu,

  // Press release wires.
  unwrapBusinessWire,
  unwrapMarketwire,
  unwrapNewswire,
  unwrapPrNewswire,
  unwrapPrweb,

  // Government sites.
  unwrapFtc,
  unwrapIrs,

  // Cache and proxy services.
  // unwrap12ft,
  // unwrapAmpCache,
  // unwrapAnonymouse,
  // unwrapArchiveToday, // Snapshot of a page at a point in time, not a redirect
  // unwrapArquivo,
  // unwrapBacLacWebArchive,
  // unwrapEmbedly,
  // unwrapLocWebArchive,
  // unwrapMegalodon,
  unwrapMozillaOutgoing,
  // unwrapNatlibNz,
  // unwrapNdlWarp,
  // unwrapNlaWebarchive,
  // unwrapPagefreezer,
  // unwrapSmry,
  // unwrapUkgwa,
  // unwrapUkWebArchive,
  // unwrapUnescoWebArchive,
  // unwrapUnhcrWebArchive,
  // unwrapVefsafn,
  // unwrapWebcitation,
  // unwrapWebharvest,
  // unwrapWikiwix,
  // unwrapWikizero,

  // Legacy aggregators.
  // unwrapFeedblitz,
  // unwrapFeedsportal,
  unwrapZemanta,
]
