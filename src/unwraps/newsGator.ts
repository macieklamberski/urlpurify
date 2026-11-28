import { createQueryUnwrapper } from '../utils.js'

// NewsGator subscribe button (www.newsgator.com/ngs/subscriber/subext.aspx?url=<feed>, also
// /ngs/subscriber/subfext.aspx?url=).
// Opt-in: the link adds the feed to a NewsGator account, it does not redirect to it.
export const unwrapNewsGator = createQueryUnwrapper({
  hosts: ['newsgator.com', 'www.newsgator.com'],
  path: ['/ngs/subscriber/subext.aspx', '/ngs/subscriber/subfext.aspx'],
  params: ['url'],
  ignoreLinkFragment: true,
})
