import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from './types.js'
import {
  createUnwrapper,
  decodeEncodedScheme,
  httpSchemeRegex,
  type UnwrapperBaseConfig,
} from './utils.js'

// What a target without a scheme forwards to: https, http or the link's own. Without a scheme
// given, `cleanUrl` gives it https.
type TargetScheme = 'https' | 'http' | 'inherit'

export type PathUnwrapperConfig = UnwrapperBaseConfig & {
  prefix: RegExp // Anchored with `^`, since the target is read from where its match ends
  scheme?: TargetScheme
}

const leadingSlashesRegex = /^\/+/
// An archived scheme never has a dot, so `www.example.com:80/` reads as a host with a port.
const archivedSchemeRegex = /^[a-z][a-z\d+-]*:/i
const encodedPathSchemeRegex = /^https?(?:%(?:25)?3A|:%(?:25)?2F)/i
const encodedSlashesRegex = /^https?(?:%(?:25)?3A|:)%(?:25)?2F/i

// A path target whose scheme and slashes are percent-encoded, once or twice, as in
// `https%3A%2F%2F`, `https:%2F%2F` or `https%253A%252F%252F`, so its own query is encoded inside
// it. A target with its colon alone encoded, `https%3A//`, keeps its query raw in the url's own.
export const isEncodedPathTarget = (target: string): boolean => {
  return encodedSlashesRegex.test(target)
}

// A path target whose scheme is percent-encoded, as `isEncodedPathTarget` reads it or with its
// colon alone encoded, decoded. Any other target is returned as written.
export const decodePathTarget = (target: string): string => {
  if (!encodedPathSchemeRegex.test(target)) {
    return target
  }

  return decodeEncodedScheme(decodePercent(target))
}

// A target written in the url's path, as a module's own regex captures it, decoded by
// `decodePathTarget`. A raw target takes the url's own query, since its query lands there. An
// encoded target holds its own query and ends where its encoding ends, so the url's query is the
// wrapper's. A target without an http scheme takes `scheme` when given, `inherit` being the
// link's own, and otherwise gets https from `cleanUrl`. A service that drops the url's query on
// forwarding passes an empty `suffix`. The link's fragment is the factory's, per `createUnwrapper`.
export const resolvePathTarget = (
  url: URL,
  target: string,
  scheme?: TargetScheme,
  suffix = url.search,
): string => {
  const decoded = decodePathTarget(target)
  const resolved = isEncodedPathTarget(target) ? decoded : `${decoded}${suffix}`

  if (!scheme || httpSchemeRegex.test(resolved)) {
    return resolved
  }

  const protocol = scheme === 'inherit' ? url.protocol : `${scheme}:`

  return `${protocol}//${resolved}`
}

// The target that follows a prefix at the start of the path, read by `resolvePathTarget`. Podcast
// analytics prefixes mostly drop the target's scheme and forward to https. A prefix that forwards
// with the link's own scheme passes `inherit`, and one that forwards to http passes `http`.
export const readPathTarget = (
  url: URL,
  prefix: RegExp,
  scheme?: TargetScheme,
  suffix = url.search,
): string | undefined => {
  const match = prefix.exec(url.pathname)

  if (!match) {
    return
  }

  // Some feeds leave an empty segment after the prefix, as in `redirect.mp3//<target>`.
  const target = url.pathname.slice(match[0].length).replace(leadingSlashesRegex, '')

  if (!target) {
    return
  }

  return resolvePathTarget(url, target, scheme, suffix)
}

// A target a Wayback-style replay archived with no scheme, which the replay forwards to its http
// snapshot.
export const addArchivedScheme = (target: string): string => {
  if (archivedSchemeRegex.test(target)) {
    return target
  }

  return `http://${target}`
}

// An unwrapper for a target glued into the path behind a prefix, read by `readPathTarget` with
// `scheme`.
export const createPathUnwrapper = (config: PathUnwrapperConfig): UrlUnwrapper => {
  const { prefix, scheme, ...options } = config

  return createUnwrapper({
    ...options,
    unwrap: (url) => {
      return readPathTarget(url, prefix, scheme)
    },
  })
}
