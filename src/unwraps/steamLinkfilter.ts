import { createParamExtractor } from '../utils.js'

// Steam outbound link filter (steamcommunity.com/linkfilter/?url=<target> or ?u=<target>), on
// every subdomain.
export const unwrapSteamLinkfilter = createParamExtractor({
  domains: 'steamcommunity.com',
  path: '/linkfilter/',
  params: ['url', 'u'],
})
