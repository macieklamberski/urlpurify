import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// SalesforceIQ sales email click tracker (app.salesforceiq.com/r?target=<id>&t=<token>&url=<target>,
// also app-frankfurt.salesforceiq.com). Opt-in: unwrapping removes the sender's click count.
export const unwrapSalesforceiq: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['app.salesforceiq.com', 'app-frankfurt.salesforceiq.com'],
  path: '/r',
  params: ['url'],
})
