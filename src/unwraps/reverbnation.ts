import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// ReverbNation FanReach newsletter click tracker (www.rvrb.me/fan_reach/pt?eid=<id>&url=<target>,
// also rn_url, and www.reverbnation.com, where rvrb.me forwards). Opt-in: unwrapping removes the
// artist's click count.
export const unwrapReverbnation: UrlUnwrapper = createParamExtractor({
  hosts: ['www.rvrb.me', 'www.reverbnation.com'],
  path: '/fan_reach/pt',
  params: ['url', 'rn_url'],
})
