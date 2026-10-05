import { createParamExtractor } from '../utils.js'

// NodeSeek forum leaving-site page (www.nodeseek.com/jump?to=<target>). The page names the target
// and links on to it.
export const unwrapNodeseek = createParamExtractor({
  hosts: 'www.nodeseek.com',
  path: '/jump',
  params: ['to'],
})
