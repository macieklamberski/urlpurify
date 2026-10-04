import { createParamExtractor } from '../utils.js'

// Evernote outbound link redirect (www.evernote.com/OutboundRedirect.action?dest=<target>), on
// evernote.com and its subdomains.
export const unwrapEvernote = createParamExtractor({
  domains: 'evernote.com',
  path: '/OutboundRedirect.action',
  params: ['dest'],
})
