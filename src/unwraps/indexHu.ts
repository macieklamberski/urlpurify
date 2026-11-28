import { isAnyOf } from 'trousse'
import { createQueryUnwrapper, createUnwrapper, readParamTarget } from '../utils.js'

const sectionParamRegex = /^index_[a-z]+_cikklink$/

const counterHosts = ['dex.hu', 'www.dex.hu', 'index.hu', 'www.index.hu', 'vakbarat.index.hu']

const extractCounter = createQueryUnwrapper({
  hosts: counterHosts,
  path: '/x.php',
  params: ['url'],
})

const extractSectionCounter = createUnwrapper({
  hosts: ['dex.hu', 'www.dex.hu', 'index.hu', 'www.index.hu'],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/x')) {
      return
    }

    for (const key of url.searchParams.keys()) {
      if (!sectionParamRegex.test(key)) {
        continue
      }

      const target = readParamTarget(url, key)

      if (target) {
        return target
      }
    }
  },
})

// Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=<id>&url=<target>), on dex.hu,
// index.hu and vakbarat.index.hu, and the section counter on dex.hu and index.hu that names the
// param after the section (index.hu/x?index_<section>_cikklink=<target>).
// Opt-in: unwrapping removes the site's count of which links get clicked.
export const unwrapIndexHu = createUnwrapper({
  hosts: counterHosts,
  unwrap: (url) => {
    return extractCounter(url) ?? extractSectionCounter(url)
  },
})
