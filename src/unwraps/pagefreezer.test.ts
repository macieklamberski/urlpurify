import { describe, expect, it } from 'bun:test'
import { unwrapPagefreezer } from './pagefreezer.js'

describe('unwrapPagefreezer', () => {
  it('should extract the target from a browse snapshot', () => {
    const url = new URL(
      'https://public3.pagefreezer.com/browse/HHS.gov/16-09-2020T14:35/https://www.example.gov/opioids/treatment/guide.html',
    )

    expect(unwrapPagefreezer(url)).toBe('https://www.example.gov/opioids/treatment/guide.html')
  })

  it('should extract the target from a content snapshot', () => {
    const url = new URL(
      'https://public4.pagefreezer.com/content/FDA/20-02-2024T15:13/https://www.example.gov/medical-devices/safety.pdf',
    )

    expect(unwrapPagefreezer(url)).toBe('https://www.example.gov/medical-devices/safety.pdf')
  })

  it('should keep the query and fragment of a path target', () => {
    const url = new URL(
      'https://public3.pagefreezer.com/browse/HHS.gov/02-01-2024T03:56/https://www.example.gov/news.html?page=2#top',
    )

    expect(unwrapPagefreezer(url)).toBe('https://www.example.gov/news.html?page=2#top')
  })

  it('should extract the target from the web archive browser', () => {
    const url = new URL(
      'https://us.pagefreezer.com/en-US/wa/browse/0a7f82bb-be6e-448a-ae11-373d22c37842?find-by-timestamp=2025-01-02T05:49:59Z&url=https:%2F%2Fwww.example.gov%2Fabout%2Fnews%2F2024%2F06%2F25%2Freport.html',
    )

    expect(unwrapPagefreezer(url)).toBe('https://www.example.gov/about/news/2024/06/25/report.html')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://us.pagefreezer.com/en-US/wa/browse/0a7f82bb-be6e-448a-ae11-373d22c37842?find-by-timestamp=2025-01-02T05:49:59Z&url=https://example.org/search/a+b',
    )

    expect(unwrapPagefreezer(url)).toBe('https://example.org/search/a+b')
  })

  it('should return undefined for a path snapshot with no target', () => {
    const url = new URL('https://public3.pagefreezer.com/browse/HHS.gov/16-09-2020T14:35/')

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for a non-http path target', () => {
    const url = new URL(
      'https://public3.pagefreezer.com/browse/HHS.gov/16-09-2020T14:35/ftp://example.gov/file.txt',
    )

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for a path with a year instead of the capture time', () => {
    const url = new URL(
      'https://public3.pagefreezer.com/browse/HHS.gov/2020/https://www.example.gov/',
    )

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for the web archive browser path on another host', () => {
    const url = new URL(
      'https://example.com/en-US/wa/browse/0a7f82bb-be6e-448a-ae11-373d22c37842?url=https%3A%2F%2Fwww.example.gov%2F',
    )

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for a path without the capture time', () => {
    const url = new URL('https://public3.pagefreezer.com/browse/HHS.gov/https://www.example.gov/')

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for the web archive browser without url', () => {
    const url = new URL(
      'https://us.pagefreezer.com/en-US/wa/browse/0a7f82bb-be6e-448a-ae11-373d22c37842?find-by-timestamp=2025-01-02T05:49:59Z',
    )

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for another path on the browser host', () => {
    const url = new URL('https://us.pagefreezer.com/en-US/pricing?url=https://www.example.gov/')

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike public host', () => {
    const url = new URL(
      'https://public3.pagefreezer.com.example.com/browse/HHS.gov/16-09-2020T14:35/https://www.example.gov/',
    )

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the public name', () => {
    const url = new URL(
      'https://xpublic3.pagefreezer.com/browse/HHS.gov/16-09-2020T14:35/https://www.example.gov/',
    )

    expect(unwrapPagefreezer(url)).toBeUndefined()
  })
})
