import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Elastic Email click tracker, on its own <code>.trk.elasticemail.com hosts and on senders' custom
// tracking domains (tracking.<sender domain>/tracking/click?msgid=<id>&target=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapElasticEmail: UrlUnwrapper = (url) => {
  if (url.pathname !== '/tracking/click' || !url.searchParams.has('msgid')) {
    return
  }

  const target = url.searchParams.get('target')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
