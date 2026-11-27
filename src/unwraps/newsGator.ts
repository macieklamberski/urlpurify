import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['newsgator.com', 'www.newsgator.com']

const unwrapSubext = createQueryUnwrapper({
  hosts,
  path: '/ngs/subscriber/subext.aspx',
  params: ['url'],
  ignoreLinkFragment: true,
})
const unwrapSubfext = createQueryUnwrapper({
  hosts,
  path: '/ngs/subscriber/subfext.aspx',
  params: ['url'],
  ignoreLinkFragment: true,
})

// NewsGator subscribe button (www.newsgator.com/ngs/subscriber/subext.aspx?url=<feed>, also
// /ngs/subscriber/subfext.aspx?url=). Not in defaultUnwrappers: the link adds the feed to a
// NewsGator account, it does not redirect to it.
export const unwrapNewsGator = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return unwrapSubext(url) ?? unwrapSubfext(url)
  },
})
