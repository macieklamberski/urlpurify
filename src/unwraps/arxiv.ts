import { createParamExtractor } from '../utils.js'

// arXiv outbound link redirect on abstract pages (arxiv.org/ct?url=<target>&v=<checksum>).
export const unwrapArxiv = createParamExtractor({
  hosts: 'arxiv.org',
  path: '/ct',
  params: ['url'],
})
