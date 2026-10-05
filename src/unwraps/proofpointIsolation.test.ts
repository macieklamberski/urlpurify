import { describe, expect, it } from 'bun:test'
import { unwrapProofpointIsolation } from './proofpointIsolation.js'

describe('unwrapProofpointIsolation', () => {
  it('should extract the target from the isolation link', () => {
    const url = new URL(
      'https://urlisolation.com/browser?clickId=8D1C2AD6-48BC-4CD1-9C8E-6C268CE1DE39&traceToken=1744229457%3Bhyatt_hosted2%3Bhttps%3A%2Fwww.example.com%2Flifestyle&url=https%3A%2F%2Fwww.example.com%2Flifestyle%2Fbest-new-hotels%2F%23unitedstates',
    )

    expect(unwrapProofpointIsolation(url)).toBe(
      'https://www.example.com/lifestyle/best-new-hotels/#unitedstates',
    )
  })

  it('should return undefined for the isolation link without url', () => {
    const url = new URL(
      'https://urlisolation.com/browser?clickId=8D1C2AD6-48BC-4CD1-9C8E-6C268CE1DE39&traceToken=1744229457%3Bhyatt_hosted2',
    )

    expect(unwrapProofpointIsolation(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://urlisolation.com/?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapProofpointIsolation(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/browser?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapProofpointIsolation(url)).toBeUndefined()
  })
})
