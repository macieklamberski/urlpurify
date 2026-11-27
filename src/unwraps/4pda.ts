import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const paths = ['/pages/go', '/pages/go/']

const hosts = ['4pda.ru', '4pda.to']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['u'],
})

// 4PDA forum outbound link redirect (4pda.ru/pages/go/?u=<target>, also 4pda.to/pages/go?u=).
export const unwrap4pda: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    return extractTarget(url)
  },
})
