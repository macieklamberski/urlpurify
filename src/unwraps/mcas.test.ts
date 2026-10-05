import { describe, expect, it } from 'bun:test'
import { unwrapMcas } from './mcas.js'

describe('unwrapMcas', () => {
  it('should strip the proxy suffix from the host of an encoded target', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=https%3A%2F%2Feur05.safelinks.protection.outlook.com.mcas.ms%2F%3Furl%3Dhttps%253A%252F%252Fwww.example.com%252Fro%252Fmain%252F%26data%3D05%257C02%257C%257C0%26reserved%3D0%26McasTsid%3D20893&McasCSRF=7b367021317787a8b8de5ac0de490c166c832d0a80609f0099dcc8f693a8e80e',
    )

    expect(unwrapMcas(url)).toBe(
      'https://eur05.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.example.com%2Fro%2Fmain%2F&data=05%7C02%7C%7C0&reserved=0&McasTsid=20893',
    )
  })

  it('should strip the proxy suffix from the host of a plain target', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=https://www.example.com.mcas.ms/products/led-video-walls/?McasTsid=20892&McasCSRF=f9013cee2bcad114d88034f0e5676ee1c25f5b4dd7ef18e204d7cda92615dba6',
    )

    expect(unwrapMcas(url)).toBe('https://www.example.com/products/led-video-walls/?McasTsid=20892')
  })

  it('should strip the proxy suffix from a target with no path', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=http%3A%2F%2Fwww.example.com.mcas.ms%3FMcasTsid%3D20892&McasCSRF=2295e13e90127103c96f8cc0ba71aac7773ca3b1e764e419fc73c9aac276c41f',
    )

    expect(unwrapMcas(url)).toBe('http://www.example.com/?McasTsid=20892')
  })

  it('should strip the government cloud suffix from the host of the target', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas-gov.us/certificate-checker?login=false&originalUrl=https%3A%2F%2Fwww.example.com.mcas-gov.us%2Fen%2Fcompany%2F%3FMcasTsid%3D20892&McasCSRF=a18bd2b920dd470de7491f92d4309acf87e6313f706da3999f3d556a4f535bcf',
    )

    expect(unwrapMcas(url)).toBe('https://www.example.com/en/company/?McasTsid=20892')
  })

  it('should keep the host of a target without the proxy suffix', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapMcas(url)).toBe('https://example.com/page')
  })

  it('should keep the host of a target that ends with mcas.ms without the dot', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=https%3A%2F%2Fexamplemcas.ms%2Fpage',
    )

    expect(unwrapMcas(url)).toBe('https://examplemcas.ms/page')
  })

  it('should return undefined when originalUrl is not a url', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=example.com.mcas.ms',
    )

    expect(unwrapMcas(url)).toBeUndefined()
  })

  it('should return undefined when originalUrl param is missing', () => {
    const url = new URL('https://mcas-proxyweb.mcas.ms/certificate-checker?login=false')

    expect(unwrapMcas(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://mcas-proxyweb.mcas.ms/login?originalUrl=https%3A%2F%2Fexample.com.mcas.ms%2Fpage',
    )

    expect(unwrapMcas(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/certificate-checker?originalUrl=https%3A%2F%2Fexample.org.mcas.ms%2Fpage',
    )

    expect(unwrapMcas(url)).toBeUndefined()
  })
})
