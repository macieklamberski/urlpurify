import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Chitika contextual ad click (linx.chitika.net/track?target=<target>). Chitika closed in 2019, and
// captures from 2009 show the click forwarding to the target. Not included in defaultUnwrappers: an
// ad click pays the publisher.
export const unwrapChitika: UrlUnwrapper = createParamExtractor({
  hosts: 'linx.chitika.net',
  path: '/track',
  params: ['target'],
})
