import { describe, expect, it } from 'bun:test'
import { purifyUrl } from './clean.js'
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
import { createQueryUnwrapper } from './utils.js'

const newNames: Record<string, unknown> = {
  cleanUrl: purifyUrl,
  createParamExtractor: createQueryUnwrapper,
  trackingParamsLiterals: knownTrackingParamLiterals,
  trackingParamsPatterns: knownTrackingParamPatterns,
  sessionParams: sessionIdParams,
  unwrapBlueskyRedirect: unwrapBsky,
  unwrapFacebookShim: unwrapFacebook,
  unwrapInstagramShim: unwrapInstagram,
  unwrapThreadsShim: unwrapThreads,
  unwrapYouTube: unwrapYoutube,
}

const deprecatedExports: Record<string, unknown> = { ...deprecated }
const newNameEntries: Array<[string, unknown]> = Object.entries(newNames)
const deprecatedNames = Object.keys(deprecatedExports)

describe('deprecated', () => {
  it.each(newNameEntries)('should keep %s equal to its new name', (name, expected) => {
    expect(deprecatedExports[name]).toBe(expected)
  })

  it.each(deprecatedNames)('should list the new name of %s', (name) => {
    expect(newNames).toHaveProperty(name)
  })
})
