import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractFrame = createParamExtractor({
  domains: 'about.com',
  path: '/gi/dynamic/offsite.htm',
  params: ['zu', 'site'],
})

const extractLeaving = createParamExtractor({
  domains: 'about.com',
  path: '/gi/o.htm',
  params: ['zu'],
})

// About.com outbound link page from its topic guides (<topic>.about.com/gi/dynamic/offsite.htm?
// zu=<target>, also ?site=<target>, a frame over the target) and its leaving page
// (<topic>.about.com/gi/o.htm?zu=<target>), which links on to the target.
export const unwrapAboutCom: UrlUnwrapper = (url) => {
  return extractFrame(url) ?? extractLeaving(url)
}
