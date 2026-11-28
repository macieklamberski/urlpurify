import { createQueryUnwrapper } from '../utils.js'

// Gitee external link redirect (gitee.com/link?target=<target>).
export const unwrapGitee = createQueryUnwrapper({
  hosts: ['gitee.com', 'www.gitee.com'],
  path: '/link',
  params: ['target'],
})
