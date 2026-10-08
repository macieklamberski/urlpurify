import { describe, expect, it } from 'bun:test'
import { unwrapMail2easy } from './mail2easy.js'

describe('unwrapMail2easy', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://d-click.spcbrasil.com.br/u/3971/2429/177699/4935_0/ca4da/?url=http%3A%2F%2Fwww.example.com.br%2F&utm_source=mail2easy&utm_medium=e-mail',
    )

    expect(unwrapMail2easy(url)).toBe('http://www.example.com.br/')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'http://d-click.example.com/u/3971/2429/177699/4935_0/ca4da/?url=https%253A%252F%252Fexample.org%252Fpage&utm_source=mail2easy&utm_medium=e-mail',
    )

    expect(unwrapMail2easy(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://d-click.example.com/u/3971/2429/177699/4935_0/ca4da/?url=https://example.org/search/a+b&utm_source=mail2easy&utm_medium=e-mail',
    )

    expect(unwrapMail2easy(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://d-click.eccopress.com.br/u/13902/972/41649/945_0/f19be/?url=https://www.example.com.br/cursos',
    )

    expect(unwrapMail2easy(url)).toBe('https://www.example.com.br/cursos')
  })

  it('should extract target from a link id without the suffix', () => {
    const url = new URL(
      'http://d-click.artenaescola.org.br/u/3806/88/12859/525/d0a72/?url=http://www.example.org.br/ecoart/&utm_source=mail2easy',
    )

    expect(unwrapMail2easy(url)).toBe('http://www.example.org.br/ecoart/')
  })

  it('should extract target from a path without the hash', () => {
    const url = new URL(
      'http://d-click.artenaescola.org.br/u/3806/62/12859/314/?url=http://www.example.org.br/sala_galeria.php&utm_source=mail2easy',
    )

    expect(unwrapMail2easy(url)).toBe('http://www.example.org.br/sala_galeria.php')
  })

  it('should return undefined for a shorter path on a d-click host', () => {
    const url = new URL(
      'http://d-click.spcbrasil.com.br/u/3971/2429/?url=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMail2easy(url)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const url = new URL(
      'http://d-click.spcbrasil.com.br/x/u/3971/2429/177699/4935_0/ca4da/?url=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMail2easy(url)).toBeUndefined()
  })

  it('should return undefined for the path on a host without the d-click label', () => {
    const url = new URL(
      'http://click.example.com.br/u/3971/2429/177699/4935_0/ca4da/?url=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMail2easy(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains the d-click label', () => {
    const url = new URL(
      'http://www.d-click.example.com.br/u/3971/2429/177699/4935_0/ca4da/?url=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMail2easy(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://d-click.spcbrasil.com.br/u/3971/2429/177699/4935_0/ca4da/?url=javascript%3Aalert(1)',
    )

    expect(unwrapMail2easy(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://d-click.spcbrasil.com.br/u/3971/2429/177699/4935_0/ca4da/')

    expect(unwrapMail2easy(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('http://d-click.spcbrasil.com.br/u/3971/2429/177699/4935_0/ca4da/?url=')

    expect(unwrapMail2easy(url)).toBeUndefined()
  })
})
