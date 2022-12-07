
import config from './config'
import doms from './doms'

/**
 *
 */
function init () {
  if (doms.navElem.dataset.type && doms.navElem.dataset.type !== 'simple') {
    config.type = doms.navElem.dataset.type // overwrite default
  }

  if (config.type !== 'simple') {
    _defineVirtualPanes()
  }
}

/**
 * Gets the current window's scroll amount
 */
function getScrollY () {
  return document.documentElement.scrollTop
}

/**
 *
 */
function getNavTopOffset () {
  return $(doms.navWrapperElem).offset().top
}

/**
 *
 * @param {*} isReset
 */
function resizeNav (isReset) {
  if (isReset) {
    doms.navElem.style.removeProperty('width')
  } else {
    doms.navElem.style.width = _getPageContentWidth() + 'px'
  }
}

/**
 *
 */
function resizeNavBar () {
  if (!doms.barElem) {
    return
  } // else...

  if (doms.barElem.offsetHeight !== doms.navElem.offsetHeight) {
    doms.barElem.style.height = doms.navWrapperElem.offsetHeight + 'px' // match heights
  } // else... heights already matching
}

/**
 *
 */
function stick () {
  doms.navElem.classList.add(config.cssClass)
  resizeNav()
}

/**
 *
 */
function unstick () {
  _resetAnchorsStyle()
  doms.navElem.classList.remove(config.cssClass)
  resizeNav(true)
}

/**
 *
 */
function isStuck () {
  return doms.navElem.classList.contains(config.cssClass)
}

/**
 *
 */
function resizeNavWrapper () {
  // doms.navbarWrapperElem.style.height = doms.navbarWrapperElem.offsetHeight + 'px'
  // if (doms.navElem.offsetHeight > 0) {
  doms.navWrapperElem.style.height = doms.navElem.offsetHeight + 'px'
  // }
}

/**
 *
 * @param {*} hash Optional
 */
function buildMobileNav (hash) {
  const dropdownElem = document.createElement('select')
  dropdownElem.classList.add('custom-select')
  let optionElem = null
  let navLink = null
  for (let i = 0; i < doms.navLinks.length; i++) {
    navLink = doms.navLinks[i]
    optionElem = document.createElement('option')
    optionElem.value = navLink.hash
    optionElem.text = navLink.innerText
    if (hash && optionElem.value === hash) {
      optionElem.selected = true
    }
    dropdownElem.appendChild(optionElem)
  }

  return _bindNavDropdown(dropdownElem)
}

/**
 *
 * @param {String} hash Hash string
 * @returns true
 */
function processView (hash) {
  const anchorElem = _getAnchorByHash(hash)

  if (_isDropdownVisible()) {
    _activateDropdownItem(anchorElem)
  } else {
    _activateNavLink(anchorElem)
    _activateContentPane(anchorElem)
  }

  if (hash !== null) {
    _setAnchorsStyle()

    if (_isDropdownVisible()) {
      _scrollToElement(anchorElem) // Scroll always on mobile
    } else if (!isStuck()) {
      _scrollToElement(anchorElem) // Scroll only when bar is not already fixed
    }
    // else no scroll at all since dropdown is not visible, and bar is stuck
  }
  // else no scroll at all, since there is not anchor-id (hash) to scroll to
  return true
}

/**
 *
 * @param {*} element
 * @param {*} callback
 */
function _scrollToElement (element, isNoDelay) {
  if (element === null) {
    return
  } // else...

  const positionY = $(element).offset().top // - doms.navWrapperElem.offsetHeight
  const extra = 0 // -12 // adjust accordingly // tight to nav links margin

  if (isNoDelay === true) {
    scrollTo(0, positionY)
  } else {
    $('html').animate({ scrollTop: positionY + extra }, config.speed)
  }
}

/**
 *
 */
function _getPageContentWidth () {
  return $(doms.pageContentElem).width()
}

/**
 *
 * @param {*} dropdownElem
 */
function _bindNavDropdown (dropdownElem) {
  dropdownElem.addEventListener('change', function (e) {
    location.hash = dropdownElem.value
  })

  return dropdownElem
}

/**
 *
 * @param {HTMLElement} navLink
 * @returns
 */
