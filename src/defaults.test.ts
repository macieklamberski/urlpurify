import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { Glob } from 'bun'
import * as urlpurifier from './index.js'
import type { UrlUnwrapper } from './types.js'

const exportEntries: Array<[string, unknown]> = Object.entries(urlpurifier)

const exportedUnwrappers = exportEntries.filter(([name]) => {
  return name.startsWith('unwrap') && name !== 'unwrapUrl'
})

const getNames = (unwrappers: ReadonlyArray<unknown>): Array<string> => {
  return exportedUnwrappers
    .filter(([, unwrapper]) => unwrappers.includes(unwrapper))
    .map(([name]) => name)
}

const categories = [
  urlpurifier.searchClickUnwrappers,
  urlpurifier.linkShimUnwrappers,
  urlpurifier.pressReleaseUnwrappers,
  urlpurifier.signInShimUnwrappers,
  urlpurifier.securityGatewayUnwrappers,
  urlpurifier.emailTrackingUnwrappers,
  urlpurifier.affiliateUnwrappers,
  urlpurifier.advertisingUnwrappers,
  urlpurifier.clickCounterUnwrappers,
  urlpurifier.downloadMeasurementUnwrappers,
  urlpurifier.archiveProxyUnwrappers,
  urlpurifier.imageProxyUnwrappers,
  urlpurifier.embedProxyUnwrappers,
  urlpurifier.embedApiUnwrappers,
  urlpurifier.shareIntentUnwrappers,
  urlpurifier.subscribeIntentUnwrappers,
  urlpurifier.feedToolUnwrappers,
  urlpurifier.genericCarrierUnwrappers,
]

// A share, subscribe or feed tool link opens a page that reads only the query.
const intentCategories = [
  urlpurifier.shareIntentUnwrappers,
  urlpurifier.subscribeIntentUnwrappers,
  urlpurifier.feedToolUnwrappers,
]

const fixtureUrlRegex = /https?:\/\/[^\s'"`<>\\]+/g

const readFixtureUrls = (): Array<string> => {
  const urls: Array<string> = []
  const testFiles = new Glob('unwraps/*.test.ts').scanSync({
    cwd: import.meta.dirname,
    absolute: true,
  })

  for (const file of testFiles) {
    for (const [href] of readFileSync(file, 'utf8').matchAll(fixtureUrlRegex)) {
      if (href.includes('#') || href.includes('${') || !URL.canParse(href)) {
        continue
      }

      urls.push(href)
    }
  }

  return [...new Set(urls)]
}

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
      'unwrapUcoz',
      'unwrapVanilla',
      'unwrapVbulletin',
      'unwrapVirgool',
      'unwrapVisibli',
      'unwrapVkAway',
      'unwrapWikidot',
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

    expect(getNames(urlpurifier.defaultUnwrappers)).toEqual(expected)
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

describe('redirect and proxy unwrappers', () => {
  it('should still unwrap a fixture url with a fragment appended', () => {
    const redirectCategories = categories.filter((category) => {
      return !intentCategories.includes(category)
    })
    const redirectUnwrappers: Array<[string, UrlUnwrapper]> = []

    for (const [name, unwrapper] of exportedUnwrappers) {
      const entry = redirectCategories.flat().find((candidate) => candidate === unwrapper)

      if (entry) {
        redirectUnwrappers.push([name, entry])
      }
    }

    const stopped: Array<string> = []

    for (const href of readFixtureUrls()) {
      for (const [name, unwrap] of redirectUnwrappers) {
        if (unwrap(new URL(href)) && !unwrap(new URL(`${href}#x`))) {
          stopped.push(`${name} ${href}`)
        }
      }
    }

    const expected: Array<string> = []

    expect(stopped).toEqual(expected)
  })
})

describe('trackingParamsLiterals', () => {
  it('should include names from the opt-in categories', () => {
    expect(urlpurifier.trackingParamsLiterals).toContain('utm_source')
  })
  it('should leave out a name only an entry holds', () => {
    expect(urlpurifier.trackingParamsLiterals).not.toContain('sid')
  })

  it('should leave out the self-referral ref', () => {
    expect(urlpurifier.trackingParamsLiterals).not.toContain('ref')
  })
})

describe('trackingParamsPatterns', () => {
  it('should hold only regexes', () => {
    const isEveryRegex = urlpurifier.trackingParamsPatterns.every((pattern) => {
      return pattern instanceof RegExp
    })

    expect(isEveryRegex).toBe(true)
  })
})
