import { createPathUnwrapper } from '../pathTarget.js'

const rssPrefixRegex = /^\/rss\/p\//i

// Podscribe download measurement prefix (pscrb.fm/rss/p/<target> and
// verifi.podscribe.com/rss/p/<target>), where the target often drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapPodscribe = createPathUnwrapper({
  hosts: ['pscrb.fm', 'www.pscrb.fm', 'verifi.podscribe.com'],
  prefix: rssPrefixRegex,
})
