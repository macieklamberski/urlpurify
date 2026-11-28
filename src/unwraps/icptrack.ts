import { createQueryUnwrapper } from '../utils.js'

// ICPTrack email click tracker (click.icptrack.com/icp/relay.php?...&destination=<target>, also
// /icp/rclick.php, the account hosts click-<n>.icptrack.com and ic1.icptrack.com).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapIcptrack = createQueryUnwrapper({
  subdomains: 'icptrack.com',
  match: /^(?:click(?:-\d+)?|ic1)\.icptrack\.com$/,
  path: ['/icp/relay.php', '/icp/rclick.php'],
  params: ['destination'],
})
