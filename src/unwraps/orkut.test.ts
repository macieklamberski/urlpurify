import { describe, expect, it } from 'bun:test'
import { unwrapOrkut } from './orkut.js'

describe('unwrapOrkut', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'http://www.orkut.com.br/Interstitial?u=http://www.example.com/rio-de-janeiro/noticias-20110222.html&t=APk-QehbzWqv0UwvzpSE6FXbzeVR8vG1yRVF6BHPOhTLLepkcou6qJpV89btnA5JBcIcq4CgFTjFWubyjMexdr4Egu0z4qwcLwAAAAAAAAAA',
    )

    expect(unwrapOrkut(url)).toBe('http://www.example.com/rio-de-janeiro/noticias-20110222.html')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('http://www.orkut.com/Interstitial?t=AFzE5zO5giyvlftmJLIubN2J')

    expect(unwrapOrkut(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('http://www.orkut.com/RedirLogin.aspx?u=http://www.example.com/')

    expect(unwrapOrkut(url)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const url = new URL('http://www.example.com/Interstitial?u=http://www.example.org/')

    expect(unwrapOrkut(url)).toBeUndefined()
  })
})
