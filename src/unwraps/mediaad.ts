import { createParamExtractor } from '../utils.js'

// Mediaad native ad click (api.mediaad.org/v2/events/click?iid=<id>&redir=<target>). Not included
// in defaultUnwrappers: an ad click pays the publisher.
export const unwrapMediaad = createParamExtractor({
  hosts: 'api.mediaad.org',
  path: '/v2/events/click',
  params: ['redir'],
})
