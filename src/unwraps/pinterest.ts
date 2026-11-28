import { createQueryUnwrapper } from '../utils.js'

// Pinterest outbound link shim (www.pinterest.com/offsite/?token=<token>&url=<target>, also with
// shatoken, and on its regional hosts). It answers 404 today, so unwrapping is the only way these
// links still work.
export const unwrapPinterest = createQueryUnwrapper({
  hosts: [
    'pinterest.com',
    'www.pinterest.com',
    'pinterest.co.uk',
    'www.pinterest.co.uk',
    'pinterest.com.au',
    'www.pinterest.com.au',
    'es.pinterest.com',
    'nl.pinterest.com',
    'pl.pinterest.com',
  ],
  path: '/offsite/',
  params: ['url'],
})
