import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from './types.js'
import { createUnwrapper, decodeEncodedScheme, type UnwrapperOptions } from './utils.js'

export type PathUnwrapperConfig = UnwrapperOptions & {
  prefix: RegExp
  scheme?: 'https' | 'http' | 'link' // What a target without a scheme forwards to, https by default
}

const leadingSlashesRegex = /^\/+/
const schemeRegex = /^https?:/i
const encodedSchemeRegex = /^https?(?:%(?:25)?3A|:%(?:25)?2F)/i

// A path target whose scheme is percent-encoded, once or twice, as in `https%3A%2F%2F`,
// `https:%2F%2F` or `https%253A%252F%252F`, decoded. Any other target is returned as written.
export const decodePathTarget = (target: string): string => {
  if (!encodedSchemeRegex.test(target)) {
    return target
  }

  return decodeEncodedScheme(decodePercent(target))
}

// The target that follows a prefix at the start of the path, decoded by `decodePathTarget`, with
// the url's own query when written raw: an encoded target holds its own query. The link's fragment
// is the factory's, per `createUnwrapper`. Podcast analytics prefixes mostly drop the target's
// scheme and forward to https. A prefix that forwards with its own scheme passes `url.protocol`,
// and one that forwards to http passes `http:`. A prefix that drops the url's query on forwarding
// passes an empty `suffix`.
export const getPathTarget = (
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

  const decoded = decodePathTarget(path)
  const target = decoded === path ? `${path}${suffix}` : decoded

  if (schemeRegex.test(target)) {
    return target
  }

  return `${scheme}//${target}`
}

// An unwrapper for a target glued into the path behind a prefix, read by `getPathTarget`. A `link`
// scheme forwards with the link's own.
export const createPathUnwrapper = (config: PathUnwrapperConfig): UrlUnwrapper => {
  const { prefix, scheme = 'https', ...options } = config

  return createUnwrapper({
    ...options,
    unwrap: (url) => {
      return getPathTarget(url, prefix, scheme === 'link' ? url.protocol : `${scheme}:`)
    },
  })
}
