import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const domains = ['about.com']

const extractFrame = createQueryUnwrapper({
  domains,
  path: '/gi/dynamic/offsite.htm',
  params: ['zu', 'site'],
})

const extractLeaving = createQueryUnwrapper({
  domains,
  path: '/gi/o.htm',
  params: ['zu'],
})

// About.com outbound link page from its topic guides (<topic>.about.com/gi/dynamic/offsite.htm?
// zu=<target>, also ?site=<target>, a frame over the target) and its leaving page
// (<topic>.about.com/gi/o.htm?zu=<target>), which links on to the target.
export const unwrapAboutCom = createUnwrapper({
  domains,
  unwrap: (url) => {
    return extractFrame(url) ?? extractLeaving(url)
  },
})
