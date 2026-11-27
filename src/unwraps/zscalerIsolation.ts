import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const sessionPathRegex = /^\/profile\/[0-9a-f-]{36}\/zia-session\/$/i

const extractTarget = createQueryUnwrapper({
  hosts: /^[0-9a-f]{8}\.isolation\.zscaler\.com$/,
  params: ['original_url'],
})

// Zscaler cloud browser isolation
// (<hex>.isolation.zscaler.com/profile/<uuid>/zia-session/?original_url=<target>&key=&hmac=), a
// page that asks to confirm the redirect to the target. Opt-in, as a security proxy.
export const unwrapZscalerIsolation = createUnwrapper({
  subdomains: 'isolation.zscaler.com',
  unwrap: (url) => {
    if (!sessionPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