function _activateDropdownItem (navLink) {
  const dropdownElem = doms.navElem.querySelector('select')
  if (!dropdownElem || !navLink) {
    return
  } // else...

  for (let i = 0; i < dropdownElem.length; i++) {
    if (dropdownElem.item(i).value === navLink.hash) {
      dropdownElem.item(i).selected = true
    }
  }
}

/**
 * Returns anchor with id=hash-value, or First anchor by default
 * @param {String} hash Hash string
 * @returns HTMLElement
 */
function _getAnchorByHash (hash) {
  if (!hash) {
    return doms.anchorElems.item(0)
  }
  // else...
  const anchorId = hash.split('#')[1]
  return document.getElementById(anchorId)
}

/**
 * Selects nav link
 */
function _activateNavLink (anchorElem) {
  doms.navLinks.forEach(function (link) {
    if (link.hash === '#' + anchorElem.id) {
      link.classList.add(config.activeNavLinkCssClass)
      link.ariaSelected = true
    } else {
      link.classList.remove(config.activeNavLinkCssClass)
      link.ariaSelected = false
    }
  })
}

/**
 * Show content pane element by nav-link index
 */
function _activateContentPane (anchorElem) {
  if (config.type === 'simple') {
    const paneElem = anchorElem.parentElement
    paneElem.classList.add(config.activeContentCssClass)
    return
  }
  // else...

  const vpaneElems = document.querySelectorAll('.stickytabs-vpane')

  // First show active-to-be elements
  vpaneElems.forEach(function (vpaneElem) {
    if (vpaneElem.dataset.anchor === anchorElem.id) {
      vpaneElem.classList.add(config.activeContentCssClass)
    }
  })

  // Then deactivate the rest elements
  vpaneElems.forEach(function (vpaneElem) {
    if (vpaneElem.dataset.anchor !== anchorElem.id) {
      vpaneElem.classList.remove(config.activeContentCssClass)
    }
  })

  if (isStuck()) {
    _scrollToElement(anchorElem, true)
  }
}

/**
 *
 * @returns Nothing
 */
function _defineVirtualPanes () {
  if (doms.anchorElems.length < 1) {
    console.warn('ASG:: No anchor elements')
    return // exit, nothing to process
  } // else...

  // Start with the anchors' container elements
  doms.anchorElems.forEach(function (anchorElem) {
    anchorElem.closest('.col-12').classList.add('stickytabs-vpane')
    anchorElem.closest('.col-12').dataset.anchor = anchorElem.id
  })

  // Then do the in-between elements
  const anchorParent = doms.anchorElems.item(0).closest('.col-12')

  let _anchorId = null
  let _parentSibling = anchorParent

  while (_parentSibling) {
    if (_parentSibling.dataset.anchor) {
      _anchorId = _parentSibling.dataset.anchor
      _parentSibling = _parentSibling.nextElementSibling // Reassign before continuing!
      continue // Skip it since already has these attributes
    } // else...

    // Should skip?
    if (_parentSibling.querySelector('.' + config.skipPaneCssClass)) {
      continue // skip
    } // else...

    // Add attributes
    _parentSibling.classList.add('stickytabs-vpane')
    _parentSibling.dataset.anchor = _anchorId

    if (_parentSibling.querySelector('.' + config.lastPaneCssClass)) {
      break // reached end of tab contents
    }

    // Next
    _parentSibling = _parentSibling.nextElementSibling
  }
}

/**
 *
 * @returns Boolean
 */
function _isDropdownVisible () {
  const dropdownElem = doms.navElem.querySelector('select')

  if (!dropdownElem) return false
  // else...
  const ddDisplayVal = window.getComputedStyle(dropdownElem).getPropertyValue('display')
  return ddDisplayVal !== 'none'
}

/**
 *
 */
function _setAnchorsStyle () {
  doms.anchorElems.forEach(function (el) {
    el.style.paddingTop = doms.navWrapperElem.offsetHeight + 'px' // To account for navbar height
  })
}

/**
 *
 */
function _resetAnchorsStyle () {
  $('.stickytabs-anchor').animate({ paddingTop: 0 }, config.speed / 2)
}

//
/// Exports
export {
  init,
  getScrollY,
  getNavTopOffset,
  resizeNav,
  stick,
  unstick,
  isStuck,
  resizeNavWrapper,
  buildMobileNav,
  resizeNavBar,
  processView,
  _defineVirtualPanes
}
