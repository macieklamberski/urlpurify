import {
  archiveExtensions,
  audioExtensions,
  codeExtensions,
  decodePercent,
  documentExtensions,
  feedExtensions,
  flashExtensions,
  fontExtensions,
  getQueryParamValues,
  imageExtensions,
  installerExtensions,
  isAnyOf,
  isHostname,
  isHostOf,
  isHostOrSubdomainOf,
  isIpAddress,
  isString,
  isSubdomainOf,
  type Pattern,
  pageExtensions,
  parseUrl,
  resolveUrl,
  subtitleExtensions,
  videoExtensions,
} from 'trousse'
import type { UrlUnwrapper } from './types.js'

type HostList = Pattern | ReadonlyArray<Pattern>

// `hosts` matches a host exactly, or by regex. `domains` also matches every subdomain, and
// `subdomains` matches only the subdomains, never the domain itself. `brands` matches a brand on
// any tld, as `getBrandLabels` reads it, and with any of the other three also those. `anyHost`
// matches every host, for a path shape senders run on their own domains, and skips the host index.
export type UnwrapperHosts =
  | { hosts: HostList; domains?: never; subdomains?: never; brands?: never; anyHost?: never }
  | { domains: HostList; hosts?: never; subdomains?: never; brands?: never; anyHost?: never }
  | { subdomains: HostList; hosts?: never; domains?: never; brands?: never; anyHost?: never }
  | {
      brands: string | ReadonlyArray<string>
      hosts?: HostList
      domains?: HostList
      subdomains?: HostList
      anyHost?: never
    }
  | { anyHost: true; hosts?: never; domains?: never; subdomains?: never; brands?: never }

export type UnwrapperBaseConfig = UnwrapperHosts & {
  match?: RegExp // Narrows the hosts above to those it matches, while the hosts feed the host index
  ignoreLinkFragment?: boolean // The link opens a page or an image, or the page reads the fragment
}

export type UnwrapperConfig = UnwrapperBaseConfig & {
  unwrap: UrlUnwrapper
}

// `decode` reads the raw value with its `+` kept, so `plus` is read only without it.
export type QueryUnwrapperConfig = UnwrapperBaseConfig &
  (
    | { decode: TargetDecoder; plus?: never } // The carrier holds the target encoded, as in base64
    | { plus?: PlusReading; decode?: never } // How the service reads a raw `+` in the target
  ) & {
    path?: string | RegExp | ReadonlyArray<string>
    params: string | ReadonlyArray<string>
    index?: number // The value of a repeated param to read, such as -1 for the last
  }

