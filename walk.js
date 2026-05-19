export default function walk (router, cb) {
  if (typeof router !== 'function') throw new TypeError('shifty-router/walk: router should be a function')
  if (typeof cb !== 'function') throw new TypeError('shifty-router/walk: cb should be a function')

  const routes = router.routes || []
  routes.forEach(function (route) {
    route.handler = cb(route.path, route.handler)
  })
}
