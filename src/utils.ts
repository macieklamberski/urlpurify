import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from './types.js'

export type ParamExtractorConfig = {
  hosts: string | Array<string> | RegExp
  path?: string
  params: Array<string>
}

export const createParamExtractor = (config: ParamExtractorConfig): UrlUnwrapper => {
  return (url) => {
    if (!isAnyOf(url.hostname, config.hosts)) {
      return
    }

    if (config.path && url.pathname !== config.path) {
      return
    }

    for (const param of config.params) {
      const value = url.searchParams.get(param)

      if (value) {
        return value
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
