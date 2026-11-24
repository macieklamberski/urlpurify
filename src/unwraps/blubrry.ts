import { createPathUnwrapper } from '../pathTarget.js'

// The show slug, an optional one-letter segment, and then the target, which starts with a scheme
// or a host. A path with no host after the show is a file Blubrry hosts itself.
const showPrefixRegex =
  /^\/[^/]+\/(?:[bps]\/)?(?=\/*(?:https?:|[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d+)?\/))/i

const hosts = ['media.blubrry.com', 'media.rawvoice.com', 'media.techpodcasts.com']

// Blubrry download measurement prefix (media.blubrry.com/<show>/<target>, also with p/, s/ or b/
// after the show), where the target often drops its scheme. The target is often Blubrry's own
// content., ins. or mc.blubrry.com. RawVoice's media.rawvoice.com and media.techpodcasts.com run
// the same redirect.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapBlubrry = createPathUnwrapper({
  hosts,
  prefix: showPrefixRegex,
  scheme: 'link',
})
