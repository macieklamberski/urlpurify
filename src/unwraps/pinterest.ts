import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Pinterest outbound link shim (www.pinterest.com/offsite/?token=<token>&url=<target>, also with
// shatoken, and on its regional hosts). It answers 404 today, so unwrapping is the only way these
// links still work.
export const unwrapPinterest: UrlUnwrapper = createParamExtractor({
  hosts: [
    'www.pinterest.com',
    'pinterest.com',
    'www.pinterest.co.uk',
    'www.pinterest.com.au',
    'es.pinterest.com',
    'nl.pinterest.com',
    'pl.pinterest.com',
  ],
  path: '/offsite/',
  params: ['url'],
})
