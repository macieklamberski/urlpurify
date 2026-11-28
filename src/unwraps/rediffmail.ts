import { createQueryUnwrapper } from '../utils.js'

// Rediffmail webmail link redirect (www.rediffmail.com/cgi-bin/red.cgi?red=<target>&isImage=0),
// also on links.rediff.com, where the www host now sends it.
export const unwrapRediffmail = createQueryUnwrapper({
  hosts: ['www.rediffmail.com', 'rediffmail.com', 'links.rediff.com'],
  path: '/cgi-bin/red.cgi',
  params: ['red'],
})
