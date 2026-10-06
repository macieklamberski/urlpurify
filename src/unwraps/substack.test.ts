import { describe, expect, it } from 'bun:test'
import { unwrapSubstack } from './substack.js'

const payload =
  'eyJlIjoiaHR0cHM6Ly9leGFtcGxlLnN1YnN0YWNrLmNvbS9wL2xlYWRpbmctdGVhbXM_dXRtX2NhbXBhaWduPWVtYWlsLXBvc3Qmcj1hYmMxMjMiLCJwIjoxLCJzIjoxLCJmIjp0cnVlLCJ1IjoxLCJpYXQiOjE3Nzk3OTQwODYsImV4cCI6MjA5NTM3MDA4NiwiaXNzIjoicHViLTAiLCJzdWIiOiJsaW5rLXJlZGlyZWN0In0'
const unclaimedPaths: Array<string> = [
  `/p/post/redirect/2/${payload}.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ`,
  `/redirect/2/${payload}.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ/more`,
  `/redirect/2/${payload}`,
  `/redirect/3/${payload}.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ`,
]

describe('unwrapSubstack', () => {
  it('should extract target from the e field of the payload', () => {
    const url = new URL(
      `https://substack.com/redirect/2/${payload}.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ?`,
    )

    expect(unwrapSubstack(url)).toBe(
      'https://example.substack.com/p/leading-teams?utm_campaign=email-post&r=abc123',
    )
  })

  it('should return undefined for a non-http e field', () => {
    const url = new URL(
      'https://substack.com/redirect/2/eyJlIjoibWFpbHRvOmVkaXRvckBleGFtcGxlLmNvbSIsInAiOjEsImlzcyI6InB1Yi0wIiwic3ViIjoibGluay1yZWRpcmVjdCJ9.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ',
    )

    expect(unwrapSubstack(url)).toBeUndefined()
  })

  it('should return undefined when the payload has no e field', () => {
    const url = new URL(
      'https://substack.com/redirect/2/eyJwIjoxLCJpc3MiOiJwdWItMCIsInN1YiI6ImxpbmstcmVkaXJlY3QifQ.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ',
    )

    expect(unwrapSubstack(url)).toBeUndefined()
  })

  it('should return undefined when the payload is not JSON', () => {
    const url = new URL(
      'https://substack.com/redirect/2/aHR0cHM6Ly9leGFtcGxlLmNvbS8.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ',
    )

    expect(unwrapSubstack(url)).toBeUndefined()
  })

  it('should return undefined for the id redirect', () => {
    const url = new URL(
      'https://substack.com/redirect/7d3a7d5c-2f2e-4a35-9a6b-4f6d0d6c3e7b?j=eyJ1IjoiMWJjZGVmIn0',
    )

    expect(unwrapSubstack(url)).toBeUndefined()
  })

  it('should return undefined for the payload on another path', () => {
    const url = new URL(
      `https://substack.com/api/v1/${payload}.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ`,
    )

    expect(unwrapSubstack(url)).toBeUndefined()
  })

  it.each(unclaimedPaths)('should return undefined for path %s', (path) => {
    const url = new URL(`https://substack.com${path}`)

    expect(unwrapSubstack(url)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const url = new URL(
      `https://www.example.com/redirect/2/${payload}.boTvkXxD1YyQj5AE-vQ99eFrlRv8o1k11cm2mcsnzRQ`,
    )

    expect(unwrapSubstack(url)).toBeUndefined()
  })
})
