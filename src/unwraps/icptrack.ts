import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/icp\/r(?:elay|click)\.php$/

const extractDestination = createParamExtractor({
  hosts: 'click.icptrack.com',
  params: ['destination'],
})

// ICPTrack email click tracker (click.icptrack.com/icp/relay.php?...&destination=<target>,
// also /icp/rclick.php?...&destination=<target>).
export const unwrapIcptrack: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractDestination(url)
}
