import { isAnyOf, isHostOrSubdomainOf } from 'trousse'
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
const decodeEncodedScheme = (value: string): string => {
  if (!encodedSchemeRegex.test(value)) {
    return value
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const unencodedTargetRegex = /^https?:\/\//i

// Every value of a query param, in order, as `URLSearchParams.getAll` reads them, except a `+` in
// a target the carrier left unencoded, as in `wgtarget=https://example.com/search/a+b/`. There the
// `+` is the target's own and stays, where `URLSearchParams` reads it as a space.
export const getParamValues = (url: URL, name: string): Array<string> => {
  const values: Array<string> = []

  for (const pair of url.search.slice(1).split('&')) {
    const entry = new URLSearchParams(pair).entries().next().value

    if (!entry || entry[0] !== name) {
      continue
    }

    const raw = pair.slice(pair.indexOf('=') + 1)

    if (!unencodedTargetRegex.test(raw)) {
      values.push(entry[1])
      continue
    }

    values.push(new URLSearchParams(`value=${raw.replaceAll('+', '%2B')}`).get('value') ?? '')
  }

  return values
}

export const createParamExtractor = (config: ParamExtractorConfig): UrlUnwrapper => {
  return (url) => {
    const isHostMatch =
      config.domains !== undefined
        ? isHostOrSubdomainOf(url, config.domains)
        : isAnyOf(url.hostname, config.hosts)

    if (!isHostMatch) {
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

// Stateless for non-streaming decodes, so one instance is shared across calls.
const utf8Decoder = new TextDecoder()

export const decodeBase64 = (value: string): string | undefined => {
  const binary = decodeBase64Binary(value)

  if (binary === undefined) {
    return
  }

  // A plain fill loop; Uint8Array.from with a mapper invokes a callback per byte.
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }

  return utf8Decoder.decode(bytes)
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
