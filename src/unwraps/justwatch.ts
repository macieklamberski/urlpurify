import { createParamExtractor } from '../utils.js'

// JustWatch provider click (click.justwatch.com/a?r=<target>&cx=<context>, also e.justwatch.com).
// Not included in defaultUnwrappers: a referral click to a streaming provider, which may carry
// JustWatch's own affiliate tags.
export const unwrapJustwatch = createParamExtractor({
  hosts: ['click.justwatch.com', 'e.justwatch.com'],
  path: '/a',
  params: ['r'],
})
