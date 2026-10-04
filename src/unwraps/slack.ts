import { createParamExtractor } from '../utils.js'

// Slack link redirect (slack-redir.net/link?url=<target>), on every subdomain.
export const unwrapSlack = createParamExtractor({
  domains: 'slack-redir.net',
  path: '/link',
  params: ['url'],
})
