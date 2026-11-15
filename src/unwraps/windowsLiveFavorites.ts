import { createParamExtractor } from '../utils.js'

// Windows Live Favorites bookmark form (favorites.live.com/quickadd.aspx?url=<target>), never the
// title= text. Opt-in: unwrapping returns the bookmarked page, not the form that saved it.
export const unwrapWindowsLiveFavorites = createParamExtractor({
  hosts: 'favorites.live.com',
  path: '/quickadd.aspx',
  params: ['url'],
})
