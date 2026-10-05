import { describe, expect, it } from 'bun:test'
import { unwrapTrendMicro } from './trendMicro.js'

describe('unwrapTrendMicro', () => {
  it('should extract target encoded with lowercase escapes', () => {
    const url = new URL(
      'https://ddec1-0-en-ctp.trendmicro.com/wis/clicktime/v1/query?url=https%3a%2f%2fwww.example.com%2fcape%2dcoral%2fproject&umid=37126af7-dc02-4d54-a3d2-bc588b31b67b&auth=e8a1',
    )

    expect(unwrapTrendMicro(url)).toBe('https://www.example.com/cape-coral/project')
  })

  it('should extract a plain target', () => {
    const url = new URL(
      'https://hes32-ctp.trendmicro.com/wis/clicktime/v1/query?url=https://example.com/store&umid=72c1d878-4329-42e7-aa06-e2b8b9179e57&auth=b9aa05b4ce1a6a17a2c0c7e98e5954c76104f8ce-4e594097c76c9f4b92d27577441894699a5dfbb6',
    )

    expect(unwrapTrendMicro(url)).toBe('https://example.com/store')
  })

  it('should extract target on an urlprotect host', () => {
    const url = new URL(
      'https://cas5-0-urlprotect.trendmicro.com/wis/clicktime/v1/query?url=https%3a%2f%2fexample.com%2fevent&umid=2a1f0c3e-7b8d-4c55-9e0f-0a1b2c3d4e5f&rct=1700000000&auth=d0c4',
    )

    expect(unwrapTrendMicro(url)).toBe('https://example.com/event')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://smex-ctp.trendmicro.com/wis/clicktime/v1/query?url=https%3a%2f%2fexample.com%2fstarthere.jsp%3fei%3d1652015%26tp%5fkey%3dabc&umid=582fc2ef-1111-2222-3333-444455556666&auth=f1e2',
    )

    expect(unwrapTrendMicro(url)).toBe('https://example.com/starthere.jsp?ei=1652015&tp_key=abc')
  })

  it('should extract target encoded twice', () => {
    const url = new URL(
      'https://smex-ctp.trendmicro.com/wis/clicktime/v1/query?url=https%253a%252f%252fexample.com%252fpage&umid=582fc2ef&auth=f1e2',
    )

    expect(unwrapTrendMicro(url)).toBe('https://example.com/page')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://smex-ctp.trendmicro.com/wis/clicktime/v1/query?umid=x&auth=y')

    expect(unwrapTrendMicro(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://smex-ctp.trendmicro.com/wis/clicktime/v1/query?url=&umid=x')

    expect(unwrapTrendMicro(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://smex-ctp.trendmicro.com/wis/clicktime/v1/report?url=https%3a%2f%2fexample.com%2f',
    )

    expect(unwrapTrendMicro(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/wis/clicktime/v1/query?url=https%3a%2f%2fexample.org%2f',
    )

    expect(unwrapTrendMicro(url)).toBeUndefined()
  })
})
