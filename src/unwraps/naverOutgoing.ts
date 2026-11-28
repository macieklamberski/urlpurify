import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractLoginfra = createQueryUnwrapper({
  hosts: 'cc.loginfra.com',
  path: '/cc',
  params: ['u'],
})

const extractSearchClick = createQueryUnwrapper({
  hosts: ['search.naver.com', 'm.search.naver.com'],
  path: '/p/crd/rd',
  params: ['u'],
})

// Naver outbound link redirect (cc.loginfra.com/cc?u=<target>) and search result click
// (search.naver.com/p/crd/rd?u=<target>, also on m.search.naver.com). Naver is a major Korean
// platform; the redirect only tracks the click.
export const unwrapNaverOutgoing = createUnwrapper({
  hosts: ['cc.loginfra.com', 'search.naver.com', 'm.search.naver.com'],
  unwrap: (url) => {
    return extractLoginfra(url) ?? extractSearchClick(url)
  },
})
