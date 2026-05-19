import { expect } from 'chai'
import href from '../href.js'
import window from 'global/window.js' // will be empty object shared with href
import sinon from 'sinon'

window.history = { pushState: sinon.spy() }
window.location = {
  protocol: 'http:',
  hostname: 'localhost',
  port: ''
}

const goodLink = {
  localName: 'a',
  href: 'http://localhost/someUrl#',
  pathname: '/someUrl',
  hasAttribute: () => {}
}

const nonCatchEvents = {
  'non-links': {
    target: { localName: 'p' }
  },
  'link without href': {
    target: { localName: 'a', hasAttribute: () => {} }
  },
  'link with data-no-routing': {
    target: { localName: 'a', href: 'someUrl#', hasAttribute: (a) => a === 'data-no-routing' }
  },
  'event with ctrlKey': {
    ctrlKey: true
  },
  'event with metaKey': {
    metaKey: true
  },
  'event with altKey': {
    altKey: true
  },
  'event with shiftKey': {
    shiftKey: true
  },
  'button click': {
    button: true
  }
}

describe('href', () => {
  it('should capture link click', () => {
    const event = {
      target: {
        localName: 'somethingOtherThanALink',
        parentNode: {
          localName: 'stillNotALink',
          parentNode: goodLink
        }
      },
      preventDefault: sinon.spy()
    }
    const cb = sinon.spy()
    href(cb)
    window.onclick(event)

    expect(event.preventDefault.callCount).to.equal(1)
    expect(cb.callCount).to.equal(1)
    expect(cb.lastCall.args[0]).to.deep.equal({
      hash: undefined, href: 'http://localhost/someUrl#', pathname: '/someUrl', search: {}
    })
  })

  for (var nonCatchEvent in nonCatchEvents) {
    (function (name, config) {
      it('should avoid ' + name, () => {
        const event = Object.assign({
          target: goodLink,
          preventDefault: sinon.spy()
        }, config)
        const previousPushCount = window.history.pushState.callCount
        const cb = sinon.spy()
        href(cb)
        window.onclick(event)

        expect(event.preventDefault.callCount).to.equal(0)
        expect(cb.callCount).to.equal(0)
        expect(window.history.pushState.callCount).to.equal(previousPushCount)
      })
    })(nonCatchEvent, nonCatchEvents[nonCatchEvent])
  }

  it('should avoid link outside provided root', () => {
    const event = {
      target: {
        localName: 'somethingOtherThanALink',
        parentNode: {
          localName: 'root',
          parentNode: goodLink
        }
      },
      preventDefault: sinon.spy()
    }
    const previousPushCount = window.history.pushState.callCount
    const cb = sinon.spy()
    const root = event.target.parentNode
    href(cb, root)
    window.onclick(event)

    expect(event.preventDefault.callCount).to.equal(0)
    expect(cb.callCount).to.equal(0)
    expect(window.history.pushState.callCount).to.equal(previousPushCount)
  })
})
