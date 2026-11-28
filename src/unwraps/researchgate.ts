import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const derefPathRegex = /^\/deref\/(?<target>.+)$/i

const hosts = ['researchgate.net', 'www.researchgate.net']

const extractDerefPage = createQueryUnwrapper({
  hosts,
  path: '/go.Deref.html',
  params: ['url'],
})

// ResearchGate dereferrer (www.researchgate.net/deref/<target>), the target percent-encoded or
// plain, and the older page (www.researchgate.net/go.Deref.html?url=<target>).
export const unwrapResearchgate = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const pageTarget = extractDerefPage(url)

    if (pageTarget) {
      return pageTarget
    }

    const match = derefPathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    // A raw target leaves its own query in the outer url. Beside an encoded target, the outer
    // query is ResearchGate's own `_sg` token.
    return resolvePathTarget(url, match.groups.target)
  },
})
