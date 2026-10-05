import { describe, expect, it } from 'bun:test'
import { unwrapVadeSecure } from './vadeSecure.js'

describe('unwrapVadeSecure', () => {
  it('should extract target from the antiphishing host', () => {
    const url = new URL(
      'https://antiphishing.vadesecure.com/v4?f=UU1XcHkxazJBTmIySlBBMXFx2f859LIpedyYVn3HK2jeZqq6gwfeToadOx9QmPe7&i=RTNLd2NGeE1RTDFrR25iaOm2xB6i3cNVD0Jxq9J3vLE&k=ywmE&r=ZnVkMm1UMHFmWHNzejI1TlfOvi8IhYWrR1vqTwFwfSZXuHte-229kzsxkvugCv44&s=634bcb492d1b0d25e151790f787c14d478ad105eb1eb12f7e21378f65c1045bc&u=https%3A%2F%2Fwww.example.com%2Fagenda%2F',
    )

    expect(unwrapVadeSecure(url)).toBe('https://www.example.com/agenda/')
  })

  it('should extract target from the safeproxy path', () => {
    const url = new URL(
      'https://gws.eu.vadesecure.com/safeproxy/v4?f=ExORTRxU0Kz8olvaUHKoe8vtut5yRmAAuee25aJNnGPiGiXzXsyZcK6pLcvIFzv1&i=aQvUE1gBBNwa2RRrawGpyRWI8vh4Sa_KvJ7rSvxMh8c&k=7dUc&r=YLk6yEJY2Tme3Yzd9-JLEnZ3yhS8VPkVJSo7-eWitCPm8upNJSaWHxlFEmDtdsmm&s=c9820addae709c80a9de667f6efff003742e340126c1aab68eff3b162826d82f&u=https%3A%2F%2Fwww.example.com%2Fphoto%2Fpeople-gathering-on-street-6054374%2F',
    )

    expect(unwrapVadeSecure(url)).toBe(
      'https://www.example.com/photo/people-gathering-on-street-6054374/',
    )
  })

  it('should extract target from the v3 safeproxy path', () => {
    const url = new URL(
      'https://m365.eu.vadesecure.com/safeproxy/v3?f=nyMYWBvOVmDkhcsfkFgJ7VMGrqzuhZxc0JH7NOBb2Xufvx8Atcpu84199ph5VIoi&i=cSKtLoYeyjZY9Zw5MqmNf98O0zxu7LV8A1Wg3LJonk0WQ2Dfnh8a-K0ibmKQvzP3530fOszTcC7loTOXUbnFYw&k=rmE8&r=HRQmKY5mSLcv_8OqslF8LvJSzor1_ahgZAFi1qshlZUaX_VvZI5DfJoqzJ4zokP8&u=https%3A%2F%2Fwww.example.com%2Fsocietes%2Fsolutions%2F',
    )

    expect(unwrapVadeSecure(url)).toBe('https://www.example.com/societes/solutions/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://m365.us.vadesecure.com/safeproxy/v4?f=YUVY-4bEnsQmnIWlGNvB5BymaUTxTq0eL4-IgwXO4WHfGnFgknNoHi7dlIqzdHPj&k=xptE&s=c609d0b816a34db2d30ab9e23e3ad7c20ed3a187ab62b09f0fd9fc3c51721b0d&u=https%3A%2F%2Fexample.com%2F%3Fmc_cid%3Dbdc185a681%26page%3D2',
    )

    expect(unwrapVadeSecure(url)).toBe('https://example.com/?mc_cid=bdc185a681&page=2')
  })

  it('should extract target encoded twice', () => {
    const url = new URL(
      'https://antiphishing.vadesecure.com/v4?f=UU1XcHkx&k=ywmE&u=https%253A%252F%252Fexample.com%252Fpage',
    )

    expect(unwrapVadeSecure(url)).toBe('https://example.com/page')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://antiphishing.vadesecure.com/v4?f=UU1XcHkx&k=ywmE')

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const url = new URL('https://m365.eu.vadesecure.com/safeproxy/v4?f=UU1XcHkx&k=ywmE&u=')

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for another path on the antiphishing host', () => {
    const url = new URL('https://antiphishing.vadesecure.com/v2?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for another path on a safeproxy host', () => {
    const url = new URL(
      'https://m365.eu.vadesecure.com/safeproxy/v2?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for a longer path on a safeproxy host', () => {
    const url = new URL(
      'https://m365.eu.vadesecure.com/safeproxy/v4/report?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for a nested safeproxy path', () => {
    const url = new URL(
      'https://m365.eu.vadesecure.com/admin/safeproxy/v4?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for the antiphishing path on a safeproxy host', () => {
    const url = new URL('https://m365.eu.vadesecure.com/v4?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for the safeproxy path on the antiphishing host', () => {
    const url = new URL(
      'https://antiphishing.vadesecure.com/safeproxy/v4?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/safeproxy/v4?u=https%3A%2F%2Fexample.org%2Fpage')

    expect(unwrapVadeSecure(url)).toBeUndefined()
  })
})
