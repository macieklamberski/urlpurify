import { isHostOf, isHostOrSubdomainOf, parseUrl } from 'trousse'
import type { UrlUnwrapper, UrlUnwrapperFunction, UrlUnwrapperScope } from './types.js'

// Unwrapper positions by exact host and by domain, and the positions that need a call per url:
// a regex host, a `mayMatch` test or no scope at all. A Map, since a hostname such as
// `__proto__` parses and would collide with a plain object's keys.
type UnwrapperIndex = {
  hosts: Map<string, Array<number>>
  domains: Map<string, Array<number>>
  scanned: Array<number>
}

const indexCache = new WeakMap<Array<UrlUnwrapper>, UnwrapperIndex>()

// Spelled as `isHostOf` compares it: lowercased, punycoded, without a trailing dot.
const toHostKey = (host: string): string => {
  const hostname = parseUrl(`http://${host.trim()}`)?.hostname ?? host.toLowerCase()

  return hostname.endsWith('.') ? hostname.slice(0, -1) : hostname
}

const addPosition = (map: Map<string, Array<number>>, key: string, position: number): void => {
  const positions = map.get(key)

  if (positions) {
    positions.push(position)
    return
  }

  map.set(key, [position])
}

const getIndex = (unwrappers: Array<UrlUnwrapper>): UnwrapperIndex => {
  let cached = indexCache.get(unwrappers)

  if (!cached) {
    cached = { hosts: new Map(), domains: new Map(), scanned: [] }

    for (const [position, unwrap] of unwrappers.entries()) {
      const scope = unwrap.scope

      const hasRegex = scope?.hosts instanceof RegExp || scope?.domains instanceof RegExp

      if (!scope || hasRegex || scope.mayMatch) {
        cached.scanned.push(position)
      }

      if (Array.isArray(scope?.hosts)) {
        for (const host of scope.hosts) {
          addPosition(cached.hosts, toHostKey(host), position)
        }
      }

      if (Array.isArray(scope?.domains)) {
        for (const domain of scope.domains) {
          addPosition(cached.domains, toHostKey(domain), position)
        }
      }
    }

    indexCache.set(unwrappers, cached)
  }

  return cached
}

const isScannedMatch = (url: URL, unwrap: UrlUnwrapper): boolean => {
  const scope = unwrap.scope

  if (!scope) {
    return true
  }

  if (scope.hosts instanceof RegExp && isHostOf(url, scope.hosts)) {
    return true
  }

  if (scope.domains instanceof RegExp && isHostOrSubdomainOf(url, scope.domains)) {
    return true
  }

  return scope.mayMatch?.(url) ?? false
}

// Attaches the scope to an unwrapper, so `cleanUrl` and `unwrapUrl` skip it on other urls.
export const withScope = (unwrap: UrlUnwrapperFunction, scope: UrlUnwrapperScope): UrlUnwrapper => {
  return Object.assign(unwrap, { scope })
}

// The unwrappers whose scope admits this url, in array order.
export const getCandidates = (url: URL, unwrappers: Array<UrlUnwrapper>): Array<UrlUnwrapper> => {
  const index = getIndex(unwrappers)
  const lowerHostname = url.hostname.toLowerCase()
  const hostname = lowerHostname.endsWith('.') ? lowerHostname.slice(0, -1) : lowerHostname
  const positions: Array<number> = [...(index.hosts.get(hostname) ?? [])]

  let domain = hostname

  while (domain) {
    positions.push(...(index.domains.get(domain) ?? []))

    const dot = domain.indexOf('.')

    if (dot === -1) {
      break
    }

    domain = domain.slice(dot + 1)
  }

  for (const position of index.scanned) {
    const unwrap = unwrappers[position]

    if (unwrap && isScannedMatch(url, unwrap)) {
      positions.push(position)
    }
  }

  positions.sort((a, b) => a - b)

  const candidates: Array<UrlUnwrapper> = []

  for (const [order, position] of positions.entries()) {
    const unwrap = unwrappers[position]

    if (!unwrap || position === positions[order - 1]) {
      continue
    }

    candidates.push(unwrap)
  }

  return candidates
}
