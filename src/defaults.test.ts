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
  // The glob yields files in filesystem order, which differs between machines.
  const testFiles = [
    ...new Glob('unwraps/*.test.ts').scanSync({ cwd: import.meta.dirname, absolute: true }),
  ].sort((a, b) => a.localeCompare(b))

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

// A link whose fragment the wrapper's own page reads, or an image, where a fragment means nothing.
const fragmentOwners: Array<unknown> = [
  ...urlpurifier.imageProxyUnwrappers,
  urlpurifier.unwrapAmpCache, // The /v/ viewer's init params
  urlpurifier.unwrapGoogleAmpViewer,
  urlpurifier.unwrapWikiwix, // #federation=
  urlpurifier.unwrapYahooJapanAmpViewer,
]

describe('redirect and proxy unwrappers', () => {
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

  it('should still unwrap a fixture url with a fragment appended', () => {
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

  it('should keep the fragment appended to a fixture url', () => {
    const dropped: Array<string> = []

    for (const href of readFixtureUrls()) {
      if (href.includes('#')) {
        continue
      }

      for (const [name, unwrap] of redirectUnwrappers) {
        if (fragmentOwners.includes(unwrap)) {
          continue
        }

        const plain = unwrap(new URL(href))
        const target = unwrap(new URL(`${href}#x`))

        if (!plain || !target) {
          continue
        }

        // A fragment the target carries itself wins over the link's.
        if (target !== (plain.includes('#') ? plain : `${plain}#x`)) {
          dropped.push(`${name} ${href}`)
        }
      }
    }

    const expected = [
      // An escaped %23 in the target and the link's fragment both stay.
      'unwrapArchiveToday https://archive.is/o/NTGoD/https://www.example.com/standard%23:~:text=Congress',
      'unwrapArchiveToday https://archive.is/20121211084659/http://www.example.com/search%3Fq=a%3Fb%23top%23x',
      // The link's fragment replaces the anchor CJ's fragment/<x>/ segment sets.
      'unwrapCjNetwork http://www.anrdoezrs.net/links/8919635/type/dlg/fragment/REVIEWS/https://www.example.com/Hotel_Review-g499380',
      'unwrapCjNetwork https://www.anrdoezrs.net/links/8946794/type/dlg/sid/UUwpUdUnU57440/fragment/internal%3D1/https://www.example.com/search/',
      'unwrapCjNetwork https://www.anrdoezrs.net/links/7768368/type/dlg/fragment/q%3Dsleepy%252Bcrib%26lang%3Den_US%26start%3D1/https://www.example.com/nursery/1043.html?dwvar_1043_color=100',
      'unwrapCjNetwork https://www.anrdoezrs.net/links/7768368/type/dlg/fragment/sale-50%-off/https://www.example.com/nursery/1043.html',
    ]

    expect(dropped).toEqual(expected)
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

describe('exported lists', () => {
  const exportedLists = Object.fromEntries(
    exportEntries.filter(([, value]) => Array.isArray(value)),
  )

  it.each(Object.keys(exportedLists))('should throw when %s is mutated', (name) => {
    const throwing = () => (exportedLists[name] as Array<unknown>).push('session_token')

    expect(throwing).toThrow(TypeError)
  })
})
