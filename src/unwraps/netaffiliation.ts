import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// The query opens with the click id as a bare key, such as `?P5139555780512191&redir=`.
const merchantQueryRegex = /^\?P[0-9A-F]{13,16}&/

const extractTracker = createParamExtractor({
  hosts: 'action.metaffiliation.com',
  path: '/trk.php',
  params: ['redir'],
})

// NetAffiliation, now Kwanko, affiliate click (action.metaffiliation.com/trk.php?mclic=<id>&redir=
// <target>, and <merchant tracking host>/?P<id>&redir=<target> on any host).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapNetaffiliation: UrlUnwrapper = (url) => {
  const target = extractTracker(url)

  if (target) {
    return target
  }

  // Merchants run the click on a tracking subdomain of their own domain, such as irh.oscaro.com.
  if (url.pathname !== '/' || !merchantQueryRegex.test(url.search)) {
    return
  }

  const redirect = url.searchParams.get('redir')

  if (redirect && isHttpUrl(redirect)) {
    return redirect
  }
}
