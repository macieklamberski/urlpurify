import { describe, expect, it } from 'bun:test'
import { unwrapYandexMail } from './yandexMail.js'

describe('unwrapYandexMail', () => {
  it('should extract target from mail.yandex.ru', () => {
    const url = new URL(
      'https://mail.yandex.ru/re.jsx?uid=77663793&c=LIZA&cv=24.12.1&mid=174795960537323187&h=a,cdhvPGk_XO3-eCkXCJGJpQ&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS9wb3N0',
    )

    expect(unwrapYandexMail(url)).toBe('http://www.example.com/post')
  })

  it('should extract an https target from mail.yandex.com', () => {
    const url = new URL(
      'https://mail.yandex.com/re.jsx?h=a,yyG7SKt1V3gKkwRJ1WtfkA&l=aHR0cHM6Ly92bS5leGFtcGxlLmNvbS9aU2VZWWR5QnAv',
    )

    expect(unwrapYandexMail(url)).toBe('https://vm.example.com/ZSeYYdyBp/')
  })

  it('should extract target when the l param comes first', () => {
    const url = new URL(
      'https://mail.yandex.ru/re.jsx?l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS9wb3N0&c=QUINN&cv=10.28.1&mid=172825635700353149',
    )

    expect(unwrapYandexMail(url)).toBe('http://www.example.com/post')
  })

  it('should extract a target encoded with url-safe characters', () => {
    const url = new URL(
      'https://mail.yandex.ru/re.jsx?uid=13380365&h=a,5SCK3QnKDxEypTCNgLoOHw&l=aHR0cHM6Ly9leGFtcGxlLmNvbS9zcGVjaWFsLnBocD9qPT8_Pg',
    )

    expect(unwrapYandexMail(url)).toBe('https://example.com/special.php?j=??>')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://mail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cHM6Ly9leGFtcGxlLmNvbS9wP3V0bV9zb3VyY2U9bmV3c2xldHRlciZ1dG1fbWVkaXVtPWVtYWlsI3RvcA',
    )

    expect(unwrapYandexMail(url)).toBe(
      'https://example.com/p?utm_source=newsletter&utm_medium=email#top',
    )
  })

  it('should extract a target with a non-ASCII character', () => {
    const url = new URL(
      'https://mail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cHM6Ly9leGFtcGxlLmNvbS_QvdC-0LLQvtGB0YLQuA',
    )

    expect(unwrapYandexMail(url)).toBe('https://example.com/новости')
  })

  it('should extract target on a country domain', () => {
    const url = new URL(
      'https://mail.yandex.com.tr/re.jsx?uid=1130000020931848&h=a,tP3pFeH9xZkeP3xmIiDBrQ&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(url)).toBe('http://www.example.com/')
  })

  it('should extract target on a country domain no specimen shows', () => {
    const url = new URL('https://mail.yandex.kz/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(url)).toBe('http://www.example.com/')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://mail.yandex.ru/for/example.com/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined for the mail root', () => {
    const url = new URL('https://mail.yandex.ru/?l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined when the l param is missing', () => {
    const url = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined when the l param is empty', () => {
    const url = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz&l=')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined when the l param is not base64', () => {
    const url = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz&l=****')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined when the decoded value is not an http url', () => {
    const url = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz&l=bWFpbHRvOnVzZXJAZXhhbXBsZS5jb20')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined for another yandex host', () => {
    const url = new URL('https://disk.yandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should extract target on a subdomain of the mail host', () => {
    const url = new URL(
      'https://user.mail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(url)).toBe('http://www.example.com/')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplemail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined for a top-level domain longer than three letters', () => {
    const url = new URL('https://mail.yandex.abcd/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined for a look-alike of the mail host', () => {
    const url = new URL('https://mailxyandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://mail.example.com/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the mail host', () => {
    const url = new URL(
      'https://mail.yandex.ru.example.com/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(url)).toBeUndefined()
  })
})
