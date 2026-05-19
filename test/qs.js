import qs from '../qs.js'
import { expect } from 'chai'

describe('qs', () => {
  it('should parse querystrings', () => {
    const uri = 'https://foobar.com/binbaz?foo=bar'
    const expected = { foo: 'bar' }
    expect(qs(uri)).to.deep.equal(expected)
  })

  it('should parse querystrings in hash urls', () => {
    const uri = 'https://foobar.com/binbaz#heyo?foo=bar'
    const expected = { foo: 'bar' }
    expect(qs(uri)).to.deep.equal(expected)
  })

  it('should parse multiple querystrings', () => {
    const uri = 'https://foobar.com/binbaz?foo=bar&beep=boop'
    const expected = { foo: 'bar', beep: 'boop' }
    expect(qs(uri)).to.deep.equal(expected)
  })
})