export const httpSchemeRegex = /^https?:/i
const encodedSchemeRegex = /^https?(?:%3A|:%2F)/i
const dottedHostRegex = /[^.]\.[^.]/
const schemeRegex = /^(?:https?:|[a-z][a-z\d+.-]*:\/\/)/i
const hostEndRegex = /[/?#]/

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
export const appendLinkFragment = (url: URL, target: string): string => {
  if (target.includes('#')) {
    return target
  }

  return `${target}${url.hash}`
}

// Extensions that are also TLDs, such as `example.zip`, stay valid hosts.
const tldExtensions = ['mobi', 'mov', 'zip']

const fileExtensions = new Set(
  [
    ...archiveExtensions,
    ...audioExtensions,
    ...codeExtensions,
    ...documentExtensions,
    ...feedExtensions,
    ...flashExtensions,
    ...fontExtensions,
    ...imageExtensions,
    ...installerExtensions,
    ...pageExtensions,
    ...subtitleExtensions,
    ...videoExtensions,
  ].filter((extension) => !tldExtensions.includes(extension)),
)

// The url repair, trousse's `resolveUrl`, of a target, retried with `https://` in front when a
// target whose host is written dotted but with no scheme fails, as `%20www.example.com/ep.mp3` or
// `www.example.com:/ep.mp3` do. A repair that carries userinfo or keeps a junk host is no target:
// not a hostname such as `,ccam.cc`, no dot between two labels, or a file extension.
export const repairTarget = (target: string): string | undefined => {
  const retryBehindHttps = (): string | undefined => {
    const host = target.split(hostEndRegex, 1)[0]

    if (schemeRegex.test(target) || !dottedHostRegex.test(host)) {
      return
    }

    const retried = parseUrl(resolveUrl(`https://${target}`))

    // A target `05.10.2025:` reads as the IPv4 host 5.10.7.233 behind https.
    if (!retried || isIpAddress(retried.hostname)) {
      return
    }

    return retried.href
  }

  const repaired = resolveUrl(target) ?? retryBehindHttps()
  const parsed = parseUrl(repaired)

  if (!repaired || !parsed) {
    return
  }

  // A target `https://example.com@example.net/` goes to example.net while reading as example.com.
  if (parsed.username || parsed.password) {
    return
  }

  const { hostname } = parsed

  if (!dottedHostRegex.test(hostname) && !isIpAddress(hostname)) {
    return
  }

  if (!isHostname(hostname)) {
    return
  }

  if (fileExtensions.has(hostname.slice(hostname.lastIndexOf('.') + 1))) {
    return
  }

  return repaired
}

type ParamTargetOptions = {
  index?: number // The value of a repeated param to read, such as -1 for the last
  plus?: PlusReading
}

// The target a carrier param holds, read as `getParamValues` reads it and decoded once more when
// encoded twice: the first value, or the one at `index`, such as -1 for the last. A value the url
// repair, `repairTarget`, cannot turn into an http url, such as a relative `/local/page`,
// another scheme or a title without a dot, is no target. `plus` reads a raw `+` as `decodeParamValue` does.
export const readParamTarget = (
  url: URL,
  name: string,
  options: ParamTargetOptions = {},
): string | undefined => {
  const value = getParamValues(url, name, options.plus).at(options.index ?? 0)

  if (!value) {
    return
  }

  const target = decodeEncodedScheme(value)

  if (!repairTarget(target)) {
    return
  }

  return target
}

export type TargetDecoder = (value: string) => string | undefined

// The target a carrier param holds encoded, such as in base64: the first value, or the one at
// `index`, decoded by `decode`, and decoded once more when it still holds an encoded scheme. The
// value is read as `getParamValues` reads it with a `+` kept, so a raw `+` of the base64 alphabet
// stays a `+`, where form decoding reads it as a space that `atob` drops. A decoded value the url
// repair cannot use is no target, as in `readParamTarget`.
export const readDecodedParamTarget = (
  url: URL,
  name: string,
  decode: TargetDecoder,
  options: Pick<ParamTargetOptions, 'index'> = {},
): string | undefined => {
  const value = getParamValues(url, name, 'keep').at(options.index ?? 0)

  if (!value) {
    return
  }

  const decoded = decode(value)

  if (!decoded) {
    return
  }

  const target = decodeEncodedScheme(decoded)

  if (!repairTarget(target)) {
    return
  }

  return target
}

const lastSchemeRegex = /^.*https?(?::|%(?:25)?3a)./i

// The `source` group of a path regex whose lazy `.*?` searches for a source scheme after a prefix.
// Matching only up to the last scheme keeps one ahead of every prefix the regex tries, so it never
// rescans the rest of the path per prefix, which is quadratic on a path with no source. The scheme
// is raw, encoded or encoded twice.
export const readPathSource = (path: string, regex: RegExp): string | undefined => {
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

// A hostname in lowercase without its trailing dot, as `isHostOf` compares it: `example.com.` names
// the same host as `example.com`.
export const normalizeHost = (hostname: string): string => {
  const host = hostname.toLowerCase()

  return host.endsWith('.') ? host.slice(0, -1) : host
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
// label. Every registrable domain trousse's `isBrandDomainOf` reads ends in one of them. The host
// is read as `normalizeHost` writes it, as the index reads it.
export const getBrandLabels = (hostname: string): Array<string> => {
  const host = normalizeHost(hostname)
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

// Registers every host form `config` gives, or none when one of them cannot register or `anyHost`
// is set, so the index never skips the unwrapper on a host it matches.
const registerHosts = (unwrap: UrlUnwrapper, config: UnwrapperHosts): void => {
  if (config.anyHost) {
    return
  }

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
// `domains` or any of their subdomains, only on `subdomains` of the domains given, or on `brands`
// on any tld beside any of those, or on every host with `anyHost`, and on a host `match` matches
// when given. The target takes the link's fragment per `appendLinkFragment`, unless
// `ignoreLinkFragment` is set.
export const createUnwrapper = (config: UnwrapperConfig): UrlUnwrapper => {
  const isOnHost = (url: URL): boolean => {
    if (config.match && !isHostOf(url, config.match)) {
      return false
    }

    if (config.anyHost) {
      return true
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

    return appendLinkFragment(url, target)
  }

  registerHosts(unwrap, config)

  return unwrap
}

// An unwrapper for the target in the first of `params` that holds one, as `readParamTarget` reads
// it, or `readDecodedParamTarget` with `decode`, on a url on the hosts `createUnwrapper` takes, and
// on `path` when given: an exact path or a list, compared in any case, or a regex. A value the
// readers skip, such as an app's own `myapp://open`, a relative path such as `/local/page` or a
// title, moves on to the next param. A host with no scheme, or with a port as `example.com:8080/`,
// is repaired.
export const createQueryUnwrapper = (config: QueryUnwrapperConfig): UrlUnwrapper => {
  const { path, params, index, decode, plus, ...options } = config

  const isOnPath = (url: URL): boolean => {
    if (!path) {
      return true
    }

    // `search` ignores `lastIndex`, so a caller's `g` or `y` regex matches on every call.
    if (path instanceof RegExp) {
      return url.pathname.search(path) !== -1
    }

    return isAnyOf(url.pathname, path)
  }

  return createUnwrapper({
    ...options,
    unwrap: (url) => {
      if (!isOnPath(url)) {
        return
      }

      for (const param of isString(params) ? [params] : params) {
        const target = decode
          ? readDecodedParamTarget(url, param, decode, { index })
          : readParamTarget(url, param, { index, plus })

        if (target) {
          return target
        }
      }
    },
  })
}
