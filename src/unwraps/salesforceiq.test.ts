import { describe, expect, it } from 'bun:test'
import { unwrapSalesforceiq } from './salesforceiq.js'

describe('unwrapSalesforceiq', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://app.salesforceiq.com/r?target=62055fd1dadaad28c263a031&t=AFwhZf1CdBJv8pHBs4tBWzZRe6FPPexNFE4sP9C7pn_qLOdXdixVlRufHu2RVARUXFZQhQxd&url=https%3A%2F%2Fwww.example.com%2Fon-demand%3Fid%3D5b6ec32996015965c735',
    )

    expect(unwrapSalesforceiq(url)).toBe(
      'https://www.example.com/on-demand?id=5b6ec32996015965c735',
    )
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://app.salesforceiq.com/r?target=62055fd1dadaad28c263a031&t=AFwhZf1C')

    expect(unwrapSalesforceiq(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://app.salesforceiq.com/o?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSalesforceiq(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/r?url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapSalesforceiq(url)).toBeUndefined()
  })
})
