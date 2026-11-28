import { createQueryUnwrapper } from '../utils.js'

// Evernote outbound link redirect (www.evernote.com/OutboundRedirect.action?dest=<target>).
export const unwrapEvernote = createQueryUnwrapper({
  hosts: ['evernote.com', 'www.evernote.com'],
  path: '/OutboundRedirect.action',
  params: ['dest'],
})
