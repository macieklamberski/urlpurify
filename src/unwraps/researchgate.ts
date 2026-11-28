import { isHostOf, isHttpUrl } from 'trousse'
import { decodePathTarget, resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment, createQueryUnwrapper } from '../utils.js'

const derefPathRegex = /^\/deref\/(.+)$/i

const unwrapDerefPage = createQueryUnwrapper({
  hosts: ['www.researchgate.net', 'researchgate.net'],
  path: '/go.Deref.html',
  params: ['url'],
})

// ResearchGate dereferrer (www.researchgate.net/deref/<target>), the target percent-encoded or
// plain, and the older page (www.researchgate.net/go.Deref.html?url=<target>).
export const unwrapResearchgate: UrlUnwrapper = (url) => {
  const pageTarget = unwrapDerefPage(url)

  if (pageTarget) {
    return pageTarget
  }

  if (!isHostOf(url, ['www.researchgate.net', 'researchgate.net'])) {
    return
  }

  const match = derefPathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // A plain target leaves its own query and fragment in the outer url. Beside an encoded target,
  // the outer query is ResearchGate's own `_sg` token.
  if (isHttpUrl(match[1])) {
    return `${resolvePathTarget(url, match[1])}${url.hash}`
  }

  return appendLinkFragment(decodePathTarget(match[1]), url)
}
