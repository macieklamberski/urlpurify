import { createQueryUnwrapper } from '../utils.js'

// `/query` looks a snapshot up by url and date, `/<id>` names one snapshot.
const pathRegex = /^\/(?:query|[0-9A-Za-z]{9})$/i

// WebCite archive snapshot (www.webcitation.org/query?url=<target>&date=<date>, or
// www.webcitation.org/<id>?url=<target>). Not included in defaultUnwrappers: unwrapping returns
// the live page, which may have changed or be gone.
export const unwrapWebcitation = createQueryUnwrapper({
  hosts: ['www.webcitation.org'],
  path: pathRegex,
  params: ['url'],
})
