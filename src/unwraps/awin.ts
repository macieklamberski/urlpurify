import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapAwinCread = createParamExtractor({
  hosts: ['www.awin1.com', 'awin1.com'],
  path: '/cread.php',
  params: ['ued', 'p'],
})

const unwrapAwinClick = createParamExtractor({
  hosts: 'www.awin1.com',
  path: '/awclick.php',
  params: ['ued', 'p'],
})

// Awin affiliate redirect ([www.]awin1.com/cread.php?ued=<target> or ?p=<target>, and
// www.awin1.com/awclick.php?p=<target> or ?ued=<target>).
// Not included in defaultUnwrappers: unwrapping removes the writer's commission.
export const unwrapAwin: UrlUnwrapper = (url) => {
  return unwrapAwinCread(url) ?? unwrapAwinClick(url)
}
