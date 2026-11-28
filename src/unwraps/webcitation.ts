import { createQueryUnwrapper } from '../utils.js'

// `/query` looks a snapshot up by url and date, `/<id>` names one snapshot.
const pathRegex = /^\/(?:query|[0-9A-Za-z]{9})$/i

// WebCite archive snapshot (www.webcitation.org/query?url=<target>&date=<date>, or
// www.webcitation.org/<id>?url=<target>).
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapWebcitation = createQueryUnwrapper({
  hosts: ['webcitation.org', 'www.webcitation.org'],
  path: pathRegex,
  params: ['url'],
})
