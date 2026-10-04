import { createParamExtractor } from '../utils.js'

// Slack link redirect (slack-redir.net/link?url=<target>).
export const unwrapSlack = createParamExtractor({
  hosts: 'slack-redir.net',
  path: '/link',
  params: ['url'],
})
