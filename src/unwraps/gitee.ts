import { createParamExtractor } from '../utils.js'

// Gitee external link redirect (gitee.com/link?target=<target>).
export const unwrapGitee = createParamExtractor({
  hosts: 'gitee.com',
  path: '/link',
  params: ['target'],
})
