import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// An exact host: i.viglink.com serves the same root path as an impression beacon.
const unwrapRedirect = createQueryUnwrapper({
  hosts: 'redirect.viglink.com',
  path: '/',
  params: ['u', 'out'],
})

const unwrapClickApi = createQueryUnwrapper({
  hosts: ['api.viglink.com', 'apicdn.viglink.com', 'lwlink3.linkwithin.com'],
  path: '/api/click',
  params: ['out'],
})

// VigLink affiliate redirect (redirect.viglink.com/?u=<target> or ?out=<target>) and click api
// (api.viglink.com/api/click?out=<target>, also on apicdn.viglink.com and, through the LinkWithin
// widget, on lwlink3.linkwithin.com).
// The click query also carries `loc`, the page the link sat on, which is never the target.
export const unwrapViglink = createUnwrapper({
  hosts: [
    'redirect.viglink.com',
    'api.viglink.com',
    'apicdn.viglink.com',
    'lwlink3.linkwithin.com',
  ],
  unwrap: (url) => {
    return unwrapRedirect(url) ?? unwrapClickApi(url)
  },
})
