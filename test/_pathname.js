import { expect } from 'chai'
import p from '../_pathname.js'

describe('pathname', () => {
  it('should parse pathnames', () => {
    expect(p('https://foobar.com/bin/baz#bar')).to.equal('/bin/baz')
    expect(p('http://foobar.com/bin/baz#bar')).to.equal('/bin/baz')
    expect(p('http://foobar.com/bin/baz#bar?beep=boop')).to.equal('/bin/baz')
    expect(p('http://foobar.com/bin/baz#bar?beep=boop')).to.equal('/bin/baz')
    expect(p('/Users/dat/index.html/bin/baz')).to.equal('/Users/dat/index.html/bin/baz')
  })
})
