import type { UrlUnwrapper } from '../types.js'

// A run after `:` belongs to a url carried in the path, such as a web archive's, so it stays.
const gluedUrlRegex = /^(?:\/[^/]+)*?(?<!:|%3a)\/\/+(?<target>(?:[a-z0-9-]+\.)+[a-z]{2,}\/.*)$/i

// A protocol-relative url a site glued onto its own as text, on any host and any path
// (<host>//<target>), sometimes with a third slash or behind the site's directory, as uCoz writes.
// Opt-in: on an unknown host a run of slashes may belong to the site's own path.
export const unwrapGenericPathCarrier: UrlUnwrapper = (url) => {
  const target = url.pathname.match(gluedUrlRegex)?.groups?.target

  if (!target) {
    return
  }

  return `//${target}${url.search}${url.hash}`
}
