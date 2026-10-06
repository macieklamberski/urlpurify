import { trackingParamsLiterals } from './tracking/literals.js'
import { trackingParamsPatterns } from './tracking/patterns.js'
import type { TrackingParam, UrlUnwrapper } from './types.js'
import { unwrap2performant } from './unwraps/2performant.js'
import { unwrap4pda } from './unwraps/4pda.js'
import { unwrap12ft } from './unwraps/12ft.js'
import { unwrapA8Net } from './unwraps/a8Net.js'
import { unwrapAboutCom } from './unwraps/aboutCom.js'
import { unwrapAcast } from './unwraps/acast.js'
import { unwrapAccesstrade } from './unwraps/accesstrade.js'
import { unwrapAceml } from './unwraps/aceml.js'
import { unwrapAdcell } from './unwraps/adcell.js'
import { unwrapAdjust } from './unwraps/adjust.js'
import { unwrapAdmitad } from './unwraps/admitad.js'
import { unwrapAdrecord } from './unwraps/adrecord.js'
import { unwrapAdtraction } from './unwraps/adtraction.js'
import { unwrapAffilae } from './unwraps/affilae.js'
import { unwrapAffiliateFuture } from './unwraps/affiliateFuture.js'
import { unwrapAffiliatesOne } from './unwraps/affiliatesOne.js'
import { unwrapAliexpress } from './unwraps/aliexpress.js'
import { unwrapAliyun } from './unwraps/aliyun.js'
import { unwrapAllblog } from './unwraps/allblog.js'
import { unwrapAmazonAffiliate } from './unwraps/amazonAffiliate.js'
import { unwrapAmazonSes } from './unwraps/amazonSes.js'
import { unwrapAmpCache } from './unwraps/ampCache.js'
import { unwrapAnchor } from './unwraps/anchor.js'
import { unwrapAnonymouse } from './unwraps/anonymouse.js'
import { unwrapAnonymTo } from './unwraps/anonymTo.js'
import { unwrapAppsflyerOnelink } from './unwraps/appsflyerOnelink.js'
import { unwrapApptrkr } from './unwraps/apptrkr.js'
import { unwrapArchiveToday } from './unwraps/archiveToday.js'
import { unwrapArquivo } from './unwraps/arquivo.js'
import { unwrapArxiv } from './unwraps/arxiv.js'
import { unwrapAsk } from './unwraps/ask.js'
import { unwrapAugure } from './unwraps/augure.js'
import { unwrapAvantlink } from './unwraps/avantlink.js'
import { unwrapAwesound } from './unwraps/awesound.js'
import { unwrapAwin } from './unwraps/awin.js'
import { unwrapAxigen } from './unwraps/axigen.js'
import { unwrapBabyblog } from './unwraps/babyblog.js'
import { unwrapBacLacWebArchive } from './unwraps/bacLacWebArchive.js'
import { unwrapBale } from './unwraps/bale.js'
import { unwrapBananatag } from './unwraps/bananatag.js'
import { unwrapBarracudaLinkProtect } from './unwraps/barracudaLinkProtect.js'
import { unwrapBing } from './unwraps/bing.js'
import { unwrapBingAds } from './unwraps/bingAds.js'
import { unwrapBitrix } from './unwraps/bitrix.js'
import { unwrapBitrixBanner } from './unwraps/bitrixBanner.js'
import { unwrapBizrate } from './unwraps/bizrate.js'
import { unwrapBlubrry } from './unwraps/blubrry.js'
import { unwrapBolPartner } from './unwraps/bolPartner.js'
import { unwrapBridgyFed } from './unwraps/bridgyFed.js'
import { unwrapBlueskyRedirect } from './unwraps/bsky.js'
import { unwrapBusinessWire } from './unwraps/businessWire.js'
import { unwrapButton } from './unwraps/button.js'
import { unwrapBuyAt } from './unwraps/buyAt.js'
import { unwrapBuybox } from './unwraps/buybox.js'
import { unwrapBuzzstream } from './unwraps/buzzstream.js'
import { unwrapBytedance } from './unwraps/bytedance.js'
import { unwrapCake } from './unwraps/cake.js'
import { unwrapCalendly } from './unwraps/calendly.js'
import { unwrapCanva } from './unwraps/canva.js'
import { unwrapCcbill } from './unwraps/ccbill.js'
import { unwrapChartable } from './unwraps/chartable.js'
import { unwrapCheckPointHarmony } from './unwraps/checkPointHarmony.js'
import { unwrapChitika } from './unwraps/chitika.js'
import { unwrapCiscoSecureWeb } from './unwraps/ciscoSecureWeb.js'
import { unwrapCjNetwork } from './unwraps/cjNetwork.js'
import { unwrapCleverbridge } from './unwraps/cleverbridge.js'
import { unwrapClevercomm } from './unwraps/clevercomm.js'
import { unwrapCloudhq } from './unwraps/cloudhq.js'
import { unwrapCommissionFactory } from './unwraps/commissionFactory.js'
import { unwrapCommunicationads } from './unwraps/communicationads.js'
import { unwrapConstantContact } from './unwraps/constantContact.js'
import { unwrapContactMonkey } from './unwraps/contactMonkey.js'
import { unwrapConvertiser } from './unwraps/convertiser.js'
import { unwrapCsdn } from './unwraps/csdn.js'
import { unwrapCse360 } from './unwraps/cse360.js'
import { unwrapCuelinks } from './unwraps/cuelinks.js'
import { unwrapDasBlog } from './unwraps/dasBlog.js'
import { unwrapDatalifeEngine } from './unwraps/datalifeEngine.js'
import { unwrapDeployer } from './unwraps/deployer.js'
import { unwrapDerefMail } from './unwraps/derefMail.js'
import { unwrapDeviantartOutgoing } from './unwraps/deviantartOutgoing.js'
import { unwrapDigidip } from './unwraps/digidip.js'
import { unwrapDigikala } from './unwraps/digikala.js'
import { unwrapDirectMail } from './unwraps/directMail.js'
import { unwrapDisqus } from './unwraps/disqus.js'
import { unwrapDmmAffiliate } from './unwraps/dmmAffiliate.js'
import { unwrapDognet } from './unwraps/dognet.js'
import { unwrapDouban } from './unwraps/douban.js'
import { unwrapDropbox } from './unwraps/dropbox.js'
import { unwrapDstats } from './unwraps/dstats.js'
import { unwrapDuckduckgo } from './unwraps/duckduckgo.js'
import { unwrapDuckduckgoAds } from './unwraps/duckduckgoAds.js'
import { unwrapDuomai } from './unwraps/duomai.js'
import { unwrapDyn } from './unwraps/dyn.js'
import { unwrapDzen } from './unwraps/dzen.js'
import { unwrapEasyMarketing } from './unwraps/easyMarketing.js'
import { unwrapEbayRover } from './unwraps/ebayRover.js'
import { unwrapEClick } from './unwraps/eClick.js'
import { unwrapEdgepilot } from './unwraps/edgepilot.js'
import { unwrapEffiliation } from './unwraps/effiliation.js'
import { unwrapEhub } from './unwraps/ehub.js'
import { unwrapElasticEmail } from './unwraps/elasticEmail.js'
import { unwrapEmbedly } from './unwraps/embedly.js'
import { unwrapEpn } from './unwraps/epn.js'
import { unwrapEsva } from './unwraps/esva.js'
import { unwrapEulerian } from './unwraps/eulerian.js'
import { unwrapEvernote } from './unwraps/evernote.js'
import { unwrapExciteTranslate } from './unwraps/exciteTranslate.js'
import { unwrapExpediaAffiliate } from './unwraps/expediaAffiliate.js'
import { unwrapFacebookShim } from './unwraps/facebook.js'
import { unwrapFanbridge } from './unwraps/fanbridge.js'
import { unwrapFederatedMedia } from './unwraps/federatedMedia.js'
import { unwrapFeedblitz } from './unwraps/feedblitz.js'
import { unwrapFeedStatistics } from './unwraps/feedStatistics.js'
import { unwrapFeedsportal } from './unwraps/feedsportal.js'
import { unwrapFinalsite } from './unwraps/finalsite.js'
import { unwrapFirebaseDynamicLinks } from './unwraps/firebaseDynamicLinks.js'
import { unwrapFireeye } from './unwraps/fireeye.js'
import { unwrapFirstory } from './unwraps/firstory.js'
import { unwrapFiverr } from './unwraps/fiverr.js'
import { unwrapFlexoffers } from './unwraps/flexoffers.js'
import { unwrapFlipboard } from './unwraps/flipboard.js'
import { unwrapFortimail } from './unwraps/fortimail.js'
import { unwrapFtc } from './unwraps/ftc.js'
import { unwrapGateSc } from './unwraps/gateSc.js'
import { unwrapGeoriot } from './unwraps/georiot.js'
import { unwrapGitee } from './unwraps/gitee.js'
import { unwrapGlueUp } from './unwraps/glueUp.js'
import { unwrapGoogle } from './unwraps/google.js'
import { unwrapGoogleAds } from './unwraps/googleAds.js'
import { unwrapGoogleAmpViewer } from './unwraps/googleAmpViewer.js'
import { unwrapGoogleNews } from './unwraps/googleNews.js'
import { unwrapGoogleNewsModern } from './unwraps/googleNewsModern.js'
import { unwrapGoogleScholar } from './unwraps/googleScholar.js'
import { unwrapGoogleTranslate } from './unwraps/googleTranslate.js'
import { unwrapGoogleWebLight } from './unwraps/googleWebLight.js'
import { unwrapGroupMail } from './unwraps/groupMail.js'
import { unwrapGroupon } from './unwraps/groupon.js'
import { unwrapGurunavi } from './unwraps/gurunavi.js'
import { unwrapHackerone } from './unwraps/hackerone.js'
import { unwrapHashnode } from './unwraps/hashnode.js'
import { unwrapHasoffers } from './unwraps/hasoffers.js'
import { unwrapHearthis } from './unwraps/hearthis.js'
import { unwrapHellohq } from './unwraps/hellohq.js'
import { unwrapHirkereso } from './unwraps/hirkereso.js'
import { unwrapHorde } from './unwraps/horde.js'
import { unwrapHornetsecurity } from './unwraps/hornetsecurity.js'
import { unwrapHrefLi } from './unwraps/hrefLi.js'
import { unwrapHubspotSidekick } from './unwraps/hubspotSidekick.js'
import { unwrapIcptrack } from './unwraps/icptrack.js'
import { unwrapIgafnl } from './unwraps/igafnl.js'
import { unwrapImpact } from './unwraps/impact.js'
import { unwrapIndexHu } from './unwraps/indexHu.js'
import { unwrapInfospace } from './unwraps/infospace.js'
import { unwrapInsiderAffiliate } from './unwraps/insiderAffiliate.js'
import { unwrapInstagramShim } from './unwraps/instagram.js'
import { unwrapIntranetQuorum } from './unwraps/intranetQuorum.js'
import { unwrapInvolveAsia } from './unwraps/involveAsia.js'
import { unwrapIrs } from './unwraps/irs.js'
import { unwrapJianshuGo } from './unwraps/jianshuGo.js'
import { unwrapJive } from './unwraps/jive.js'
import { unwrapJuejin } from './unwraps/juejin.js'
import { unwrapJustwatch } from './unwraps/justwatch.js'
import { unwrapKlook } from './unwraps/klook.js'
import { unwrapLazada } from './unwraps/lazada.js'
import { unwrapLd246 } from './unwraps/ld246.js'
import { unwrapLeverAnalytics } from './unwraps/leverAnalytics.js'
import { unwrapLinkA } from './unwraps/linkA.js'
import { unwrapLinkconnector } from './unwraps/linkconnector.js'
import { unwrapLinkedin } from './unwraps/linkedin.js'
import { unwrapLinksynergy } from './unwraps/linksynergy.js'
import { unwrapLinktrust } from './unwraps/linktrust.js'
import { unwrapLinkwise } from './unwraps/linkwise.js'
import { unwrapLivejournal } from './unwraps/livejournal.js'
import { unwrapLnkam } from './unwraps/lnkam.js'
import { unwrapLocaweb } from './unwraps/locaweb.js'
import { unwrapLocWebArchive } from './unwraps/locWebArchive.js'
import { unwrapMagellan } from './unwraps/magellan.js'
import { unwrapMagnetmail } from './unwraps/magnetmail.js'
import { unwrapMail2easy } from './unwraps/mail2easy.js'
import { unwrapMailchimp } from './unwraps/mailchimp.js'
import { unwrapMailinblack } from './unwraps/mailinblack.js'
import { unwrapMailpanion } from './unwraps/mailpanion.js'
import { unwrapMailpgn } from './unwraps/mailpgn.js'
import { unwrapMailRu } from './unwraps/mailRu.js'
import { unwrapMailRuLink } from './unwraps/mailRuLink.js'
import { unwrapMailstat } from './unwraps/mailstat.js'
import { unwrapMailtrack } from './unwraps/mailtrack.js'
import { unwrapMandrill } from './unwraps/mandrill.js'
import { unwrapMarketwire } from './unwraps/marketwire.js'
import { unwrapMcas } from './unwraps/mcas.js'
import { unwrapMedium } from './unwraps/medium.js'
import { unwrapMegalodon } from './unwraps/megalodon.js'
import { unwrapMimecast } from './unwraps/mimecast.js'
import { unwrapMintDownloads } from './unwraps/mintDownloads.js'
import { unwrapMintFeeder } from './unwraps/mintFeeder.js'
import { unwrapMoshimo } from './unwraps/moshimo.js'
import { unwrapMozillaOutgoing } from './unwraps/mozillaOutgoing.js'
import { unwrapMyNewsletterBuilder } from './unwraps/myNewsletterBuilder.js'
import { unwrapNarrativ } from './unwraps/narrativ.js'
import { unwrapNatlibNz } from './unwraps/natlibNz.js'
import { unwrapNaverOutgoing } from './unwraps/naverOutgoing.js'
import { unwrapNcls } from './unwraps/ncls.js'
import { unwrapNdlWarp } from './unwraps/ndlWarp.js'
import { unwrapNetaffiliation } from './unwraps/netaffiliation.js'
import { unwrapNetcentrum } from './unwraps/netcentrum.js'
import { unwrapNewswire } from './unwraps/newswire.js'
import { unwrapNicoMs } from './unwraps/nicoMs.js'
import { unwrapNimble } from './unwraps/nimble.js'
import { unwrapNlaWebarchive } from './unwraps/nlaWebarchive.js'
import { unwrapNodeseek } from './unwraps/nodeseek.js'
import { unwrapOkRu } from './unwraps/okRu.js'
import { unwrapOp3 } from './unwraps/op3.js'
import { unwrapOrkut } from './unwraps/orkut.js'
import { unwrapOsnova } from './unwraps/osnova.js'
import { unwrapOutlookSafelinks } from './unwraps/outlookSafelinks.js'
import { unwrapOutlookWebAccess } from './unwraps/outlookWebAccess.js'
import { unwrapPagefreezer } from './unwraps/pagefreezer.js'
import { unwrapPartnerAds } from './unwraps/partnerAds.js'
import { unwrapPhilpapers } from './unwraps/philpapers.js'
import { unwrapPinterest } from './unwraps/pinterest.js'
import { unwrapPipedrive } from './unwraps/pipedrive.js'
import { unwrapPocket } from './unwraps/pocket.js'
import { unwrapPodcorn } from './unwraps/podcorn.js'
import { unwrapPodscribe } from './unwraps/podscribe.js'
import { unwrapPodsights } from './unwraps/podsights.js'
import { unwrapPodtrac } from './unwraps/podtrac.js'
import { unwrapPostmark } from './unwraps/postmark.js'
import { unwrapPrezly } from './unwraps/prezly.js'
import { unwrapPriceGrabber } from './unwraps/priceGrabber.js'
import { unwrapPrNewswire } from './unwraps/prNewswire.js'
import { unwrapPromoJukebox } from './unwraps/promoJukebox.js'
import { unwrapProofpointIsolation } from './unwraps/proofpointIsolation.js'
import { unwrapProofpointV1 } from './unwraps/proofpointV1.js'
import { unwrapProofpointV2 } from './unwraps/proofpointV2.js'
import { unwrapProofpointV3 } from './unwraps/proofpointV3.js'
import { unwrapPrweb } from './unwraps/prweb.js'
import { unwrapQualityClick } from './unwraps/qualityClick.js'
import { unwrapRakutenAffiliate } from './unwraps/rakutenAffiliate.js'
import { unwrapRamblerMail } from './unwraps/ramblerMail.js'
import { unwrapRecruitics } from './unwraps/recruitics.js'
import { unwrapRedditOut } from './unwraps/redditOut.js'
import { unwrapRediffmail } from './unwraps/rediffmail.js'
import { unwrapRedirectingat } from './unwraps/redirectingat.js'
import { unwrapResearchgate } from './unwraps/researchgate.js'
import { unwrapReverbnation } from './unwraps/reverbnation.js'
import { unwrapReviveAdserver } from './unwraps/reviveAdserver.js'
import { unwrapSalesdoubler } from './unwraps/salesdoubler.js'
import { unwrapSalesflare } from './unwraps/salesflare.js'
import { unwrapSalesforceiq } from './unwraps/salesforceiq.js'
import { unwrapSaleshandy } from './unwraps/saleshandy.js'
import { unwrapSalsa } from './unwraps/salsa.js'
import { unwrapSapHelp } from './unwraps/sapHelp.js'
import { unwrapSbsAd } from './unwraps/sbsAd.js'
import { unwrapSegmentfault } from './unwraps/segmentfault.js'
import { unwrapSerendipity } from './unwraps/serendipity.js'
import { unwrapShareasale } from './unwraps/shareasale.js'
import { unwrapShareit } from './unwraps/shareit.js'
import { unwrapSkimlinks } from './unwraps/skimlinks.js'
import { unwrapSkyrock } from './unwraps/skyrock.js'
import { unwrapSlack } from './unwraps/slack.js'
import { unwrapSlickdeals } from './unwraps/slickdeals.js'
import { unwrapSmartAdserver } from './unwraps/smartAdserver.js'
import { unwrapSmartredirect } from './unwraps/smartredirect.js'
import { unwrapSmry } from './unwraps/smry.js'
import { unwrapSophos } from './unwraps/sophos.js'
import { unwrapSoundcloud } from './unwraps/soundcloud.js'
import { unwrapSquarespaceEmail } from './unwraps/squarespaceEmail.js'
import { unwrapSspai } from './unwraps/sspai.js'
import { unwrapStay22 } from './unwraps/stay22.js'
import { unwrapSteamLinkfilter } from './unwraps/steamLinkfilter.js'
import { unwrapStorify } from './unwraps/storify.js'
import { unwrapStreak } from './unwraps/streak.js'
import { unwrapStreamsend } from './unwraps/streamsend.js'
import { unwrapSubstack } from './unwraps/substack.js'
import { unwrapSurugaya } from './unwraps/surugaya.js'
import { unwrapSymantecClicktime } from './unwraps/symantecClicktime.js'
import { unwrapSymplicity } from './unwraps/symplicity.js'
import { unwrapTargetCircle } from './unwraps/targetCircle.js'
import { unwrapTeacup } from './unwraps/teacup.js'
import { unwrapTelegramIv } from './unwraps/telegramIv.js'
import { unwrapThreadsShim } from './unwraps/threads.js'
import { unwrapTiktok } from './unwraps/tiktok.js'
import { unwrapTitanhqLinklock } from './unwraps/titanhqLinklock.js'
import { unwrapTopsec } from './unwraps/topsec.js'
import { unwrapToucharcade } from './unwraps/toucharcade.js'
import { unwrapTracdelight } from './unwraps/tracdelight.js'
import { unwrapTradedoubler } from './unwraps/tradedoubler.js'
import { unwrapTradetracker } from './unwraps/tradetracker.js'
import { unwrapTravelpayouts } from './unwraps/travelpayouts.js'
import { unwrapTrendMicro } from './unwraps/trendMicro.js'
import { unwrapTriplelift } from './unwraps/triplelift.js'
import { unwrapTrustwaveScanmail } from './unwraps/trustwaveScanmail.js'
import { unwrapTrxHub } from './unwraps/trxHub.js'
import { unwrapTumblr } from './unwraps/tumblr.js'
import { unwrapTwitterRedirect } from './unwraps/twitterRedirect.js'
import { unwrapTwoCheckout } from './unwraps/twoCheckout.js'
import { unwrapUinterbox } from './unwraps/uinterbox.js'
import { unwrapUkgwa } from './unwraps/ukgwa.js'
import { unwrapUkWebArchive } from './unwraps/ukWebArchive.js'
import { unwrapUnescoWebArchive } from './unwraps/unescoWebArchive.js'
import { unwrapUnhcrWebArchive } from './unwraps/unhcrWebArchive.js'
import { unwrapUnisender } from './unwraps/unisender.js'
import { unwrapVadeSecure } from './unwraps/vadeSecure.js'
import { unwrapValuecommerce } from './unwraps/valuecommerce.js'
import { unwrapValuePress } from './unwraps/valuePress.js'
import { unwrapVanilla } from './unwraps/vanilla.js'
import { unwrapVbulletin } from './unwraps/vbulletin.js'
import { unwrapVefsafn } from './unwraps/vefsafn.js'
import { unwrapVgWort } from './unwraps/vgWort.js'
import { unwrapViglink } from './unwraps/viglink.js'
import { unwrapVirgool } from './unwraps/virgool.js'
import { unwrapVisibli } from './unwraps/visibli.js'
import { unwrapVkAway } from './unwraps/vkAway.js'
import { unwrapVocus } from './unwraps/vocus.js'
import { unwrapVuture } from './unwraps/vuture.js'
import { unwrapWebArchive } from './unwraps/webArchive.js'
import { unwrapWebcitation } from './unwraps/webcitation.js'
import { unwrapWebgains } from './unwraps/webgains.js'
import { unwrapWebharvest } from './unwraps/webharvest.js'
import { unwrapWikiwix } from './unwraps/wikiwix.js'
import { unwrapWikizero } from './unwraps/wikizero.js'
import { unwrapWordpressEmail } from './unwraps/wordpressEmail.js'
import { unwrapWordpressGo2 } from './unwraps/wordpressGo2.js'
import { unwrapWorldNomads } from './unwraps/worldNomads.js'
import { unwrapWpPoczta } from './unwraps/wpPoczta.js'
import { unwrapXengentr } from './unwraps/xengentr.js'
import { unwrapYahooJapan } from './unwraps/yahooJapan.js'
import { unwrapYahooSearch } from './unwraps/yahooSearch.js'
import { unwrapYamm } from './unwraps/yamm.js'
import { unwrapYandexMail } from './unwraps/yandexMail.js'
import { unwrapYandexTranslate } from './unwraps/yandexTranslate.js'
import { unwrapYandexTurbo } from './unwraps/yandexTurbo.js'
import { unwrapYelp } from './unwraps/yelp.js'
import { unwrapYourMembership } from './unwraps/yourMembership.js'
import { unwrapYouTube } from './unwraps/youtube.js'
import { unwrapZanox } from './unwraps/zanox.js'
import { unwrapZemanta } from './unwraps/zemanta.js'
import { unwrapZhihu } from './unwraps/zhihu.js'
import { unwrapZix } from './unwraps/zix.js'
import { unwrapZscalerIsolation } from './unwraps/zscalerIsolation.js'

