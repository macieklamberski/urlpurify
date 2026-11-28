// Names renamed before 4.0, kept as aliases until then.
import { purifyUrl } from './clean.js'
import {
  knownTrackingParamLiterals,
  knownTrackingParamPatterns,
  sessionIdParams,
} from './defaults.js'
import type { PurifyUrlOptions } from './types.js'
import { unwrapBsky } from './unwraps/bsky.js'
import { unwrapFacebook } from './unwraps/facebook.js'
import { unwrapInstagram } from './unwraps/instagram.js'
import { unwrapThreads } from './unwraps/threads.js'
import { unwrapYoutube } from './unwraps/youtube.js'
import type { QueryUnwrapperConfig } from './utils.js'
import { createQueryUnwrapper } from './utils.js'

/** @deprecated Use `purifyUrl` instead. */
export const cleanUrl = purifyUrl

/** @deprecated Use `PurifyUrlOptions` instead. */
export type CleanUrlOptions = PurifyUrlOptions

/** @deprecated Use `createQueryUnwrapper` instead. */
export const createParamExtractor = createQueryUnwrapper

/** @deprecated Use `QueryUnwrapperConfig` instead. */
export type ParamExtractorConfig = QueryUnwrapperConfig

/** @deprecated Use `knownTrackingParamLiterals` instead. */
export const trackingParamsLiterals = knownTrackingParamLiterals

/** @deprecated Use `knownTrackingParamPatterns` instead. */
export const trackingParamsPatterns = knownTrackingParamPatterns

/** @deprecated Use `sessionIdParams` instead. */
export const sessionParams = sessionIdParams

/** @deprecated Use `unwrapBsky` instead. */
export const unwrapBlueskyRedirect = unwrapBsky

/** @deprecated Use `unwrapFacebook` instead. */
export const unwrapFacebookShim = unwrapFacebook

/** @deprecated Use `unwrapInstagram` instead. */
export const unwrapInstagramShim = unwrapInstagram

/** @deprecated Use `unwrapThreads` instead. */
export const unwrapThreadsShim = unwrapThreads

/** @deprecated Use `unwrapYoutube` instead. */
export const unwrapYouTube = unwrapYoutube
