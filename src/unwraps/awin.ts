import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapAwinCread = createParamExtractor({
  domains: 'awin1.com',
  path: '/cread.php',
  params: ['ued', 'p'],
})

const unwrapAwinClick = createParamExtractor({
  domains: 'awin1.com',
  path: '/awclick.php',
  params: ['ued', 'p'],
})

// Awin affiliate redirect (awin1.com/cread.php?ued=<target> or ?p=<target>, and /awclick.php?p= or
// ?ued=), on the domain and every subdomain.
// Not included in defaultUnwrappers: unwrapping removes the writer's commission.
export const unwrapAwin: UrlUnwrapper = (url) => {
  return unwrapAwinCread(url) ?? unwrapAwinClick(url)
}