export { trackingParamsLiterals } from './tracking/literals.js'
export { trackingParamsPatterns } from './tracking/patterns.js'

// Combined default list applied by cleanUrl and stripTrackingParams.
export const defaultTrackingParams: Array<TrackingParam> = [
  ...trackingParamsLiterals,
  ...trackingParamsPatterns,
]

// Search engine and aggregator result clicks: unwrapping removes only the click logging.
export const searchClickUnwrappers: Array<UrlUnwrapper> = [
  unwrapAllblog,
  unwrapAsk,
  unwrapBing,
  unwrapDuckduckgo,
  unwrapFlipboard,
  unwrapGoogle,
  unwrapGoogleNews,
  unwrapGoogleNewsModern,
  unwrapGoogleScholar,
  unwrapHirkereso,
  unwrapInfospace,
  unwrapYahooJapan,
  unwrapYahooSearch,
  unwrapZemanta,
]

// Link shims, leaving pages and site click counters: unwrapping removes at most a click count.
export const linkShimUnwrappers: Array<UrlUnwrapper> = [
  unwrap4pda,
  unwrapAboutCom,
  unwrapAliyun,
  unwrapAmpCache,
  unwrapAnonymTo,
  unwrapArxiv,
  unwrapBabyblog,
  unwrapBale,
  unwrapBitrix,
  unwrapBlueskyRedirect,
  unwrapBridgyFed,
  unwrapBytedance,
  unwrapCalendly,
  unwrapCanva,
  unwrapCsdn,
  unwrapDasBlog,
  unwrapDatalifeEngine,
  unwrapDerefMail,
  unwrapDeviantartOutgoing,
  unwrapDisqus,
  unwrapDouban,
  unwrapDropbox,
  unwrapDzen,
  unwrapEvernote,
  unwrapFacebookShim,
  unwrapFeedblitz,
  unwrapFeedsportal,
  unwrapFeedStatistics,
  unwrapFinalsite,
  unwrapFtc,
  unwrapGitee,
  unwrapGoogleAmpViewer,
  unwrapHackerone,
  unwrapHashnode,
  unwrapHearthis,
  unwrapHorde,
  unwrapHrefLi,
  unwrapIndexHu,
  unwrapInstagramShim,
  unwrapIrs,
  unwrapJianshuGo,
  unwrapJive,
  unwrapJuejin,
  unwrapLd246,
  unwrapLinkedin,
  unwrapLivejournal,
  unwrapMailRu,
  unwrapMedium,
  unwrapMintFeeder,
  unwrapMozillaOutgoing,
  unwrapNaverOutgoing,
  unwrapNetcentrum,
  unwrapNicoMs,
  unwrapNodeseek,
  unwrapOkRu,
  unwrapOsnova,
  unwrapPhilpapers,
  unwrapPinterest,
  unwrapPocket,
  unwrapRamblerMail,
  unwrapRedditOut,
  unwrapRediffmail,
  unwrapResearchgate,
  unwrapSapHelp,
  unwrapSegmentfault,
  unwrapSerendipity,
  unwrapSkyrock,
  unwrapSlack,
  unwrapSoundcloud,
  unwrapSspai,
  unwrapSteamLinkfilter,
  unwrapStorify,
  unwrapTeacup,
  unwrapThreadsShim,
  unwrapTiktok,
  unwrapTumblr,
  unwrapVanilla,
  unwrapVbulletin,
  unwrapVirgool,
  unwrapVisibli,
  unwrapVkAway,
  unwrapWpPoczta,
  unwrapXengentr,
  unwrapYandexMail,
  unwrapYelp,
  unwrapYouTube,
  unwrapZhihu,
]

