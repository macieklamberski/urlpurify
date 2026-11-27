import { getQueryParam } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/[^/]+\/bbs$/i

// Teacup hosted BBS link jump (<n>.teacup.com/<board>/bbs?M=JU&JUR=<target>). Teacup closed in
// 2022, and captures up to 2012 show the jump forwarding to the target.
export const unwrapTeacup = createUnwrapper({
  subdomains: 'teacup.com',
  match: /^\d+\.teacup\.com$/,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname) || getQueryParam(url, 'M') !== 'JU') {
      return
    }

    return readParamTarget(url, 'JUR')
  },
})
