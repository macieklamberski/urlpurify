import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// `/query` looks a snapshot up by url and date, `/<id>` names one snapshot.
const pathRegex = /^\/(?:query|[0-9A-Za-z]{9})$/

const extractTarget = createParamExtractor({
  hosts: 'www.webcitation.org',
  params: ['url'],
})

// WebCite archive snapshot (www.webcitation.org/query?url=<target>&date=<date>, or
// www.webcitation.org/<id>?url=<target>). Not included in defaultUnwrappers: unwrapping returns
// the live page, which may have changed or be gone.
export const unwrapWebcitation: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
