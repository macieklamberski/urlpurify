import { isAnyOf } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPaths = ['/icp/relay.php', '/icp/rclick.php']

const extractDestination = createQueryUnwrapper({
  hosts: /^(?:click(?:-\d+)?|ic1)\.icptrack\.com$/,
  params: ['destination'],
})

// ICPTrack email click tracker (click.icptrack.com/icp/relay.php?...&destination=<target>, also
// /icp/rclick.php, the account hosts click-<n>.icptrack.com and ic1.icptrack.com).
export const unwrapIcptrack = createUnwrapper({
  subdomains: 'icptrack.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, clickPaths)) {
      return
    }

    return extractDestination(url)
  },
})
