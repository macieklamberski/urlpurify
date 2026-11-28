import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from './types.js'
import {
  createUnwrapper,
  decodeEncodedScheme,
  httpSchemeRegex,
  type UnwrapperOptions,
} from './utils.js'

export type PathUnwrapperConfig = UnwrapperOptions & {
  prefix: RegExp
  scheme?: 'https' | 'http' | 'link' // What a target without a scheme forwards to, https by default
}

const leadingSlashesRegex = /^\/+/
const encodedSchemeRegex = /^https?(?:%(?:25)?3A|:%(?:25)?2F)/i

// A path target whose scheme is percent-encoded, once or twice, as in `https%3A%2F%2F`,
// `https:%2F%2F` or `https%253A%252F%252F`.
export const isEncodedPathTarget = (target: string): boolean => {
  return encodedSchemeRegex.test(target)
}

// A path target encoded by `isEncodedPathTarget`, decoded. Any other target is returned as written.
export const decodePathTarget = (target: string): string => {
  if (!isEncodedPathTarget(target)) {
    return target
  }

  return decodeEncodedScheme(decodePercent(target))
}

// A target written in the url's path, as a module's own regex captures it, decoded by
// `decodePathTarget`. A raw target takes the url's own query, since its query lands there. An
// encoded target holds its own query and ends where its encoding ends, so the url's query is the
// wrapper's. A target without an http scheme takes `scheme` when given. A service that drops the
// url's query on forwarding passes an empty `suffix`. The link's fragment is the factory's, per
// `createUnwrapper`.
export const resolvePathTarget = (
  url: URL,
  path: string,
  scheme?: string,
  suffix = url.search,
): string => {
  const decoded = decodePathTarget(path)
  const target = decoded === path ? `${path}${suffix}` : decoded

  if (!scheme || httpSchemeRegex.test(target)) {
    return target
  }

  return `${scheme}//${target}`
}

// The target that follows a prefix at the start of the path, read by `resolvePathTarget`. Podcast
// analytics prefixes mostly drop the target's scheme and forward to https. A prefix that forwards
// with its own scheme passes `url.protocol`, and one that forwards to http passes `http:`.
export const readPathTarget = (
  url: URL,
  prefixRegex: RegExp,
  scheme = 'https:',
  suffix = url.search,
): string | undefined => {
  const match = url.pathname.match(prefixRegex)

  if (!match) {
    return
  }

  // Some feeds leave an empty segment after the prefix, as in `redirect.mp3//<target>`.
  const path = url.pathname.slice(match[0].length).replace(leadingSlashesRegex, '')

  if (!path) {
    return
  }

  return resolvePathTarget(url, path, scheme, suffix)
}

// An unwrapper for a target glued into the path behind a prefix, read by `readPathTarget`. A `link`
// scheme forwards with the link's own.
export const createPathUnwrapper = (config: PathUnwrapperConfig): UrlUnwrapper => {
  const { prefix, scheme = 'https', ...options } = config

  return createUnwrapper({
    ...options,
    unwrap: (url) => {
      return readPathTarget(url, prefix, scheme === 'link' ? url.protocol : `${scheme}:`)
    },
  })
}
