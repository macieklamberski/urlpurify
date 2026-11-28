import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapVgWort } from './vgWort.js'

describe('unwrapVgWort', () => {
  it('should extract the target from the counting link', () => {
    const value = new URL(
      'https://vg01.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/wp-content/uploads/2019/10/report.pdf',
    )
    const expected = 'https://www.example.de/wp-content/uploads/2019/10/report.pdf'

    expect(unwrapVgWort(value)).toBe(expected)
  })

  it('should extract the target on the ssl host', () => {
    const value = new URL(
      'https://ssl-vg03.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https%3A%2F%2Fwww.example.de%2Fbuch.pdf',
    )
    const expected = 'https://www.example.de/buch.pdf'

    expect(unwrapVgWort(value)).toBe(expected)
  })

  it('should return undefined for the counting link without l', () => {
    const value = new URL('https://vg01.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f')

    expect(unwrapVgWort(value)).toBeUndefined()
  })

  it('should return undefined for the counting pixel path', () => {
    const value = new URL(
      'https://vg01.met.vgwort.de/pixel/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/',
    )

    expect(unwrapVgWort(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://vg01.met.vgwort.de.example.com/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/',
    )

    expect(unwrapVgWort(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the counting name', () => {
    const value = new URL(
      'https://xvg01.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/',
    )

    expect(unwrapVgWort(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapVgWort)).toBe(true)
  })
})
