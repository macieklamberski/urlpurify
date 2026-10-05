import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/pages/go', '/pages/go/']

const extractTarget = createParamExtractor({
  hosts: ['4pda.ru', '4pda.to'],
  params: ['u'],
})

// 4PDA forum outbound link redirect (4pda.ru/pages/go/?u=<target>, also 4pda.to/pages/go?u=).
export const unwrap4pda: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  return extractTarget(url)
}
