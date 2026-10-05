import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// About.com outbound link page from its topic guides
// (<topic>.about.com/gi/dynamic/offsite.htm?zi=<id>&zu=<target>, also ?site=<target>), a frame
// that showed the target below an About.com bar. About.com became Dotdash in 2017.
export const unwrapAboutCom: UrlUnwrapper = createParamExtractor({
  domains: 'about.com',
  path: '/gi/dynamic/offsite.htm',
  params: ['zu', 'site'],
})
