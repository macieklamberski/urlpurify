import { describe, expect, it } from 'bun:test'
import { unwrapVgWort } from './vgWort.js'

describe('unwrapVgWort', () => {
  it('should extract the target from the counting link', () => {
    const url = new URL(
      'https://vg01.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/wp-content/uploads/2019/10/report.pdf',
    )

    expect(unwrapVgWort(url)).toBe('https://www.example.de/wp-content/uploads/2019/10/report.pdf')
  })

  it('should extract the target on the ssl host', () => {
    const url = new URL(
      'https://ssl-vg03.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https%3A%2F%2Fwww.example.de%2Fbuch.pdf',
    )

    expect(unwrapVgWort(url)).toBe('https://www.example.de/buch.pdf')
  })

  it('should return undefined for the counting link without l', () => {
    const url = new URL('https://vg01.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f')

    expect(unwrapVgWort(url)).toBeUndefined()
  })

  it('should return undefined for the counting pixel path', () => {
    const url = new URL(
      'https://vg01.met.vgwort.de/pixel/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/',
    )

    expect(unwrapVgWort(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://vg01.met.vgwort.de.example.com/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/',
    )

    expect(unwrapVgWort(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the counting name', () => {
    const url = new URL(
      'https://xvg01.met.vgwort.de/na/054f441fd57c4ba0b8f02e982d9b7b8f?l=https://www.example.de/',
    )

    expect(unwrapVgWort(url)).toBeUndefined()
  })
})
