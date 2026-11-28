import { readPathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['dstats.net', 'www.dstats.net']

// The target keeps its scheme, as in /download/http://example.com/file.pdf.
const downloadPrefixRegex = /^\/download\/(?=https?(?::|%(?:25)?3a))/i

const extractDownload = createQueryUnwrapper({
  hosts,
  path: '/download.php',
  params: ['file'],
})

const extractForward = createQueryUnwrapper({
  hosts,
  path: '/fwd.php',
  params: ['url'],
})

// DStats download and hit counter (dstats.net/download/<target>, /download.php?file=<target> and
// /fwd.php?url=<target>), the target unencoded.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapDstats = createUnwrapper({
  hosts,
  unwrap: (url) => {
    return readPathTarget(url, downloadPrefixRegex) ?? extractDownload(url) ?? extractForward(url)
  },
})
