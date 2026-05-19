export default function pathname (route) {
  if (typeof route !== 'string') return '/'
  var path = route.replace(/^(http[s]?:\/\/[^/]+)/, '') // Strip protocol and domain
  path = path.replace(/[?#].*$/, '') // Strip query and hash
  if (!path || path[0] !== '/') path = '/' + path
  return path
}
