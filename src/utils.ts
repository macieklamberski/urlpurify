import {
  decodePercent,
  getQueryParamValues,
  isAnyOf,
  isHostOf,
  isHostOrSubdomainOf,
  isString,
  isSubdomainOf,
  type Pattern,
  resolveUrl,
} from 'trousse'
import type { UrlUnwrapper } from './types.js'

type HostList = Pattern | ReadonlyArray<Pattern>

// `hosts` matches a host exactly, or by regex. `domains` also matches every subdomain, and
// `subdomains` matches only the subdomains, never the domain itself. `brands` matches a brand on
// any tld, as `getBrandLabels` reads it, and with any of the other three also those.
export type UnwrapperHosts =
  | { hosts: HostList; domains?: never; subdomains?: never; brands?: never }
  | { domains: HostList; hosts?: never; subdomains?: never; brands?: never }
  | { subdomains: HostList; hosts?: never; domains?: never; brands?: never }
  | { brands: ReadonlyArray<string>; hosts?: HostList; domains?: HostList; subdomains?: HostList }

export type UnwrapperOptions = UnwrapperHosts & {
  match?: RegExp // Narrows the hosts above to those it matches, while the hosts feed the host index
  ignoreLinkFragment?: boolean // The link opens a page, or the page reads the fragment itself
}

export type UnwrapperConfig = UnwrapperOptions & {
  unwrap: UrlUnwrapper
}

// `decode` reads the raw value with its `+` kept, so `plus` is read only without it.
export type QueryUnwrapperConfig = UnwrapperOptions &
  (
    | { decode: TargetDecoder; plus?: never } // The carrier holds the target encoded, as in base64
    | { plus?: PlusReading; decode?: never } // How the service reads a raw `+` in the target
  ) & {
    path?: string | RegExp | ReadonlyArray<string>
    params: ReadonlyArray<string>
    index?: number // The value of a repeated param to read, such as -1 for the last
  }

export const httpSchemeRegex = /^https?:/i
const encodedSchemeRegex = /^https?(?:%3A|:%2F)/i

// A value already decoded once still holds an encoded scheme (`https%3A%2F%2F`, or `https:%2F%2F`
// with its colon left raw) when the carrier encoded its target twice.
export const decodeEncodedScheme = (value: string): string => {
  if (!encodedSchemeRegex.test(value)) {
    return value
  }

  return decodePercent(value)
}

