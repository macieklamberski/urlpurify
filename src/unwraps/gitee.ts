import { createParamExtractor } from '../utils.js'

// Gitee external link redirect (gitee.com/link?target=<target>), on gitee.com and every subdomain.
export const unwrapGitee = createParamExtractor({
  domains: 'gitee.com',
  path: '/link',
  params: ['target'],
})
