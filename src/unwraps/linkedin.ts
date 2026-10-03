import type { UrlUnwrapper } from '../types.js'

const shimPathRegex = /^\/(safety\/go|redir\/redirect)\/?$|^\/redirect$/

// LinkedIn outbound link shim (www.linkedin.com/safety/go?url=<target>, /redir/redirect?url=
// and /redirect?url=, the first two also with a trailing slash).
export const unwrapLinkedin: UrlUnwrapper = (url) => {
  if (url.hostname !== 'www.linkedin.com' || !shimPathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('url')

  if (!target) {
    return
  }

  return target
}
