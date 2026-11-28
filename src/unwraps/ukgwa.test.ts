import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapUkgwa } from './ukgwa.js'

const unclaimedModifiers: Array<string> = ['id_', 'if_', 'fw_', 'oe_']

describe('unwrapUkgwa', () => {
  it('should repair a target the CMS spaced after its scheme', () => {
    const value =
      'https://webarchive.nationalarchives.gov.uk/20200101000000/http://%20https://www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapUkgwa] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://webarchive.nationalarchives.gov.uk/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapUkgwa] })).toBe(expected)
  })

  it('should extract target from a ukgwa snapshot', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/https://www.example.gov.uk/guidance/depot',
    )
    const expected = 'https://www.example.gov.uk/guidance/depot'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should extract target from a snapshot without the ukgwa segment', () => {
    const value = new URL(
      'http://webarchive.nationalarchives.gov.uk/20160704150527/http://www.example.org.uk/publications/year/2012',
    )
    const expected = 'http://www.example.org.uk/publications/year/2012'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should extract target from the latest snapshot', () => {
    const value = new URL(
      'http://webarchive.nationalarchives.gov.uk/+/http://www.example.gov.uk/legislation/page8901.html',
    )
    const expected = 'http://www.example.gov.uk/legislation/page8901.html'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should extract target from the latest snapshot under ukgwa', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.example.gov.uk/images/report.pdf',
    )
    const expected = 'http://www.example.gov.uk/images/report.pdf'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should extract target from a mp_ snapshot', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20160613091026mp_/https://www.example.org/files/2015/03/report.pdf',
    )
    const expected = 'https://www.example.org/files/2015/03/report.pdf'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/20170106081109/http://www.example.org.uk/resource/item.aspx?RID=44584',
    )
    const expected = 'http://www.example.org.uk/resource/item.aspx?RID=44584'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should keep the fragment of the target', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20200106145942mp_/http://www.example.gov.uk/Accounts/report.PDF#pdfjs.action=download',
    )
    const expected = 'http://www.example.gov.uk/Accounts/report.PDF#pdfjs.action=download'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should keep a percent escape of the target', () => {
    const value = new URL(
      'http://webarchive.nationalarchives.gov.uk/20130401151715/http://www.example.gov.uk/publications/DfES%200134%20200MIG469.pdf',
    )
    const expected = 'http://www.example.gov.uk/publications/DfES%200134%20200MIG469.pdf'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should add the http scheme to a snapshot target stored without one', () => {
    const value = new URL(
      'http://webarchive.nationalarchives.gov.uk/20100421074139/example.gov.uk/propriety_and_ethics/civil_service/election_guidance.aspx',
    )
    const expected =
      'http://example.gov.uk/propriety_and_ethics/civil_service/election_guidance.aspx'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should add the http scheme to a latest snapshot target stored without one', () => {
    const value = new URL(
      'http://webarchive.nationalarchives.gov.uk/+/www.example.gov.uk/assetRoot/04/14/31/67/04143167.pdf',
    )
    const expected = 'http://www.example.gov.uk/assetRoot/04/14/31/67/04143167.pdf'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should add the http scheme to a ukgwa snapshot target stored without one', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20121026065214/www.example.uk/NR/rdonlyres/0/sdr1998_complete.pdf',
    )
    const expected = 'http://www.example.uk/NR/rdonlyres/0/sdr1998_complete.pdf'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/')

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value =
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851/ftp://example.com/file'

    expect(purifyUrl(value, { unwrappers: [unwrapUkgwa] })).toBe(value)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/2022/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for a timestamp shorter than 14 digits', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/202208281938/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for a path with another segment before the timestamp', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/other/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it.each(unclaimedModifiers)('should return undefined for a %s snapshot', (modifier) => {
    const value = new URL(
      `https://webarchive.nationalarchives.gov.uk/ukgwa/20160613091026${modifier}/https://www.example.org/a`,
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for an image snapshot', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20220828193851im_/https://www.example.gov.uk/logo.png',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for the wildcard listing', () => {
    const value = new URL(
      'http://webarchive.nationalarchives.gov.uk/*/http://www.example.gov.uk/csv/data.csv',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for a path with a prefix before the snapshot', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/other/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for another path on the archive host', () => {
    const value = new URL('https://webarchive.nationalarchives.gov.uk/ukgwa/search/?q=example')

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should return undefined for the main site of the same domain', () => {
    const value = new URL(
      'https://www.nationalarchives.gov.uk/ukgwa/20220828193851/https://www.example.gov.uk/',
    )

    expect(unwrapUkgwa(value)).toBeUndefined()
  })

  it('should read a host with a port as a host', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/+/www.example.gov.uk:80/page.htm',
    )
    const expected = 'http://www.example.gov.uk:80/page.htm'

    expect(unwrapUkgwa(value)).toBe(expected)
  })

  it('should keep a single-slash scheme of the target as written', () => {
    const value = new URL(
      'https://webarchive.nationalarchives.gov.uk/ukgwa/20130221121534/http:/www.example.gov.uk/our-report/',
    )
    const expected = 'http:/www.example.gov.uk/our-report/'

    expect(unwrapUkgwa(value)).toBe(expected)
  })
})
