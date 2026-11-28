import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['awin1.com', 'www.awin1.com']

const extractAwinCread = createQueryUnwrapper({
  hosts,
  path: '/cread.php',
  params: ['ued', 'p'],
})

const extractAwinClick = createQueryUnwrapper({
  hosts,
  path: '/awclick.php',
  params: ['ued', 'p'],
})

// Awin affiliate redirect ([www.]awin1.com/cread.php?ued=<target> or ?p=<target>, and
// [www.]awin1.com/awclick.php?p=<target> or ?ued=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapAwin = createUnwrapper({
  hosts,
  unwrap: (url) => {
    return extractAwinCread(url) ?? extractAwinClick(url)
  },
})
