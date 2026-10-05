import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/app\/reporting\/out\/[a-z0-9]+$/

const extractTarget = createParamExtractor({
  hosts: 'www.smore.com',
  params: ['u'],
})

// Smore newsletter click tracker (www.smore.com/app/reporting/out/<id>?u=<target>). Opt-in:
// unwrapping removes the sender's click count.
export const unwrapSmore: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
