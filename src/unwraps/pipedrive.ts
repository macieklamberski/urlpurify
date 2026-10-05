import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/c\/[a-z0-9]+\/[a-z0-9]+\/[a-z0-9]+\/\d+$/

const extractTarget = createParamExtractor({
  hosts: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pipedrive\.email$/,
  params: ['redirectUrl'],
})

// Pipedrive Campaigns email click tracker
// (<account uuid>.pipedrive.email/c/<id>/<id>/<id>/<n>?redirectUrl=<target>&hash=<hash>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapPipedrive: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
