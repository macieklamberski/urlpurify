import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Glue Up association CRM email click tracker
// (<organization>.glueup.com/track/rd?tracking_id=<id>&redirect_url=<target>&ts=<n>&ps=<signature>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapGlueUp: UrlUnwrapper = createParamExtractor({
  hosts: [
    'app.glueup.com',
    'esp-pathology.glueup.com',
    'lgbtgreat-members.glueup.com',
    'sasma.glueup.com',
    'satsa.glueup.com',
    'sspi.glueup.com',
  ],
  path: '/track/rd',
  params: ['redirect_url'],
})
