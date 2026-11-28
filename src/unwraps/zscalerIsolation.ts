import { createQueryUnwrapper } from '../utils.js'

const sessionPathRegex = /^\/profile\/[0-9a-f-]{36}\/zia-session\/$/i

// Zscaler cloud browser isolation
// (<hex>.isolation.zscaler.com/profile/<uuid>/zia-session/?original_url=<target>&key=&hmac=), a
// page that asks to confirm the redirect to the target.
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapZscalerIsolation = createQueryUnwrapper({
  subdomains: 'isolation.zscaler.com',
  match: /^[0-9a-f]{8}\.isolation\.zscaler\.com$/,
  path: sessionPathRegex,
  params: ['original_url'],
})
