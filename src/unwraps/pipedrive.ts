import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/c\/[a-z0-9]+\/[a-z0-9]+\/[a-z0-9]+\/\d+$/i

// Pipedrive Campaigns email click tracker
// (<account uuid>.pipedrive.email/c/<id>/<id>/<id>/<n>?redirectUrl=<target>&hash=<hash>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapPipedrive = createQueryUnwrapper({
  subdomains: 'pipedrive.email',
  match: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pipedrive\.email$/,
  path: pathRegex,
  params: ['redirectUrl'],
})
