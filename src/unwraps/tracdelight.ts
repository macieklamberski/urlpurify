import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Links written without the `?` carry their params in the path.
const pathLinkRegex = /^\/cl\/aaid=.*?&link=(.+)$/

const extractQueryLink = createParamExtractor({
  hosts: 'td.oo34.net',
  path: '/cl/',
  params: ['link'],
})

// tracdelight affiliate click (td.oo34.net/cl/?tt=slg&aaid=<id>&paid=<id>&link=<target>), also
// written without the `?` (td.oo34.net/cl/aaid=<id>&paid=<id>&link=<target>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapTracdelight: UrlUnwrapper = (url) => {
  const target = extractQueryLink(url)

  if (target) {
    return target
  }

  if (url.hostname !== 'td.oo34.net') {
    return
  }

  const match = pathLinkRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
