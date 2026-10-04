import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPaths = ['/icp/relay.php', '/icp/rclick.php']

const extractDestination = createParamExtractor({
  hosts: /^(?:click(?:-\d+)?|ic1)\.icptrack\.com$/,
  params: ['destination'],
})

// ICPTrack email click tracker (click.icptrack.com/icp/relay.php?...&destination=<target>, also
// /icp/rclick.php, the account hosts click-<n>.icptrack.com and ic1.icptrack.com).
export const unwrapIcptrack: UrlUnwrapper = (url) => {
  if (!clickPaths.includes(url.pathname)) {
    return
  }

  return extractDestination(url)
}
