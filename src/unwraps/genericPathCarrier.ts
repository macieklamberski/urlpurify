import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// Stops before a run of slashes followed by a host. A run after `:` belongs to a url carried in
// the path, such as a web archive's, and a run after `=` to a query written into the path, as in
// `post.html&media=//cdn.example/a.jpg`, so both stay.
const gluedUrlRegex = /^(?:\/[^/]+)*?(?<!:|%3a|=)(?=\/\/+(?:[a-z0-9-]+\.)+[a-z]{2,}\/)/i

// An encoded quote or angle bracket in the path means markup written into it, such as
// `%3Cscript%20src=%22//host/x.js%22`, where the glued url runs into the markup.
const encodedMarkupRegex = /%22|%3c|%3e/i

// A protocol-relative url a site glued onto its own as text, on any host and any path
// (<host>//<target>), sometimes with a third slash or behind the site's directory, as uCoz writes.
// The browser reads the glued src as https.
// Opt-in: on an unknown host a run of slashes may belong to the site's own path.
export const unwrapGenericPathCarrier = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (encodedMarkupRegex.test(url.pathname)) {
      return
    }

    const target = readPathTarget(url, gluedUrlRegex)

    if (!target) {
      return
    }

    return target
  },
})