// Press release wire click trackers: unwrapping removes the wire's click stats.
export const pressReleaseUnwrappers: Array<UrlUnwrapper> = [
  unwrapBusinessWire,
  unwrapMarketwire,
  unwrapNewswire,
  unwrapPrNewswire,
  unwrapPrweb,
  unwrapValuePress,
]

// Link shims that answer only behind a sign-in: unwrapping removes nothing.
export const signInShimUnwrappers: Array<UrlUnwrapper> = [
  unwrapAxigen,
  unwrapMailRuLink,
  unwrapOrkut,
  unwrapOutlookWebAccess,
]

// Security gateways: unwrapping skips the gateway's click-time check.
export const securityGatewayUnwrappers: Array<UrlUnwrapper> = [
  unwrapBarracudaLinkProtect,
  unwrapCheckPointHarmony,
  unwrapCiscoSecureWeb,
  unwrapEdgepilot,
  unwrapEsva,
  unwrapFireeye,
  unwrapFortimail,
  unwrapHornetsecurity,
  unwrapMailinblack,
  unwrapMcas,
  unwrapMimecast,
  unwrapOutlookSafelinks,
  unwrapProofpointIsolation,
  unwrapProofpointV1,
  unwrapProofpointV2,
  unwrapProofpointV3,
  unwrapSophos,
  unwrapSymantecClicktime,
  unwrapTitanhqLinklock,
  unwrapTopsec,
  unwrapTrendMicro,
  unwrapTrustwaveScanmail,
  unwrapVadeSecure,
  unwrapZix,
  unwrapZscalerIsolation,
]

