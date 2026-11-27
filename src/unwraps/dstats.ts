import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// The target keeps its scheme, as in /download/http://example.com/file.pdf.
const downloadPrefixRegex = /^\/download\/(?=https?:\/)/i

const extractDownload = createQueryUnwrapper({
  hosts: 'dstats.net',
  path: '/download.php',
  params: ['file'],
})

const extractForward = createQueryUnwrapper({
  hosts: 'dstats.net',
  path: '/fwd.php',
  params: ['url'],
})

// DStats download and hit counter (dstats.net/download/<target>, /download.php?file=<target> and
// /fwd.php?url=<target>), the target unencoded. Opt-in: unwrapping removes the publisher's
// download count.
export const unwrapDstats: UrlUnwrapper = createUnwrapper({
  hosts: 'dstats.net',
  unwrap: (url) => {
    return getPathTarget(url, downloadPrefixRegex) ?? extractDownload(url) ?? extractForward(url)
  },
})
