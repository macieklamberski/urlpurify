import { describe, expect, it } from 'bun:test'
import { unwrapUkgwa } from './ukgwa.js'

const unclaimedModifiers: Array<string> = ['id_', 'if_', 'fw_', 'oe_']

describe('unwrapUkgwa', () => {
  it('should extract target from a ukgwa snapshot', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/https://www.example.gov.uk/guidance/depot',
    )

    expect(unwrapUkgwa(url)).toBe('https://www.example.gov.uk/guidance/depot')
  })

  it('should extract target from a snapshot without the ukgwa segment', () => {
    const url = new URL(
      'http://webarchive.nationalarchives.gov.uk/20160704150527/http://www.example.org.uk/publications/year/2012',
    )

    expect(unwrapUkgwa(url)).toBe('http://www.example.org.uk/publications/year/2012')
  })

  it('should extract target from the latest snapshot', () => {
    const url = new URL(
      'http://webarchive.nationalarchives.gov.uk/+/http://www.example.gov.uk/legislation/page8901.html',
    )

    expect(unwrapUkgwa(url)).toBe('http://www.example.gov.uk/legislation/page8901.html')
  })

  it('should extract target from the latest snapshot under ukgwa', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.example.gov.uk/images/report.pdf',
    )

    expect(unwrapUkgwa(url)).toBe('http://www.example.gov.uk/images/report.pdf')
  })

  it('should extract target from a mp_ snapshot', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20160613091026mp_/https://www.example.org/files/2015/03/report.pdf',
    )

    expect(unwrapUkgwa(url)).toBe('https://www.example.org/files/2015/03/report.pdf')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/20170106081109/http://www.example.org.uk/resource/item.aspx?RID=44584',
    )

    expect(unwrapUkgwa(url)).toBe('http://www.example.org.uk/resource/item.aspx?RID=44584')
  })

  it('should keep the fragment of the target', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20200106145942mp_/http://www.example.gov.uk/Accounts/report.PDF#pdfjs.action=download',
    )

    expect(unwrapUkgwa(url)).toBe(
      'http://www.example.gov.uk/Accounts/report.PDF#pdfjs.action=download',
    )
  })

  it('should keep a percent escape of the target', () => {
    const url = new URL(
      'http://webarchive.nationalarchives.gov.uk/20130401151715/http://www.example.gov.uk/publications/DfES%200134%20200MIG469.pdf',
    )

    expect(unwrapUkgwa(url)).toBe(
      'http://www.example.gov.uk/publications/DfES%200134%20200MIG469.pdf',
    )
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL(
      'https://www.webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBe('https://www.example.gov.uk/')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/')

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/ftp://example.com/file',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/2022/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a timestamp shorter than 14 digits', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/202208281938/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a path with another segment before the timestamp', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/other/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it.each(unclaimedModifiers)('should return undefined for a %s snapshot', (modifier) => {
    const url = new URL(
      `https://webarchive.nationalarchives.gov.uk/ukgwa/20160613091026${modifier}/https://www.example.org/a`,
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for an image snapshot', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851im_/https://www.example.gov.uk/logo.png',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for the wildcard listing', () => {
    const url = new URL(
      'http://webarchive.nationalarchives.gov.uk/*/http://www.example.gov.uk/csv/data.csv',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a path with a prefix before the snapshot', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk/other/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for another path on the archive host', () => {
    const url = new URL('https://webarchive.nationalarchives.gov.uk/ukgwa/search/?q=example')

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for the main site of the same domain', () => {
    const url = new URL(
      'https://www.nationalarchives.gov.uk/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplewebarchive.nationalarchives.gov.uk/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains the archive host', () => {
    const url = new URL(
      'https://webarchive.nationalarchives.gov.uk.example.com/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(url)).toBeUndefined()
  })
})