// Email and newsletter click trackers: unwrapping removes the sender's click stats.
export const emailTrackingUnwrappers: Array<UrlUnwrapper> = [
  unwrapAceml,
  unwrapAmazonSes,
  unwrapAugure,
  unwrapBananatag,
  unwrapBuzzstream,
  unwrapClevercomm,
  unwrapCloudhq,
  unwrapConstantContact,
  unwrapContactMonkey,
  unwrapCse360,
  unwrapDeployer,
  unwrapDirectMail,
  unwrapDyn,
  unwrapElasticEmail,
  unwrapFanbridge,
  unwrapGlueUp,
  unwrapGroupMail,
  unwrapHellohq,
  unwrapHubspotSidekick,
  unwrapIcptrack,
  unwrapIgafnl,
  unwrapIntranetQuorum,
  unwrapLeverAnalytics,
  unwrapLocaweb,
  unwrapMagnetmail,
  unwrapMail2easy,
  unwrapMailchimp,
  unwrapMailpanion,
  unwrapMailpgn,
  unwrapMailstat,
  unwrapMailtrack,
  unwrapMandrill,
  unwrapMyNewsletterBuilder,
  unwrapNimble,
  unwrapPipedrive,
  unwrapPostmark,
  unwrapPrezly,
  unwrapPromoJukebox,
  unwrapReverbnation,
  unwrapSalesflare,
  unwrapSalesforceiq,
  unwrapSaleshandy,
  unwrapSalsa,
  unwrapSquarespaceEmail,
  unwrapStreak,
  unwrapStreamsend,
  unwrapSubstack,
  unwrapSymplicity,
  unwrapTwitterRedirect,
  unwrapUnisender,
  unwrapVocus,
  unwrapVuture,
  unwrapWordpressEmail,
  unwrapYamm,
  unwrapYourMembership,
]

