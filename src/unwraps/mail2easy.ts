import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/u\/\d+\/\d+\/\d+\/\d+(?:_\d+)?\/(?:[0-9a-f]+\/)?$/

// Mail2Easy email click tracker on a sender's own host
// (d-click.<sender domain>/u/<account>/<list>/<message>/<link>_0/<hash>/?url=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapMail2easy: UrlUnwrapper = (url) => {
  if (!url.hostname.startsWith('d-click.') || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
