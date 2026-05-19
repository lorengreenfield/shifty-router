import noop from 'noop2'
import { expect } from 'chai'
import sheetRouter from '../index.js'

describe('router', () => {
  it('should assert input types', function () {
    expect(sheetRouter).to.throw()
  })

  it('should route paths', function (done) {
    const router = sheetRouter([
      ['/', (params) => {
        done()
      }],
      ['/foo', noop]
    ])

    router('/')
  })

  it('should match a default path', function (done) {
    const router = sheetRouter({ default: '/404' }, [
      ['/404', () => {
        done()
      }],
      ['/', noop]
    ])

    router('/foo')
  })

  it('should return a value', function () {
    const router = sheetRouter({ default: '/404' }, [
      ['/404', (params) => 'foo']
    ])

    expect(router('/foo')).to.equal('foo')
  })

  it('should clean urls before matching', function () {
    let count = 0
    const router = sheetRouter([
      ['/foo', (params) => {
        count++
      }]
    ])

    router('https://foobar.com/foo?bar=baz')
    expect(count).to.equal(1)
  })

  it('should deliver arbitrary objects', function () {
    const router = sheetRouter([
      ['/', (params, foo, bar) => {
        expect(foo).to.equal('foo')
        expect(bar).to.equal('bar')
      }],
      ['/foo', noop]
    ])

    router('/', 'foo', 'bar')
  })

  it('should route nested paths 2 levels deep', function (done) {
    const router = sheetRouter([
      ['/foo', [
        ['/bar', () => {
          done()
        }]
      ]]
    ])

    router('/foo/bar')
  })

  it('should route vanilla paths 2 levels deep', function (done) {
    const router = sheetRouter([
      ['/foo', [
        ['/', () => {
          done()
        }]
      ]]
    ])

    router('/foo')
  })

  it('should route nested paths 3 levels deep', function (done) {
    const router = sheetRouter([
      ['/foo', [
        ['/baz', [
          ['/bar', () => {
            done()
          }]
        ]]
      ]]
    ])

    router('/foo/baz/bar')
  })

  it('should route cojoined paths 3 levels deep', function (done) {
    const router = sheetRouter([
      ['/foo', [
        ['/baz/ban', [
          ['/bar', () => {
            done()
          }]
        ]]
      ]]
    ])

    router('/foo/baz/ban/bar')
  })

  it('should route partial cojoined paths 3 levels deep', function () {
    let count = 0
    const router = sheetRouter([
      ['/foo', [
        ['/baz/:barp', [
          ['/bar', (params) => {
            expect(params.barp).to.equal('ban')
            count++
          }]
        ]]
      ]]
    ])

    router('/foo/baz/ban/bar')
    expect(count).to.equal(1)
  })

  it('should route multiple partials', function () {
    let count = 0
    const router = sheetRouter([
      ['/', () => {
        count++
      }],
      ['/:foo', [
        ['/:bar', (params) => {
          expect(params.foo).to.equal('first')
          expect(params.bar).to.equal('second')
          count++
        }]
      ]]
    ])

    router('/')
    router('/first/second')
    expect(count).to.equal(2)
  })

  it('should route multiple nested paths 2 levels deep', function () {
    let count = 0
    const router = sheetRouter([
      ['/foo', [
        ['/bar', () => {
          count++
        }],
        ['/baz', () => {
          count++
        }]
      ]]
    ])

    router('/foo/bar')
    router('/foo/baz')
    expect(count).to.equal(2)
  })

  it('should allow for default routes using three args', function () {
    let count = 0
    const router = sheetRouter([
      ['/foo', () => {
        count++
      }, [
        ['/bar', () => {
          count++
        }]
      ]]
    ])

    router('/foo')
    router('/foo/bar')
    expect(count).to.equal(2)
  })
})

describe('hash routes', () => {
  it('should allow for hash routes', () => {
    let count = 0
    const router = sheetRouter([
      ['/foo', () => {
        count++
      }, [
        ['#bar', () => {
          count++
        }]
      ]]
    ])

    router('/foo')
    router('/foo#bar')
    expect(count).to.equal(2)
  })

  it('should allow for hash partials', function () {
    let count = 0
    const router = sheetRouter([
      ['/foo', (params) => {
        count++
      }, [
        ['/bar', (params) => {
          count++
        }]
      ]]
    ])

    router('/foo')
    router('/foo/bar')
    expect(count).to.equal(2)
  })
})
