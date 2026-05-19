import window from 'global/window.js'
import qs from './qs.js'

const noRoutingAttrName = 'data-no-routing'

export default function href (cb, root) {
  window.onclick = function (e) {
    if ((e.button && e.button !== 0) || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return

    var node = (function traverse (node) {
      if (!node || node === root) return
      if (node.localName !== 'a') return traverse(node.parentNode)
      if (node.href === undefined) return traverse(node.parentNode)
      if (!sameOrigin(node.href)) return
      return node
    })(e.target)

    if (!node) return

    var isRoutingDisabled = node.hasAttribute(noRoutingAttrName)
    if (isRoutingDisabled) return

    e.preventDefault()
    cb({
      pathname: node.pathname,
      search: (node.search) ? qs(node.search) : {},
      href: node.href,
      hash: node.hash
    })
  }
}

function sameOrigin (href) {
  var location = window.location
  var origin = location.protocol + '//' + location.hostname
  if (location.port) origin += ':' + location.port
  return (href && (href.indexOf(origin) === 0))
}