// Affiliate links: unwrapping removes the publisher's commission.
export const affiliateUnwrappers: Array<UrlUnwrapper> = [
  unwrap2performant,
  unwrapA8Net,
  unwrapAccesstrade,
  unwrapAdcell,
  unwrapAdmitad,
  unwrapAdrecord,
  unwrapAdtraction,
  unwrapAffilae,
  unwrapAffiliateFuture,
  unwrapAffiliatesOne,
  unwrapAliexpress,
  unwrapAmazonAffiliate,
  unwrapAvantlink,
  unwrapAwin,
  unwrapBizrate,
  unwrapBolPartner,
  unwrapButton,
  unwrapBuyAt,
  unwrapBuybox,
  unwrapCake,
  unwrapCcbill,
  unwrapCjNetwork,
  unwrapCleverbridge,
  unwrapCommissionFactory,
  unwrapCommunicationads,
  unwrapConvertiser,
  unwrapCuelinks,
  unwrapDigidip,
  unwrapDigikala,
  unwrapDmmAffiliate,
  unwrapDognet,
  unwrapDuomai,
  unwrapEasyMarketing,
  unwrapEbayRover,
  unwrapEClick,
  unwrapEffiliation,
  unwrapEhub,
  unwrapEpn,
  unwrapExpediaAffiliate,
  unwrapFiverr,
  unwrapFlexoffers,
  unwrapGeoriot,
  unwrapGroupon,
  unwrapGurunavi,
  unwrapHasoffers,
  unwrapImpact,
  unwrapInsiderAffiliate,
  unwrapInvolveAsia,
  unwrapJustwatch,
  unwrapKlook,
  unwrapLazada,
  unwrapLinkA,
  unwrapLinkconnector,
  unwrapLinksynergy,
  unwrapLinktrust,
  unwrapLinkwise,
  unwrapLnkam,
  unwrapMoshimo,
  unwrapNarrativ,
  unwrapNcls,
  unwrapNetaffiliation,
  unwrapPartnerAds,
  unwrapPriceGrabber,
  unwrapQualityClick,
  // Rakuten Japan's own program, separate from the LinkSynergy network in unwrapLinksynergy.
  // Opt-in like the rest of the group: unwrapping drops the publisher's commission.
  unwrapRakutenAffiliate,
  unwrapRedirectingat,
  unwrapSalesdoubler,
  unwrapSbsAd,
  unwrapShareasale,
  unwrapShareit,
  unwrapSkimlinks,
  unwrapSlickdeals,
  unwrapSmartredirect,
  unwrapStay22,
  unwrapSurugaya,
  unwrapTargetCircle,
  unwrapToucharcade,
  unwrapTracdelight,
  unwrapTradedoubler,
  unwrapTradetracker,
  unwrapTravelpayouts,
  unwrapTrxHub,
  unwrapTwoCheckout,
  unwrapUinterbox,
  unwrapValuecommerce,
  unwrapViglink,
  unwrapWebgains,
  unwrapWordpressGo2,
  unwrapWorldNomads,
  unwrapZanox,
]

