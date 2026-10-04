import { createParamExtractor } from '../utils.js'

// Steam outbound link filter (steamcommunity.com/linkfilter/?url=<target> or ?u=<target>).
export const unwrapSteamLinkfilter = createParamExtractor({
  hosts: 'steamcommunity.com',
  path: '/linkfilter/',
  params: ['url', 'u'],
})
