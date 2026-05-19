import pathname from './_pathname.js'

var isLocalFile = (/file:\/\//.test(typeof window === 'object' &&
  window.location && window.location.origin)) // electron support

function parse (input, loose) {
  if (input instanceof RegExp) return { keys: false, pattern: input }
  var c, o, tmp, ext, keys = [], pattern = '', arr = input.split('/')
  arr[0] || arr.shift()
  while (tmp = arr.shift()) {
    c = tmp[0]
    if (c === '*') {
      keys.push(c)
      pattern += tmp[1] === '?' ? '(?:/(.*))?' : '/(.*)'
    } else if (c === ':') {
      o = tmp.indexOf('?', 1)
      ext = tmp.indexOf('.', 1)
      const key = tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length)
      keys.push(!!~o ? key + '?' : key)
      pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)'
      if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext)
    } else {
      pattern += '/' + tmp
    }
  }
  return {
    keys: keys,
    pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
  }
}

function exec (path, result) {
  let i = 0, out = {}
  let matches = result.pattern.exec(path)
  if (!matches) return null
  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i] || null
  }
  return out
}

export default function sheetRouter (opts, tree) {
  if (!tree) {
    tree = opts
    opts = {}
  }

  if (typeof opts !== 'object') throw new TypeError('sheet-router: opts must be a object')
  if (!Array.isArray(tree)) throw new TypeError('sheet-router: tree must be an array')

  var dft = opts.default || '/404'
  if (typeof dft !== 'string') throw new TypeError('sheet-router: dft must be a string')

  var routes = []
  var prevCallback = null
  var prevRoute = null

  ;(function walk (tree, fullRoute) {
    if (typeof tree[0] === 'string') {
      var route = tree[0].replace(/^[#/]/, '')
    } else {
      var rootArr = tree[0]
    }

    var cb = (typeof tree[1] === 'function') ? tree[1] : null
    var children = (Array.isArray(tree[1]))
      ? tree[1]
      : Array.isArray(tree[2]) ? tree[2] : null

    if (rootArr) {
      tree.forEach(function (node) {
        walk(node, fullRoute)
      })
      return
    }

    if (cb) {
      var innerRoute = (route !== undefined && route !== null)
        ? fullRoute.concat(route).join('/')
        : fullRoute.length ? fullRoute.join('/') : ''

      if (innerRoute[0] !== '/') innerRoute = '/' + innerRoute

      // if opts.thunk is false or only enabled for match, don't thunk
      var handler = (opts.thunk === false || opts.thunk === 'match')
        ? cb
        : thunkify(cb)

      routes.push(Object.assign({
        path: innerRoute,
        handler: handler
      }, parse(innerRoute)))
    }

    if (Array.isArray(children)) {
      walk(children, fullRoute.concat(route))
    }
  })(tree, [])

  match.routes = routes
  return match

  // match a route on the router
  //
  // (str, [any..]) -> any
  function match (route, arg1, arg2, arg3, arg4, arg5) {
    if (typeof route !== 'string') throw new TypeError('sheet-router: route must be a string')

    var path = pathname(route, isLocalFile)

    if (opts.thunk !== false && path === prevRoute) {
      return prevCallback(arg1, arg2, arg3, arg4, arg5)
    }

    for (var i = 0; i < routes.length; i++) {
      var r = routes[i]
      if (r.pattern.test(path)) {
        var params = exec(path, r)
        if (opts.thunk === false || opts.thunk === 'match') {
          return r.handler(params, arg1, arg2, arg3, arg4, arg5)
        } else {
          prevRoute = path
          prevCallback = r.handler(params)
          return prevCallback(arg1, arg2, arg3, arg4, arg5)
        }
      }
    }

    // Default route
    var dftMatch = routes.find(function (r) {
      return r.path === dft || r.path === '/' + dft.replace(/^\//, '')
    })

    if (dftMatch) {
      var params = {}
      if (opts.thunk === false || opts.thunk === 'match') {
        return dftMatch.handler(params, arg1, arg2, arg3, arg4, arg5)
      } else {
        prevRoute = path
        prevCallback = dftMatch.handler(params)
        return prevCallback(arg1, arg2, arg3, arg4, arg5)
      }
    }

    return null
  }
}

// wrap a function in a function so it can be called at a later time
// fn -> obj -> (any, any, any, any, any)
function thunkify (cb) {
  return function (params) {
    return function (arg1, arg2, arg3, arg4, arg5) {
      return cb(params, arg1, arg2, arg3, arg4, arg5)
    }
  }
}
