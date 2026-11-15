import { createParamExtractor } from '../utils.js'

// StumbleUpon share (stumbleupon.com/submit?url=<target>, on www. and bare stumbleupon.com), which
// redirects to Mix's share form. Opt-in: unwrapping returns the shared page, not the form.
export const unwrapStumbleuponSubmit = createParamExtractor({
  hosts: ['www.stumbleupon.com', 'stumbleupon.com'],
  path: '/submit',
  params: ['url'],
})
