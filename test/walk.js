import sheetRouter from '../index.js'
import walk from '../walk.js'
import noop from 'noop2'
import { expect } from 'chai'

describe('walk', function () {
  it('should assert input types', () => {
    expect(walk.bind(null)).to.throw(/function/)
    expect(walk.bind(null, noop)).to.throw(/function/)
  })

  it('should walk a trie', () => {
    const router = sheetRouter({ thunk: false }, [
      ['/foo', (params, x, y) => x * y],
      ['/bar', (params, x, y) => x / y]
    ])

    walk(router, (route, cb) => {
      const y = 2
      const wrapped = function (params, x) {
        return cb(params, x, y)
      }
      return wrapped
    })

    expect(router('/foo', 4)).to.equal(8)
    expect(router('/bar', 8)).to.equal(4)
  })

  it('should allow thunking', () => {
    const router = sheetRouter({ thunk: false }, [
      ['/foo', (params, x, y) => x * y],
      ['/bar', (params, x, y) => x / y]
    ])

    walk(router, (route, cb) => {
      const y = 2
      const wrapped = function (params) {
        return function (x) {
          return cb(params, x, y)
        }
      }
      return wrapped
    })

    expect(router('/foo')(4)).to.equal(8)
    expect(router('/bar')(8)).to.equal(4)
  })
})
