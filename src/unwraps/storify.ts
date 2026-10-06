import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Storify click counter on links in embedded stories
// (stats.storify.com/record/click?sid=<story id>&redirect=<target>). Storify closed in 2018, and
// captures from 2012 show the counter forwarding to the target.
export const unwrapStorify: UrlUnwrapper = createParamExtractor({
  hosts: 'stats.storify.com',
  path: '/record/click',
  params: ['redirect'],
})
