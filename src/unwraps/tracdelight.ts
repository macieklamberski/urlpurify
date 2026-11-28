import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// Links written without the `?` carry their params in the path.
const pathLinkRegex = /^\/cl\/aaid=.*?&link=(?<target>.+)$/i

const hosts = ['td.oo34.net']

const extractQueryLink = createQueryUnwrapper({
  hosts,
  path: '/cl/',
  params: ['link'],
})

// tracdelight affiliate click (td.oo34.net/cl/?tt=slg&aaid=<id>&paid=<id>&link=<target>), also
// written without the `?` (td.oo34.net/cl/aaid=<id>&paid=<id>&link=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapTracdelight = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const target = extractQueryLink(url)

    if (target) {
      return target
    }

    const match = pathLinkRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return resolvePathTarget(url, match.groups.target)
  },
})