const unencodedTargetRegex = /^(?:https?:\/|\/\/|[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+(?::\d+)?\/)/iu

// A raw `+` read as a space, or kept as a `+`, where a service reads it one way whatever the value.
export type PlusReading = 'space' | 'keep'

// A raw query param value decoded as `URLSearchParams` does, except that a malformed escape stays
// as written, and a `+` stays in an unencoded target, as in `wgtarget=https://example.com/a+b/`,
// which `URLSearchParams` reads as a space. Form encoding escapes `/`, so a target whose scheme,
// `//` or host is followed by a raw `/` was not form-encoded. `plus` overrides that guess.
export const decodeParamValue = (raw: string, plus?: PlusReading): string => {
  const isSpace = plus ? plus === 'space' : !unencodedTargetRegex.test(raw)

  if (isSpace) {
    return decodePercent(raw.replaceAll('+', ' '))
  }

  return decodePercent(raw)
}

// Every value of a query param, in order, its name in any case, decoded by `decodeParamValue`.
export const getParamValues = (url: URL, name: string, plus?: PlusReading): Array<string> => {
  const raws = getQueryParamValues(url, name, { decodeValues: false, preserveEmptyValues: true })

  return raws.map((raw) => decodeParamValue(raw, plus))
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
// the query, so the link's fragment stays on that page. `plus` reads a raw `+` as
// `decodeParamValue` does.
export const readParamTarget = (
  url: URL,
  name: string,
  index = 0,
  plus?: PlusReading,
): string | undefined => {
  const value = getParamValues(url, name, plus).at(index)

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

export type TargetDecoder = (value: string) => string | undefined

// The target a carrier param holds encoded, such as in base64: the first value, or the one at
// `index`, decoded by `decode`, and decoded once more when it still holds an encoded scheme. The
// value is read as `getParamValues` reads it with a `+` kept, so a raw `+` of the base64 alphabet
// stays a `+`, where form decoding reads it as a space that `atob` drops.
export const readDecodedTarget = (
  url: URL,
  name: string,
  decode: TargetDecoder,
  index = 0,
): string | undefined => {
  const value = getParamValues(url, name, 'keep').at(index)

  if (!value) {
    return
  }

  const target = decode(value)

  if (!target) {
    return
  }

  return decodeEncodedScheme(target)
}

// The target a carrier param holds encoded, read by `readDecodedTarget`, with the link's fragment
// per `appendLinkFragment`.
export const getDecodedParamTarget = (
  url: URL,
  name: string,
  decode: TargetDecoder,
): string | undefined => {
  const target = readDecodedTarget(url, name, decode)

  if (!target) {
    return
  }

  return appendLinkFragment(target, url)
}

const lastSchemeRegex = /^.*https?(?::|%3a)./i

// The `source` group of a path regex whose lazy `.*?` searches for a source scheme after a prefix.
// Matching only up to the last scheme keeps one ahead of every prefix the regex tries, so it never
// rescans the rest of the path per prefix, which is quadratic on a path with no source. A regex
// that reads another scheme spelling passes a `headRegex` ending on that same spelling.
export const matchPathSource = (
  path: string,
  regex: RegExp,
  headRegex = lastSchemeRegex,
): string | undefined => {
  const head = headRegex.exec(path)?.[0]

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
// host. A domain whose subdomains match registers as `.domain`, a brand as `brand.*`. Only
// lowercase ascii hosts register: the index compares them as written, where `isHostOf` also folds
// case and punycode.
export const unwrapperHosts = new WeakMap<UrlUnwrapper, Array<string>>()

const plainHostRegex = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/
const plainLabelRegex = /^[a-z0-9-]+$/

// The labels a brand can take in `host`: the one before a tld of one or two labels, so both
// `google` in `www.google.co.uk` and `google` in `google.com`, or the host itself when it has one
// label. Every registrable domain trousse's `isBrandDomainOf` reads ends in one of them. A trailing
// dot is dropped, as the index drops it.
export const getBrandLabels = (hostname: string): Array<string> => {
  const host = hostname.endsWith('.') ? hostname.slice(0, -1) : hostname
  const last = host.lastIndexOf('.')

  if (last === -1) {
    return [host]
  }

  const second = host.lastIndexOf('.', last - 1)

  if (second === -1) {
    return [host.slice(0, last)]
  }

  const third = host.lastIndexOf('.', second - 1)

  return [host.slice(second + 1, last), host.slice(third + 1, second)]
}

// The index keys for `hosts` when every one passes `regex`, each wrapped as `format` writes it. An
// empty list when none are given, and undefined when one cannot register.
const getHostKeys = (
  hosts: HostList | undefined,
  regex: RegExp,
  format: (host: string) => string,
): Array<string> | undefined => {
  if (hosts === undefined) {
    return []
  }

  const list = isString(hosts) ? [hosts] : hosts

  if (!Array.isArray(list) || !list.every((host) => isString(host) && regex.test(host))) {
    return
  }

  return list.map(format)
}

// Registers every host form `config` gives, or none when one of them cannot register, so the
// index never skips the unwrapper on a host it matches.
const registerHosts = (unwrap: UrlUnwrapper, config: UnwrapperHosts): void => {
  const keys: Array<string> = []
  const forms = [
    getHostKeys(config.hosts, plainHostRegex, (host) => host),
    getHostKeys(config.domains, plainHostRegex, (host) => `.${host}`),
    getHostKeys(config.subdomains, plainHostRegex, (host) => `.${host}`),
    getHostKeys(config.brands, plainLabelRegex, (brand) => `${brand}.*`),
  ]

  for (const form of forms) {
    if (!form) {
      return
    }

    keys.push(...form)
  }

  unwrapperHosts.set(unwrap, keys)
}

// An unwrapper that runs `unwrap` only on a url on `hosts`, matched exactly or by regex, on
// `domains` or any of their subdomains, or only on `subdomains` of the domains given, and on a
// host `match` matches when given. The target
// takes the link's fragment per `appendLinkFragment`, unless `ignoreLinkFragment` is set.
export const createUnwrapper = (config: UnwrapperConfig): UrlUnwrapper => {
  const isOnHost = (url: URL): boolean => {
    if (config.match && !isHostOf(url, config.match)) {
      return false
    }

    if (config.brands !== undefined) {
      if (getBrandLabels(url.hostname).some((label) => isAnyOf(label, config.brands))) {
        return true
      }

      if (config.domains !== undefined && isHostOrSubdomainOf(url, config.domains)) {
        return true
      }

      if (config.subdomains !== undefined && isSubdomainOf(url, config.subdomains)) {
        return true
      }

      return config.hosts !== undefined && isHostOf(url, config.hosts)
    }

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

    const target = config.unwrap(url)

    if (!target || config.ignoreLinkFragment) {
      return target
    }

    return appendLinkFragment(target, url)
  }

  registerHosts(unwrap, config)

  return unwrap
}

const schemeRegex = /^[a-z][a-z\d+.-]*:/i

// A target in a scheme `cleanUrl` cannot read as http, such as an app's own `myapp://open`. A
// host with a port, `example.com:8080/`, reads as http.
const hasOtherScheme = (target: string): boolean => {
  if (!schemeRegex.test(target) || httpSchemeRegex.test(target)) {
    return false
  }

  return !resolveUrl(target)
}

// An unwrapper for a target in the first of `params` that holds one in http or with no scheme, on
// a url on the hosts `createUnwrapper` takes, and on `path` when given: an exact path or a list,
// compared in any case, or a regex. `index` and `decode` read the target as `readDecodedTarget`
// does, and `plus` as `readParamTarget` does.
export const createQueryUnwrapper = (config: QueryUnwrapperConfig): UrlUnwrapper => {
  const { path, params, index, decode, plus, ...options } = config

  const isOnPath = (url: URL): boolean => {
    if (!path) {
      return true
    }

    if (path instanceof RegExp) {
      return path.test(url.pathname)
    }

    return isAnyOf(url.pathname, path)
  }

  return createUnwrapper({
    ...options,
    unwrap: (url) => {
      if (!isOnPath(url)) {
        return
      }

      for (const param of params) {
        const target = decode
          ? readDecodedTarget(url, param, decode, index)
          : readParamTarget(url, param, index, plus)

        if (target && !hasOtherScheme(target)) {
          return target
        }
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
