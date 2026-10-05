import { createParamExtractor } from '../utils.js'

// Evernote outbound link redirect (www.evernote.com/OutboundRedirect.action?dest=<target>).
export const unwrapEvernote = createParamExtractor({
  hosts: 'www.evernote.com',
  path: '/OutboundRedirect.action',
  params: ['dest'],
})
