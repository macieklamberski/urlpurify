import { decodePercent, isAnyOf, isHostOf, isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from './types.js'

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

// Every value of a query param, in order, as `URLSearchParams.getAll` reads them, except that a
// malformed escape stays as written, and a `+` stays in a target the carrier left unencoded, as in
// `wgtarget=https://example.com/search/a+b/`, where `URLSearchParams` reads it as a space.
export const getParamValues = (url: URL, name: string): Array<string> => {
  const values: Array<string> = []

  for (const pair of url.search.slice(1).split('&')) {
    const entry = new URLSearchParams(`&${pair}`).entries().next().value

    if (!entry || entry[0] !== name) {
      continue
    }

    const separator = pair.indexOf('=')
    const raw = separator === -1 ? '' : pair.slice(separator + 1)

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

  return (url) => {
    if (!isHostMatch(url)) {
      return
    }

    if (config.path && url.pathname !== config.path) {
      return
    }

    for (const param of config.params) {
      const value = getParamValues(url, param).at(0)

      if (value) {
        return decodeEncodedScheme(value)
      }
    }
  }
}

// Decode base64 into the raw binary string (one character per byte). atob
// already implements forgiving decoding; this only turns errors into undefined.
export const decodeBase64Binary = (value: string): string | undefined => {
  try {
    return atob(value)
  } catch {}
}

// Each byte goes through `decodePercent` as an escape, so a UTF-8 sequence decodes and a byte of a
// legacy charset stays as `%XX`, where `TextDecoder` would write U+FFFD.
export const decodeBase64 = (value: string): string | undefined => {
  const binary = decodeBase64Binary(value)

  if (binary === undefined) {
    return
  }

  let encoded = ''

  for (let index = 0; index < binary.length; index++) {
    const byte = binary.charCodeAt(index)

    if (byte < 0x80 && binary[index] !== '%') {
      encoded += binary[index]
      continue
    }

    encoded += `%${byte.toString(16).toUpperCase().padStart(2, '0')}`
  }

  return decodePercent(encoded)
}

const toBase64 = (base64Url: string): string => {
  return base64Url.replace(/-/g, '+').replace(/_/g, '/')
}

export const decodeBase64Url = (value: string): string | undefined => {
  return decodeBase64(toBase64(value))
}

export const decodeBase64UrlBinary = (value: string): string | undefined => {
  return decodeBase64Binary(toBase64(value))
}

const utf8Encoder = new TextEncoder()

export const getUtf8ByteLength = (value: string): number => {
  return utf8Encoder.encode(value).length
}
