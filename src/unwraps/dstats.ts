import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// The target keeps its scheme, as in /download/http://example.com/file.pdf.
const downloadPrefixRegex = /^\/download\/(?=https?:\/)/

const extractDownload = createParamExtractor({
  hosts: 'dstats.net',
  path: '/download.php',
  params: ['file'],
})

const extractForward = createParamExtractor({
  hosts: 'dstats.net',
  path: '/fwd.php',
  params: ['url'],
})

// DStats download and hit counter (dstats.net/download/<target>, /download.php?file=<target> and
// /fwd.php?url=<target>), the target unencoded. Opt-in: unwrapping removes the publisher's
// download count.
export const unwrapDstats: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'dstats.net')) {
    return
  }

  return getPathTarget(url, downloadPrefixRegex) ?? extractDownload(url) ?? extractForward(url)
}
