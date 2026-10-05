import { describe, expect, it } from 'bun:test'
import { unwrapPipedrive } from './pipedrive.js'

describe('unwrapPipedrive', () => {
  it('should extract target from redirectUrl param', () => {
    const url = new URL(
      'https://5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4?redirectUrl=https%3A%2F%2Fexample.com%2Fpd2602&hash=liZDfRLYwomdvlrK1Pa8wP-qGpQUIuo1bVOXJuFnytc',
    )

    expect(unwrapPipedrive(url)).toBe('https://example.com/pd2602')
  })

  it('should return undefined when redirectUrl param is missing', () => {
    const url = new URL(
      'https://5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })

  it('should return undefined for another path on an account host', () => {
    const url = new URL(
      'https://5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email/o/zyrnq8mqz4?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })

  it('should return undefined for the path below another segment', () => {
    const url = new URL(
      'https://5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email/x/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })

  it('should return undefined for a nested path', () => {
    const url = new URL(
      'https://5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4/extra?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })

  it('should return undefined for a host without an account uuid', () => {
    const url = new URL(
      'https://www.pipedrive.email/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with an account host', () => {
    const url = new URL(
      'https://x5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with an account host', () => {
    const url = new URL(
      'https://5ae06f57-73d3-4314-974d-0bc34569e2bc.pipedrive.email.example.net/c/zyrnq8mqz4/j4n52p6e54/jkq3ewgw46/4?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPipedrive(url)).toBeUndefined()
  })
})
