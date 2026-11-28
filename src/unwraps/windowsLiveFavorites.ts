import { createQueryUnwrapper } from '../utils.js'

// Windows Live Favorites bookmark form (favorites.live.com/quickadd.aspx?url=<target>), never the
// title= text.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapWindowsLiveFavorites = createQueryUnwrapper({
  hosts: 'favorites.live.com',
  path: '/quickadd.aspx',
  params: ['url'],
  ignoreLinkFragment: true,
})
