import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// Stops before a run of slashes followed by a host. A run after `:` belongs to a url carried in
// the path, such as a web archive's, so it stays.
const gluedUrlRegex = /^(?:\/[^/]+)*?(?<!:|%3a)(?=\/\/+(?:[a-z0-9-]+\.)+[a-z]{2,}\/)/i

// A protocol-relative url a site glued onto its own as text, on any host and any path
// (<host>//<target>), sometimes with a third slash or behind the site's directory, as uCoz writes.
// The browser reads the glued src as https.
// Opt-in: on an unknown host a run of slashes may belong to the site's own path.
export const unwrapGenericPathCarrier: UrlUnwrapper = (url) => {
  return getPathTarget(url, gluedUrlRegex)
}
