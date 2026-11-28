import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractAwinCread = createQueryUnwrapper({
  hosts: ['awin1.com', 'www.awin1.com'],
  path: '/cread.php',
  params: ['ued', 'p'],
})

const extractAwinClick = createQueryUnwrapper({
  hosts: ['awin1.com', 'www.awin1.com'],
  path: '/awclick.php',
  params: ['ued', 'p'],
})

// Awin affiliate redirect ([www.]awin1.com/cread.php?ued=<target> or ?p=<target>, and
// [www.]awin1.com/awclick.php?p=<target> or ?ued=<target>).
// Opt-in: unwrapping removes the writer's commission.
export const unwrapAwin = createUnwrapper({
  hosts: ['awin1.com', 'www.awin1.com'],
  unwrap: (url) => {
    return extractAwinCread(url) ?? extractAwinClick(url)
  },
})
