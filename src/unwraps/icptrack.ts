import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPaths = ['/icp/relay.php', '/icp/rclick.php']

const extractDestination = createParamExtractor({
  hosts: 'click.icptrack.com',
  params: ['destination'],
})

// ICPTrack email click tracker (click.icptrack.com/icp/relay.php?...&destination=<target>,
// also /icp/rclick.php?...&destination=<target>).
export const unwrapIcptrack: UrlUnwrapper = (url) => {
  if (!clickPaths.includes(url.pathname)) {
    return
  }

  return extractDestination(url)
}
