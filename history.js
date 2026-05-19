export default function history (cb) {
  if (typeof window === 'undefined') return
  window.addEventListener('popstate', function () {
    cb({
      pathname: window.location.pathname,
      search: window.location.search,
      href: window.location.href,
      hash: window.location.hash
    })
  })
}
