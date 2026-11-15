import {
  coerceArray,
  decodePercent,
  getQueryParamValues,
  isAnyOf,
  isHostOf,
  isHostOrSubdomainOf,
} from 'trousse'
import { withScope } from './scope.js'
import type { UrlUnwrapper, UrlUnwrapperFunction } from './types.js'

// `domains` also matches every subdomain. `hosts` matches a host exactly, or by regex, for a domain
// where a third party can get a subdomain, such as a blog host.
export type ParamExtractorConfig = (
  | { domains: string | Array<string>; hosts?: never }
  | { hosts: string | Array<string> | RegExp; domains?: never }
) & {
  path?: string
  params: Array<string>
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

// Every value of a query param, in order, its name in any case, decoded as `URLSearchParams` does,
// except that a malformed escape stays as written, and a `+` stays in an unencoded target,
// as in `wgtarget=https://example.com/search/a+b/`, which `URLSearchParams` reads as a space.
export const getParamValues = (url: URL, name: string): Array<string> => {
  const values: Array<string> = []
  const raws = getQueryParamValues(url, name, { decodeValues: false, preserveEmptyValues: true })

  for (const raw of raws) {
    if (!unencodedTargetRegex.test(raw)) {
      values.push(decodePercent(raw.replaceAll('+', ' ')))
      continue
    }

    values.push(decodePercent(raw))
  }

  return values
}

// The target a carrier param holds, read as `getParamValues` reads it and decoded once more when
// encoded twice: the first value, or the one at `index`, such as -1 for the last.
export const getParamTarget = (url: URL, name: string, index = 0): string | undefined => {
  const value = getParamValues(url, name).at(index)

  if (!value) {
    return
  }

  return decodeEncodedScheme(value)
}

export const createParamExtractor = (config: ParamExtractorConfig): UrlUnwrapper => {
  const isHostMatch = (url: URL): boolean => {
    if (config.domains !== undefined) {
      return isHostOrSubdomainOf(url, config.domains)
    }

    if (config.hosts instanceof RegExp) {
      return isAnyOf(url.hostname, config.hosts)
    }

    return isHostOf(url, config.hosts)
  }

  const unwrap: UrlUnwrapperFunction = (url) => {
    if (!isHostMatch(url)) {
      return
    }

    if (config.path && !isAnyOf(url.pathname, config.path)) {
      return
    }

    for (const param of config.params) {
      const value = getParamValues(url, param).at(0)

      if (value) {
        return decodeEncodedScheme(value)
      }
    }
  }

  if (config.domains !== undefined) {
    return withScope(unwrap, { domains: coerceArray(config.domains) })
  }

  return withScope(unwrap, {
    hosts: config.hosts instanceof RegExp ? config.hosts : coerceArray(config.hosts),
  })
}

const utf8Encoder = new TextEncoder()

export const getUtf8ByteLength = (value: string): number => {
  return utf8Encoder.encode(value).length
}
