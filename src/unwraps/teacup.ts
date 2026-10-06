import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hostRegex = /^\d+\.teacup\.com$/
const pathRegex = /^\/[^/]+\/bbs$/

const extractTarget = createParamExtractor({
  hosts: hostRegex,
  params: ['JUR'],
})

// Teacup hosted BBS link jump (<n>.teacup.com/<board>/bbs?M=JU&JUR=<target>). Teacup closed in
// 2022, and captures up to 2012 show the jump forwarding to the target.
export const unwrapTeacup: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname) || url.searchParams.get('M') !== 'JU') {
    return
  }

  return extractTarget(url)
}
