export default function qs (uri) {
  var obj = {}
  var str = uri.split('?').pop()
  if (!str || str === uri) return obj
  str.split('&').forEach(function (pair) {
    var parts = pair.split('=')
    var key = decodeURIComponent(parts[0])
    var val = parts[1] ? decodeURIComponent(parts[1]) : true
    if (key) obj[key] = val
  })
  return obj
}
