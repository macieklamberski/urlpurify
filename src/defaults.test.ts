import { describe, expect, it } from 'bun:test'
import * as urlpurify from './index.js'

const exportedUnwrappers: Array<[string, unknown]> = Object.entries(urlpurify).filter(([name]) => {
  return name.startsWith('unwrap') && name !== 'unwrapUrl'
})

const getNames = (unwrappers: Array<unknown>): Array<string> => {
  return exportedUnwrappers
    .filter(([, unwrapper]) => unwrappers.includes(unwrapper))
    .map(([name]) => name)
}

const categories = [
  urlpurify.searchClickUnwrappers,
  urlpurify.linkShimUnwrappers,
  urlpurify.pressReleaseUnwrappers,
  urlpurify.signInShimUnwrappers,
  urlpurify.securityGatewayUnwrappers,
  urlpurify.emailTrackingUnwrappers,
  urlpurify.affiliateUnwrappers,
  urlpurify.advertisingUnwrappers,
  urlpurify.clickCounterUnwrappers,
  urlpurify.downloadMeasurementUnwrappers,
  urlpurify.archiveProxyUnwrappers,
  urlpurify.imageProxyUnwrappers,
]

describe('defaultUnwrappers', () => {
  it('should hold exactly the default set', () => {
    const expected = [
      'unwrap4pda',
      'unwrapAboutCom',
      'unwrapAliyun',
      'unwrapAllblog',
      'unwrapAmpCache',
      'unwrapAnonymTo',
      'unwrapArxiv',
      'unwrapAsk',
      'unwrapBabyblog',
      'unwrapBale',
      'unwrapBing',
      'unwrapBlueskyRedirect',
      'unwrapBridgyFed',
      'unwrapBytedance',
      'unwrapCalendly',
      'unwrapCanva',
      'unwrapCsdn',
      'unwrapDatalifeEngine',
      'unwrapDerefMail',
      'unwrapDeviantartOutgoing',
      'unwrapDisqus',
      'unwrapDouban',
      'unwrapDropbox',
      'unwrapDuckduckgo',
      'unwrapDzen',
      'unwrapEmbedly',
      'unwrapEvernote',
      'unwrapFacebookShim',
      'unwrapFeedsportal',
      'unwrapFlipboard',
      'unwrapFtc',
      'unwrapGfnLinkProxy',
      'unwrapGitee',
      'unwrapGoogle',
      'unwrapGoogleAmpViewer',
      'unwrapGoogleNews',
      'unwrapGoogleNewsModern',
      'unwrapGoogleScholar',
      'unwrapHackerone',
      'unwrapHashnode',
      'unwrapHearthis',
      'unwrapHirkereso',
      'unwrapHorde',
      'unwrapHrefLi',
      'unwrapInfospace',
      'unwrapInstagramShim',
      'unwrapInvisionNoExternalLinks',
      'unwrapIrs',
      'unwrapJianshuGo',
      'unwrapJive',
      'unwrapJuejin',
      'unwrapLd246',
      'unwrapLinkedin',
      'unwrapLivejournal',
      'unwrapLogicboard',
      'unwrapMailRu',
      'unwrapMedium',
      'unwrapMintFeeder',
      'unwrapMozillaOutgoing',
      'unwrapNaverOutgoing',
      'unwrapNetcentrum',
      'unwrapNicoMs',
      'unwrapNodeseek',
      'unwrapOkRu',
      'unwrapOsnova',
      'unwrapPhilpapers',
      'unwrapPinterest',
      'unwrapPocket',
      'unwrapRamblerMail',
      'unwrapRedditOut',
      'unwrapRediffmail',
      'unwrapResearchgate',
      'unwrapSapHelp',
      'unwrapSegmentfault',
      'unwrapSkyrock',
      'unwrapSlack',
      'unwrapSoundcloud',
      'unwrapSspai',
      'unwrapSteamLinkfilter',
      'unwrapStorify',
      'unwrapStumbleupon',
      'unwrapTeacup',
      'unwrapThreadsShim',
      'unwrapTiktok',
      'unwrapTumblr',
      'unwrapTwitterRedirect',
      'unwrapVanilla',
      'unwrapVbulletin',
      'unwrapVirgool',
      'unwrapVisibli',
      'unwrapVkAway',
      'unwrapWpPoczta',
      'unwrapXengentr',
      'unwrapYahooJapan',
      'unwrapYahooJapanAmpViewer',
      'unwrapYahooSearch',
      'unwrapYandexMail',
      'unwrapYelp',
      'unwrapYouTube',
      'unwrapZemanta',
      'unwrapZhihu',
    ]

    expect(getNames(urlpurify.defaultUnwrappers)).toEqual(expected)
  })
})

describe('unwrapper categories', () => {
  it('should place every exported unwrapper in a category', () => {
    const placed: Array<unknown> = categories.flat()
    const unplaced = exportedUnwrappers.filter(([, unwrapper]) => !placed.includes(unwrapper))

    expect(unplaced.map(([name]) => name)).toEqual([])
  })

  it('should place no unwrapper in two categories', () => {
    const placed = categories.flat()

    expect(new Set(placed).size).toBe(placed.length)
  })
})

describe('trackingParamsLiterals', () => {
  it('should include names from the opt-in categories', () => {
    expect(urlpurify.trackingParamsLiterals).toContain('utm_source')
  })
})
