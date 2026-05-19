const qs = require('./qs.js')

module.exports = function createLocation (state, patch) {
  if (typeof window === 'undefined') {
    return { pathname: '', search: {}, hash: '', href: '' }
  }
  if (!state) {
    return {
      pathname: window.location.pathname,
      search: window.location.search ? qs(window.location.search) : {},
      hash: window.location.hash,
      href: window.location.href
    }
  }
  if (typeof patch === 'string') {
    var a = document.createElement('a')
    a.href = patch
    return {
      href: a.href,
      pathname: a.pathname,
      search: a.search ? qs(a.search) : {},
      hash: a.hash
    }
  }
  return Object.assign({}, state, patch)
}
