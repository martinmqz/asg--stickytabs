import doms from './doms'
import { getScrollY, stick, resizeNav, getNavTopOffset, unstick, isStuck, resizeNavWrapper, buildMobileNav, resizeNavBar, processView } from './helpers'

//
/// Event Binding

/**
 *
 * @param {Object} e Event
 */
function onWindowLoad (e) {
  doms.navLinks.forEach(function (link) {
    link.addEventListener('click', onNavLinkClick)
  })

  setTimeout(function () {
    processView(location.hash || null)

    // Stick if landing on scrolled page - check again
    if (getScrollY() > getNavTopOffset()) {
      stick()
    }

    resizeNav()
    resizeNavWrapper()
    resizeNavBar()
  },
  600) // give page some time to load elements

  const dropdownElem = buildMobileNav()
  doms.navElem.insertAdjacentElement('beforeend', dropdownElem)
}

/**
 *
 * @param {*} e Event
 */
function onScroll (e) {
  if (getScrollY() >= getNavTopOffset()) {
    stick()
  } else {
    if (isStuck()) {
      unstick()
    }
  }
}

/**
 * Triggered only on back & forward navigation, and on page load (when hash is on URL). Not on navLink click
 * @param {*} e Event
 * @returns Nothing
 */
function onHashChange (e) {
  processView(location.hash)
}

/**
 *
 * @param {*} e Event
 */
function onWindowResize (e) {
  resizeNav()
  resizeNavWrapper()
  resizeNavBar()
}

/**
 *
 * @param {Object} e Event
 */
function onNavLinkClick (e) {
  e.preventDefault()

  const id = this.hash.split('#')[1]
  location.hash = id
}

export {
  onWindowLoad,
  onWindowResize,
  onScroll,
  onHashChange,
  onNavLinkClick
}
