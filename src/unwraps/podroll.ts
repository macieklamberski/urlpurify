import { createPathUnwrapper } from '../pathTarget.js'

const showPrefixRegex = /^\/[0-9a-f]{6}\//

// Podroll download measurement prefix (pdrl.fm/<show id>/<target>, also on rss.pdrl.fm), where the
// target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodroll = createPathUnwrapper({
  hosts: ['pdrl.fm', 'www.pdrl.fm', 'rss.pdrl.fm'],
  prefix: showPrefixRegex,
  scheme: 'inherit',
})
