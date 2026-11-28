import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/allez\/[\w-]+$/i

// Stay22 affiliate redirect (www.stay22.com/allez/<provider>?link=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapStay22 = createQueryUnwrapper({
  hosts: 'www.stay22.com',
  path: pathRegex,
  params: ['link'],
})
