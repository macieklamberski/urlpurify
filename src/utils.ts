import {
  decodePercent,
  getQueryParamValues,
  isAnyOf,
  isHostOf,
  isHostOrSubdomainOf,
  isString,
  isSubdomainOf,
  type Pattern,
} from 'trousse'
import type { UrlUnwrapper } from './types.js'

// `domains` also matches every subdomain. `hosts` matches a host exactly, or by regex, for a domain
// where a third party can get a subdomain, such as a blog host.
export type QueryUnwrapperConfig = (
  | { domains: string | Array<string>; hosts?: never }
  | { hosts: string | Array<string> | RegExp; domains?: never }
) & {
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

const unencodedTargetRegex = /^https?:\/\//i

// A raw query param value decoded as `URLSearchParams` does, except that a malformed escape stays
// as written, and a `+` stays in an unencoded target, as in `wgtarget=https://example.com/a+b/`,
// which `URLSearchParams` reads as a space.
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

export type HostCheck = (url: URL, hosts: Pattern | ReadonlyArray<Pattern>) => boolean

// The hostnames a factory unwrapper can match, read by `applyUnwrappers` to skip it on any other
// host. A domain whose subdomains match registers as `.domain`. Only lowercase ascii hosts
// register: the index compares them as written, where `isHostOf` also folds case and punycode.
export const unwrapperHosts = new WeakMap<UrlUnwrapper, Array<string>>()

const plainHostRegex = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/

const subdomainChecks: Array<HostCheck> = [isHostOrSubdomainOf, isSubdomainOf]

const registerHosts = (
  unwrap: UrlUnwrapper,
  hosts: Pattern | ReadonlyArray<Pattern>,
  isOnHost: HostCheck,
): void => {
  const list = isString(hosts) ? [hosts] : hosts

  if (!Array.isArray(list) || !list.every((host) => isString(host) && plainHostRegex.test(host))) {
    return
  }

  if (isOnHost === isHostOf) {
    unwrapperHosts.set(unwrap, list)
    return
  }

  if (subdomainChecks.includes(isOnHost)) {
    unwrapperHosts.set(
      unwrap,
      list.map((host) => `.${host}`),
    )
  }
}

// An unwrapper that runs `unwrapTarget` only on a url `isOnHost` places on `hosts`, where
// `isOnHost` is trousse's `isHostOf`, `isHostOrSubdomainOf` or `isSubdomainOf`.
export const createUnwrapper = (
  hosts: Pattern | ReadonlyArray<Pattern>,
  isOnHost: HostCheck,
  unwrapTarget: UrlUnwrapper,
): UrlUnwrapper => {
  const unwrap: UrlUnwrapper = (url) => {
    if (!isOnHost(url, hosts)) {
      return
    }

    return unwrapTarget(url)
  }

  registerHosts(unwrap, hosts, isOnHost)

  return unwrap
}

export const createQueryUnwrapper = (config: QueryUnwrapperConfig): UrlUnwrapper => {
  const isHostMatch = (url: URL): boolean => {
    if (config.domains !== undefined) {
      return isHostOrSubdomainOf(url, config.domains)
    }

    return isHostOf(url, config.hosts)
  }

  const unwrap: UrlUnwrapper = (url) => {
    if (!isHostMatch(url)) {
      return
    }

    if (config.path && !isAnyOf(url.pathname, config.path)) {
      return
    }

    for (const param of config.params) {
      const target = readParamTarget(url, param)

      if (!target) {
        continue
      }

      if (config.ignoreLinkFragment) {
        return target
      }

      return appendLinkFragment(target, url)
    }
  }

  if (config.hosts !== undefined) {
    registerHosts(unwrap, config.hosts, isHostOf)
  }

  return unwrap
}

/** @deprecated Use `QueryUnwrapperConfig` instead. */
export type ParamExtractorConfig = QueryUnwrapperConfig

/** @deprecated Use `createQueryUnwrapper` instead. */
export const createParamExtractor = createQueryUnwrapper

const utf8Encoder = new TextEncoder()

export const getUtf8ByteLength = (value: string): number => {
  return utf8Encoder.encode(value).length
}
