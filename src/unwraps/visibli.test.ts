import { describe, expect, it } from 'bun:test'
import { unwrapVisibli } from './visibli.js'

describe('unwrapVisibli', () => {
  it('should extract the target from the dst param', () => {
    const url = new URL(
      'http://magpiesrecipes.visibli.com/ea4317350a3a0acb/?web=ab25a6&dst=http%3A//www.example.com/2012/12/nankhatai-cookie.html',
    )

    expect(unwrapVisibli(url)).toBe('http://www.example.com/2012/12/nankhatai-cookie.html')
  })

  it('should return undefined when the dst param is missing', () => {
    const url = new URL('http://magpiesrecipes.visibli.com/ea4317350a3a0acb/?web=ab25a6')

    expect(unwrapVisibli(url)).toBeUndefined()
  })

  it('should return undefined for a path that is not a link id', () => {
    const url = new URL('http://magpiesrecipes.visibli.com/profile/?dst=http%3A//www.example.com/')

    expect(unwrapVisibli(url)).toBeUndefined()
  })
})
