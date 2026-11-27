import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// `/query` looks a snapshot up by url and date, `/<id>` names one snapshot.
const pathRegex = /^\/(?:query|[0-9A-Za-z]{9})$/i

const hosts = ['www.webcitation.org']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// WebCite archive snapshot (www.webcitation.org/query?url=<target>&date=<date>, or
// www.webcitation.org/<id>?url=<target>). Not included in defaultUnwrappers: unwrapping returns
// the live page, which may have changed or be gone.
export const unwrapWebcitation = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
