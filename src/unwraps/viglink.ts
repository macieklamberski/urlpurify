import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapRedirect = createParamExtractor({
  hosts: 'redirect.viglink.com',
  params: ['u', 'out'],
})

const unwrapClickApi = createParamExtractor({
  hosts: ['api.viglink.com', 'apicdn.viglink.com'],
  path: '/api/click',
  params: ['out'],
})

// VigLink affiliate redirect (redirect.viglink.com/?u=<target> or ?out=<target>) and click api
// (api.viglink.com/api/click?out=<target>, also on apicdn.viglink.com).
// The click query also carries `loc`, the page the link sat on, which is never the target.
export const unwrapViglink: UrlUnwrapper = (url) => {
  return unwrapRedirect(url) ?? unwrapClickApi(url)
}
