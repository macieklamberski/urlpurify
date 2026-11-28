import { createPathUnwrapper } from '../pathTarget.js'

const hosts = [
  'tracking.swap.fm',
  'swap.fm',
  'www.swap.fm',
  'dev.swap.fm',
  'staging.swap.fm',
  'tracking-stage.swap.fm',
]

const trackPrefixRegex = /^\/track\/[^/]+\//i

// Swap download measurement prefix (tracking.swap.fm/track/<show id>/<target>, also on swap.fm
// and the dev., staging. and tracking-stage. hosts), where the target drops its scheme.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapSwap = createPathUnwrapper({
  hosts,
  prefix: trackPrefixRegex,
})
