import { createQueryUnwrapper } from '../utils.js'

const paths = ['/fan_reach/pt', '/c/fan_reach/pt', '/controller/fan_reach/pt']

// ReverbNation FanReach newsletter click tracker (www.rvrb.me/fan_reach/pt?eid=<id>&url=<target>,
// also rn_url, and www.reverbnation.com, where rvrb.me forwards), and its older paths
// /c/fan_reach/pt and /controller/fan_reach/pt, which forwarded the same way until 2021.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapReverbnation = createQueryUnwrapper({
  hosts: ['rvrb.me', 'www.rvrb.me', 'reverbnation.com', 'www.reverbnation.com'],
  path: paths,
  params: ['url', 'rn_url'],
})
