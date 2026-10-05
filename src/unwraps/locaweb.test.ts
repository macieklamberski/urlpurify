import { describe, expect, it } from 'bun:test'
import { unwrapLocaweb } from './locaweb.js'

describe('unwrapLocaweb', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://sinait.example.net/registra_clique.php?id=H%7C871925%7C266422%7C21109&url=https%3A%2F%2Fwww.example.org%2Fdocs%2Fpdc-791_17.pdf',
    )

    expect(unwrapLocaweb(url)).toBe('https://www.example.org/docs/pdc-791_17.pdf')
  })

  it('should extract target with an unencoded id', () => {
    const url = new URL(
      'http://grupocasa.example.com.br/registra_clique.php?id=H|838452|248135|58093&url=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLocaweb(url)).toBe('http://www.example.com/')
  })

  it('should extract target from a test send', () => {
    const url = new URL(
      'http://blog.example.net/registra_clique.php?id=TH|teste|139443|7101&url=http%3A%2F%2Fwww.example.org%2Finformativos%2F',
    )

    expect(unwrapLocaweb(url)).toBe('http://www.example.org/informativos/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://newsletter.example.com.br/registra_clique.php?id=H%7c23882319%7c281061%7c123&url=http://www.example.com/bahia/2014/',
    )

    expect(unwrapLocaweb(url)).toBe('http://www.example.com/bahia/2014/')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://newsletter.example.com.br/registra_clique.php?id=H%7C23882319%7C281061%7C123&url=https://www.example.com/search/a+b',
    )

    expect(unwrapLocaweb(url)).toBe('https://www.example.com/search/a+b')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL(
      'http://sinait.example.net/registra_clique.php?id=H%7C871925%7C266422%7C21109',
    )

    expect(unwrapLocaweb(url)).toBeUndefined()
  })

  it('should return undefined for a non-http url', () => {
    const url = new URL(
      'http://sinait.example.net/registra_clique.php?id=H%7C871925%7C266422%7C21109&url=mailto%3Ainfo%40example.org',
    )

    expect(unwrapLocaweb(url)).toBeUndefined()
  })

  it('should return undefined without id', () => {
    const url = new URL(
      'http://sinait.example.net/registra_clique.php?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLocaweb(url)).toBeUndefined()
  })

  it('should return undefined for another id shape', () => {
    const url = new URL(
      'http://sinait.example.net/registra_clique.php?id=12345&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLocaweb(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'http://sinait.example.net/ver_mensagem.php?id=H%7C871925%7C266422%7C21109&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLocaweb(url)).toBeUndefined()
  })
})
