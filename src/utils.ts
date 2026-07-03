import type { UrlUnwrapper } from './types.js'

export type ParamExtractorConfig = {
  hosts: string | Array<string> | RegExp
  path?: string
  params: Array<string>
}

const createHostMatcher = (hosts: string | Array<string> | RegExp): ((host: string) => boolean) => {
  if (hosts instanceof RegExp) {
    return (host) => hosts.test(host)
  }

  const hostSet = new Set(Array.isArray(hosts) ? hosts : [hosts])

  return (host) => hostSet.has(host)
}

export const createParamExtractor = (config: ParamExtractorConfig): UrlUnwrapper => {
  const matchesHost = createHostMatcher(config.hosts)

  return (url) => {
    if (!matchesHost(url.hostname)) {
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

export const decodeBase64 = (value: string): string | undefined => {
  const binary = decodeBase64Binary(value)

  if (binary === undefined) {
    return
  }

  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))

  return new TextDecoder().decode(bytes)
}

export const decodeBase64Url = (value: string): string | undefined => {
  return decodeBase64(value.replace(/-/g, '+').replace(/_/g, '/'))
}

export const getUtf8ByteLength = (value: string): number => {
  return new TextEncoder().encode(value).length
}
