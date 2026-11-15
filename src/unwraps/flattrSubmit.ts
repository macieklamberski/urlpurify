import { createParamExtractor } from '../utils.js'

// Flattr auto-submit button (flattr.com/submit/auto?user_id=<creator>&url=<page>&title=…), which
// registers the page as a thing to support for the creator. Opt-in: unwrapping returns the page,
// not the donation form.
export const unwrapFlattrSubmit = createParamExtractor({
  hosts: 'flattr.com',
  path: '/submit/auto',
  params: ['url'],
})