// Ad clicks and app attribution links: unwrapping removes the click attribution.
export const advertisingUnwrappers: Array<UrlUnwrapper> = [
  unwrapAdjust,
  unwrapAppsflyerOnelink,
  unwrapApptrkr,
  unwrapBingAds,
  unwrapBitrixBanner,
  unwrapChitika,
  unwrapDuckduckgoAds,
  unwrapEulerian,
  unwrapFederatedMedia,
  unwrapFirebaseDynamicLinks,
  unwrapGateSc,
  unwrapGoogleAds,
  unwrapRecruitics,
  unwrapReviveAdserver,
  unwrapSmartAdserver,
  unwrapTriplelift,
]

// Download and click measurement: unwrapping removes the count of whoever is measured.
export const downloadMeasurementUnwrappers: Array<UrlUnwrapper> = [
  unwrapAcast,
  unwrapAnchor,
  unwrapAwesound,
  unwrapBlubrry,
  unwrapChartable,
  unwrapDstats,
  unwrapFirstory,
  unwrapMagellan,
  unwrapMintDownloads,
  unwrapOp3,
  unwrapPodcorn,
  unwrapPodscribe,
  unwrapPodsights,
  unwrapPodtrac,
  unwrapVgWort,
]

// Archives, proxies and viewers: unwrapping returns the live page, not the copy.
export const archiveProxyUnwrappers: Array<UrlUnwrapper> = [
  unwrap12ft,
  unwrapAnonymouse,
  unwrapArchiveToday, // Snapshot of a page at a point in time, not a redirect
  unwrapArquivo,
  unwrapBacLacWebArchive,
  unwrapEmbedly,
  unwrapExciteTranslate,
  unwrapGoogleTranslate,
  unwrapGoogleWebLight,
  unwrapLocWebArchive,
  unwrapMegalodon,
  unwrapNatlibNz,
  unwrapNdlWarp,
  unwrapNlaWebarchive,
  unwrapPagefreezer,
  unwrapSmry,
  unwrapTelegramIv,
  unwrapUkgwa,
  unwrapUkWebArchive,
  unwrapUnescoWebArchive,
  unwrapUnhcrWebArchive,
  unwrapVefsafn,
  unwrapWebArchive,
  unwrapWebcitation,
  unwrapWebharvest,
  unwrapWikiwix,
  unwrapWikizero,
  unwrapYandexTranslate,
  unwrapYandexTurbo,
]

export const defaultUnwrappers: Array<UrlUnwrapper> = [
  ...searchClickUnwrappers,
  ...linkShimUnwrappers,
  ...pressReleaseUnwrappers,
]
