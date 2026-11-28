import { describe, expect, it } from 'bun:test'
import {
  knownTrackingParamLiterals,
  knownTrackingParamPatterns,
  sessionIdParams,
} from './defaults.js'
import * as deprecated from './deprecated.js'
import { unwrapBsky } from './unwraps/bsky.js'
import { unwrapFacebook } from './unwraps/facebook.js'
import { unwrapInstagram } from './unwraps/instagram.js'
import { unwrapThreads } from './unwraps/threads.js'
import { unwrapYoutube } from './unwraps/youtube.js'

const newNames: Record<string, unknown> = {
  trackingParamsLiterals: knownTrackingParamLiterals,
  trackingParamsPatterns: knownTrackingParamPatterns,
  sessionParams: sessionIdParams,
  unwrapBlueskyRedirect: unwrapBsky,
  unwrapFacebookShim: unwrapFacebook,
  unwrapInstagramShim: unwrapInstagram,
  unwrapThreadsShim: unwrapThreads,
  unwrapYouTube: unwrapYoutube,
}

const deprecatedEntries: Array<[string, unknown]> = Object.entries(deprecated)

describe('deprecated', () => {
  it.each(deprecatedEntries)('should keep %s equal to its new name', (name, alias) => {
    const expected = newNames[name]

    expect(alias).toBe(expected)
  })
})
