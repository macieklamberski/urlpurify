import { createPathUnwrapper } from '../pathTarget.js'

// The proxy script, also in its German edition, then the target.
const prefixRegex = /^\/cgi-bin\/anon-www(?:_de)?\.cgi\//i

// Anonymouse web proxy (anonymouse.org/cgi-bin/anon-www.cgi/<target>, also anon-www_de.cgi).
// Opt-in: unwrapping returns the live page, not the copy. The proxy serves the page anonymously,
// which a reader may choose on purpose.
export const unwrapAnonymouse = createPathUnwrapper({
  hosts: ['anonymouse.org', 'www.anonymouse.org'],
  prefix: prefixRegex,
})
