import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

const pathRegex = /^\/[^/]+\/outgoing$/i

// DeviantArt outbound link shim (www.deviantart.com/<user>/outgoing?<target>). Only the www host
// redirects: every user has a subdomain of deviantart.com. The target is the whole query string,
// written unencoded, so a raw one is taken verbatim.
export const unwrapDeviantartOutgoing = createUnwrapper({
  hosts: ['deviantart.com', 'www.deviantart.com'],
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = url.search.slice(1)

    if (!target) {
      return
    }

    return decodeEncodedScheme(target)
  },
})
