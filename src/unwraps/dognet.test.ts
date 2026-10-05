import { describe, expect, it } from 'bun:test'
import { unwrapDognet } from './dognet.js'

describe('unwrapDognet', () => {
  it('should extract a plain target from url param', () => {
    const url = new URL(
      'https://go.dognet.com/?chid=Kg5YxNHo&url=https://www.example.com/autori/126444-tomas-galierik.html',
    )

    expect(unwrapDognet(url)).toBe('https://www.example.com/autori/126444-tomas-galierik.html')
  })

  it('should extract a percent-encoded target from url param', () => {
    const url = new URL(
      'https://go.dognet.com/?chid=bZ3spcll&d1=otthon&url=https%3A%2F%2Fwww.example.com%2Fipl-szortelenito-gep',
    )

    expect(unwrapDognet(url)).toBe('https://www.example.com/ipl-szortelenito-gep')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://go.dognet.com/?chid=Kg5YxNHo')

    expect(unwrapDognet(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Dognet host', () => {
    const url = new URL(
      'https://go.dognet.com/banner?chid=Kg5YxNHo&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDognet(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?chid=Kg5YxNHo&url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapDognet(url)).toBeUndefined()
  })
})
