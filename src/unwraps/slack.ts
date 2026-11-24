import { createQueryUnwrapper } from '../utils.js'

// Slack link redirect (slack-redir.net/link?url=<target>).
export const unwrapSlack = createQueryUnwrapper({
  hosts: 'slack-redir.net',
  path: '/link',
  params: ['url'],
})
