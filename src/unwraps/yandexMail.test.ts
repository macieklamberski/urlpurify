import { describe, expect, it } from 'bun:test'
import { unwrapYandexMail } from './yandexMail.js'

describe('unwrapYandexMail', () => {
  it('should extract target from mail.yandex.ru', () => {
    const value = new URL(
      'https://mail.yandex.ru/re.jsx?uid=77663793&c=LIZA&cv=24.12.1&mid=174795960537323187&h=a,cdhvPGk_XO3-eCkXCJGJpQ&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS9wb3N0',
    )
    const expected = 'http://www.example.com/post'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should extract an https target from mail.yandex.com', () => {
    const value = new URL(
      'https://mail.yandex.com/re.jsx?h=a,yyG7SKt1V3gKkwRJ1WtfkA&l=aHR0cHM6Ly92bS5leGFtcGxlLmNvbS9aU2VZWWR5QnAv',
    )
    const expected = 'https://vm.example.com/ZSeYYdyBp/'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should extract target when the l param comes first', () => {
    const value = new URL(
      'https://mail.yandex.ru/re.jsx?l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS9wb3N0&c=QUINN&cv=10.28.1&mid=172825635700353149',
    )
    const expected = 'http://www.example.com/post'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should extract a target encoded with url-safe characters', () => {
    const value = new URL(
      'https://mail.yandex.ru/re.jsx?uid=13380365&h=a,5SCK3QnKDxEypTCNgLoOHw&l=aHR0cHM6Ly9leGFtcGxlLmNvbS9zcGVjaWFsLnBocD9qPT8_Pg',
    )
    const expected = 'https://example.com/special.php?j=??>'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://mail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cHM6Ly9leGFtcGxlLmNvbS9wP3V0bV9zb3VyY2U9bmV3c2xldHRlciZ1dG1fbWVkaXVtPWVtYWlsI3RvcA',
    )
    const expected = 'https://example.com/p?utm_source=newsletter&utm_medium=email#top'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should extract a target with a non-ASCII character', () => {
    const value = new URL(
      'https://mail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cHM6Ly9leGFtcGxlLmNvbS_QvdC-0LLQvtGB0YLQuA',
    )
    const expected = 'https://example.com/новости'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should extract target on a country domain', () => {
    const value = new URL(
      'https://mail.yandex.com.tr/re.jsx?uid=1130000020931848&h=a,tP3pFeH9xZkeP3xmIiDBrQ&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should extract target on a country domain no specimen shows', () => {
    const value = new URL('https://mail.yandex.kz/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')
    const expected = 'http://www.example.com/'

    expect(unwrapYandexMail(value)).toBe(expected)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://mail.yandex.ru/for/example.com/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for the mail root', () => {
    const value = new URL('https://mail.yandex.ru/?l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined when the l param is missing', () => {
    const value = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined when the l param is empty', () => {
    const value = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz&l=')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined when the l param is not base64', () => {
    const value = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz&l=****')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined when the decoded value is not an http url', () => {
    const value = new URL('https://mail.yandex.ru/re.jsx?h=a,xyz&l=bWFpbHRvOnVzZXJAZXhhbXBsZS5jb20')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for another yandex host', () => {
    const value = new URL('https://disk.yandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for a subdomain of the mail host', () => {
    const value = new URL(
      'https://user.mail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://examplemail.yandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for a top-level domain longer than three letters', () => {
    const value = new URL(
      'https://mail.yandex.abcd/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for a look-alike of the mail host', () => {
    const value = new URL('https://mailxyandex.ru/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8')

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'https://mail.example.com/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the mail host', () => {
    const value = new URL(
      'https://mail.yandex.ru.example.com/re.jsx?h=a,xyz&l=aHR0cDovL3d3dy5leGFtcGxlLmNvbS8',
    )

    expect(unwrapYandexMail(value)).toBeUndefined()
  })
})
