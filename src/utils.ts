import type { UrlUnwrapper } from './types.js'

export type ParamExtractorConfig = {
  hosts: string | Array<string> | RegExp
  path?: string
  params: Array<string>
}

export const createParamExtractor = (config: ParamExtractorConfig): UrlUnwrapper => {
  const matchesHost = (host: string): boolean => {
    if (config.hosts instanceof RegExp) {
      return config.hosts.test(host)
    }

    const list = Array.isArray(config.hosts) ? config.hosts : [config.hosts]

    return list.includes(host)
  }

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

// TODO: Duplicated from feedscout. Extract into a shared toolbox package and inline at build time.
export const isHostOf = (url: string, hosts: string | Array<string>): boolean => {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    const list = Array.isArray(hosts) ? hosts : [hosts]

    return list.some((host) => hostname === host.toLowerCase().trim())
  } catch {}

  return false
}

// TODO: Duplicated from feedscout. Extract into a shared toolbox package and inline at build time.
export const isSubdomainOf = (url: string, domains: string | Array<string>): boolean => {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    const list = Array.isArray(domains) ? domains : [domains]

    return list.some((domain) => hostname.endsWith(`.${domain}`))
  } catch {}

  return false
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
