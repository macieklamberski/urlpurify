import { describe, expect, it } from 'bun:test'
import { unwrapMinistryCloud } from './ministryCloud.js'

describe('unwrapMinistryCloud', () => {
  it('should extract a target with a scheme', () => {
    const url = new URL(
      'https://historian.ministrycloud.com/r/eyJzaXRlX2lkIjoiMTk0MTMiLCJzZXJtb25faWQiOiI0MzU0MTkzIiwibWVkaWFfaWQiOiIxNDE1ODI2OSIsIm1lZGlhX2Zvcm1hdCI6IjEwNSJ9/https://example.com/account-media/19413/h264-720/s/0e20792781.mp4',
    )

    expect(unwrapMinistryCloud(url)).toBe(
      'https://example.com/account-media/19413/h264-720/s/0e20792781.mp4',
    )
  })

  it('should extract a target without a scheme after an encoded id', () => {
    const url = new URL(
      'https://historian.ministrycloud.com/r/eyJzaXRlX2lkIjoiMTQwODUiLCJzZXJtb25faWQiOiI0MzI5Mzk5IiwibWVkaWFfaWQiOiIxNDEyOTcxNiIsIm1lZGlhX2Zvcm1hdCI6IjEifQ%3D%3D/example.com/episodes/365118/2952801/twin-lakes-church-sermons.mp3',
    )

    expect(unwrapMinistryCloud(url)).toBe(
      'https://example.com/episodes/365118/2952801/twin-lakes-church-sermons.mp3',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://historian.ministrycloud.com/r/eyJzaXRlX2lkIjoiMTk0MTMifQ%3D%3D/')

    expect(unwrapMinistryCloud(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://historian.ministrycloud.com/x/eyJ9/https://example.com/a.mp3')

    expect(unwrapMinistryCloud(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/r/eyJ9/https://example.org/sermon.mp3')

    expect(unwrapMinistryCloud(url)).toBeUndefined()
  })
})
