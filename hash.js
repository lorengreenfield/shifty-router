export default function hash (cb) {
  if (typeof cb !== 'function') throw new TypeError('sheet-router/hash: cb must be a function')
  if (typeof window === 'undefined') return
  window.addEventListener('hashchange', function (e) {
    cb(window.location.hash)
  })
}
