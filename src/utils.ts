import {
  decodeBase64,
  decodePercent,
  getQueryParamValues,
  isAnyOf,
  isHostOf,
  isHostOrSubdomainOf,
  isHttpUrl,
  isString,
  isSubdomainOf,
  type Pattern,
} from 'trousse'
import type { UrlUnwrapper } from './types.js'

type HostList = Pattern | ReadonlyArray<Pattern>

// `hosts` matches a host exactly, or by regex. `domains` also matches every subdomain, and
// `subdomains` matches only the subdomains, never the domain itself.
export type UnwrapperHosts =
  | { hosts: HostList; domains?: never; subdomains?: never }
  | { domains: HostList; hosts?: never; subdomains?: never }
  | { subdomains: HostList; hosts?: never; domains?: never }

export type UnwrapperConfig = UnwrapperHosts & {
  unwrap: UrlUnwrapper
}

export type QueryUnwrapperConfig = UnwrapperHosts & {
  path?: string
  params: Array<string>
  ignoreLinkFragment?: boolean // The link opens a page, not a redirect, per `readParamTarget`
}

const encodedSchemeRegex = /^https?%3A/i

// A value already decoded once still holds an encoded scheme (`https%3A%2F%2F`) when the
// carrier encoded its target twice.
export const decodeEncodedScheme = (value: string): string => {
  if (!encodedSchemeRegex.test(value)) {
    return value
  }

  return decodePercent(value)
}

const unencodedTargetRegex = /^(?:https?:\/|\/\/|[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+(?::\d+)?\/)/iu

// A raw query param value decoded as `URLSearchParams` does, except that a malformed escape stays
// as written, and a `+` stays in an unencoded target, as in `wgtarget=https://example.com/a+b/`,
// which `URLSearchParams` reads as a space. Form encoding escapes `/`, so a target whose scheme,
// `//` or host is followed by a raw `/` was not form-encoded.
export const decodeParamValue = (raw: string): string => {
  if (!unencodedTargetRegex.test(raw)) {
    return decodePercent(raw.replaceAll('+', ' '))
  }

  return decodePercent(raw)
}

// Every value of a query param, in order, its name in any case, decoded by `decodeParamValue`.
export const getParamValues = (url: URL, name: string): Array<string> => {
  const raws = getQueryParamValues(url, name, { decodeValues: false, preserveEmptyValues: true })

  return raws.map(decodeParamValue)
}

// A redirect whose `Location` has no fragment lands on the link's own, so a target without one
// takes the link's. An escaped target's own `%23` fragment wins.
export const appendLinkFragment = (target: string, url: URL): string => {
  if (target.includes('#')) {
    return target
  }

  return `${target}${url.hash}`
}

// The target a carrier param holds, read as `getParamValues` reads it and decoded once more when
// encoded twice: the first value, or the one at `index`, such as -1 for the last. For a link that
// opens a page, such as a share intent or an archive's own view: the page reads the carrier from
// the query, so the link's fragment stays on that page.
export const readParamTarget = (url: URL, name: string, index = 0): string | undefined => {
  const value = getParamValues(url, name).at(index)

  if (!value) {
    return
  }

  return decodeEncodedScheme(value)
}

// The target a redirect's carrier param holds, read by `readParamTarget`, with the link's fragment
// per `appendLinkFragment`.
export const getParamTarget = (url: URL, name: string, index = 0): string | undefined => {
  const target = readParamTarget(url, name, index)

  if (!target) {
    return
  }

  return appendLinkFragment(target, url)
}

export type Base64Decoder = (value: string) => string | undefined

// The http target a carrier param holds in base64, read raw by `readParamTarget`, decoded by
// `decode`, with the link's fragment per `appendLinkFragment`.
export const getBase64Target = (
  url: URL,
  name: string,
  decode: Base64Decoder = decodeBase64,
): string | undefined => {
  const value = readParamTarget(url, name)

  if (!value) {
    return
  }

  const target = decode(value)

  if (!target || !isHttpUrl(target)) {
    return
  }

  return appendLinkFragment(target, url)
}

const lastSchemeRegex = /^.*https?(?::|%3a)./i

// The `source` group of a path regex whose lazy `.*?` searches for a source scheme after a prefix.
// Matching only up to the last scheme keeps one ahead of every prefix the regex tries, so it never
// rescans the rest of the path per prefix, which is quadratic on a path with no source.
export const matchPathSource = (path: string, regex: RegExp): string | undefined => {
  const head = lastSchemeRegex.exec(path)?.[0]

  if (!head) {
    return
  }

  const source = regex.exec(head)?.groups?.source

  if (!source) {
    return
  }

  return `${source}${path.slice(head.length)}`
}

// The hostnames a factory unwrapper can match, read by `applyUnwrappers` to skip it on any other
// host. A domain whose subdomains match registers as `.domain`. Only lowercase ascii hosts
// register: the index compares them as written, where `isHostOf` also folds case and punycode.
export const unwrapperHosts = new WeakMap<UrlUnwrapper, Array<string>>()

const plainHostRegex = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/

// Registers `hosts` when every one is a plain host, each behind `prefix`.
const registerHosts = (unwrap: UrlUnwrapper, hosts: HostList, prefix = ''): void => {
  const list = isString(hosts) ? [hosts] : hosts

  if (!Array.isArray(list) || !list.every((host) => isString(host) && plainHostRegex.test(host))) {
    return
  }

  unwrapperHosts.set(
    unwrap,
    list.map((host) => `${prefix}${host}`),
  )
}

// An unwrapper that runs `unwrap` only on a url on `hosts`, matched exactly or by regex, on
// `domains` or any of their subdomains, or only on `subdomains` of the domains given.
export const createUnwrapper = (config: UnwrapperConfig): UrlUnwrapper => {
  const isOnHost = (url: URL): boolean => {
    if (config.domains !== undefined) {
      return isHostOrSubdomainOf(url, config.domains)
    }

    if (config.subdomains !== undefined) {
      return isSubdomainOf(url, config.subdomains)
    }

    return isHostOf(url, config.hosts)
  }

  const unwrap: UrlUnwrapper = (url) => {
    if (!isOnHost(url)) {
      return
    }

    return config.unwrap(url)
  }

  if (config.hosts !== undefined) {
    registerHosts(unwrap, config.hosts)
  }

  if (config.domains !== undefined) {
    registerHosts(unwrap, config.domains, '.')
  }

  if (config.subdomains !== undefined) {
    registerHosts(unwrap, config.subdomains, '.')
  }

  return unwrap
}

// An unwrapper for a target in the first of `params` that holds one, on a url on the hosts
// `createUnwrapper` takes, and on `path` when given.
export const createQueryUnwrapper = (config: QueryUnwrapperConfig): UrlUnwrapper => {
  const { path, params, ignoreLinkFragment, ...hosts } = config

  return createUnwrapper({
    ...hosts,
    unwrap: (url) => {
      if (path && !isAnyOf(url.pathname, path)) {
        return
      }

      for (const param of params) {
        const target = readParamTarget(url, param)

        if (!target) {
          continue
        }

        if (ignoreLinkFragment) {
          return target
        }

        return appendLinkFragment(target, url)
      }
    },
  })
}

/** @deprecated Use `QueryUnwrapperConfig` instead. */
export type ParamExtractorConfig = QueryUnwrapperConfig

/** @deprecated Use `createQueryUnwrapper` instead. */
export const createParamExtractor = createQueryUnwrapper

const utf8Encoder = new TextEncoder()

export const getUtf8ByteLength = (value: string): number => {
  return utf8Encoder.encode(value).length
}
