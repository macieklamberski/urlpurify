import { getQueryParam } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hostRegex = /^\d+\.teacup\.com$/
const pathRegex = /^\/[^/]+\/bbs$/i

const extractTarget = createQueryUnwrapper({
  hosts: hostRegex,
  params: ['JUR'],
})

// Teacup hosted BBS link jump (<n>.teacup.com/<board>/bbs?M=JU&JUR=<target>). Teacup closed in
// 2022, and captures up to 2012 show the jump forwarding to the target.
export const unwrapTeacup = createUnwrapper({
  subdomains: 'teacup.com',
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname) || getQueryParam(url, 'M') !== 'JU') {
      return
    }

    return extractTarget(url)
  },
})
