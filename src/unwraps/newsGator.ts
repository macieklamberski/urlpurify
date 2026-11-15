import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hosts = ['newsgator.com', 'www.newsgator.com']

const unwrapSubext = createParamExtractor({
  hosts,
  path: '/ngs/subscriber/subext.aspx',
  params: ['url'],
})
const unwrapSubfext = createParamExtractor({
  hosts,
  path: '/ngs/subscriber/subfext.aspx',
  params: ['url'],
})

// NewsGator subscribe button (www.newsgator.com/ngs/subscriber/subext.aspx?url=<feed>, also
// /ngs/subscriber/subfext.aspx?url=). Not in defaultUnwrappers: the link adds the feed to a
// NewsGator account, it does not redirect to it.
export const unwrapNewsGator: UrlUnwrapper = (url) => {
  return unwrapSubext(url) ?? unwrapSubfext(url)
}
