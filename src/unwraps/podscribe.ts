import { createPathUnwrapper } from '../pathTarget.js'

const rssPrefixRegex = /^\/rss\/p\//i

// Podscribe download measurement prefix (pscrb.fm/rss/p/<target> and
// verifi.podscribe.com/rss/p/<target>), where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodscribe = createPathUnwrapper({
  hosts: ['pscrb.fm', 'www.pscrb.fm', 'verifi.podscribe.com'],
  prefix: rssPrefixRegex,
})
