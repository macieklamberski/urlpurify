import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const sharePathRegex = /^\/api\/share\/?$/i

const extractTarget = createQueryUnwrapper({
  hosts: ['www.shareaholic.com', 'shareaholic.com'],
  params: ['link'],
  ignoreLinkFragment: true,
})

// Shareaholic share links (www.shareaholic.com/api/share/?link=<page>&service=<id>, also
// /api/share and the bare host, which redirects to www.). The endpoint answers 302 to the chosen
// service's own share form. Opt-in: unwrapping returns the shared page, not the form that shares
// it.
export const unwrapShareaholic: UrlUnwrapper = (url) => {
  if (!sharePathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
