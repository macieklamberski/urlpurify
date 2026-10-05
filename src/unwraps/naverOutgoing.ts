import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapLoginfra = createParamExtractor({
  hosts: 'cc.loginfra.com',
  path: '/cc',
  params: ['u'],
})

const unwrapSearchClick = createParamExtractor({
  hosts: ['search.naver.com', 'm.search.naver.com'],
  path: '/p/crd/rd',
  params: ['u'],
})

// Naver outbound link redirect (cc.loginfra.com/cc?u=<target>) and search result click
// (search.naver.com/p/crd/rd?u=<target>, also on m.search.naver.com). Naver is a major Korean
// platform; the redirect only tracks the click.
export const unwrapNaverOutgoing: UrlUnwrapper = (url) => {
  return unwrapLoginfra(url) ?? unwrapSearchClick(url)
}
