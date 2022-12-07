
const doms = {
  // Page elements
  pageContentElem: document.getElementById('content'), // asg container
  pageHeaderElem: document.querySelector('header'), // asg header
  defaultAnchorElem: document.querySelector('footer'), // used as barrier/last item to take as reference
  // Sticky-Tabs elements
  navElem: document.getElementById('stickytabs'),
  navLinks: document.querySelectorAll('#stickytabs>a'),
  navWrapperElem: document.getElementById('stickytabs-wrapper'),
  barElem: document.getElementById('stickytabs-bar'),
  panelElem: document.getElementById('stickytabs-panel'),
  anchorElems: document.querySelectorAll('.stickytabs-anchor'),
  paneElems: document.getElementsByClassName('stickytabs-pane')
}

export default doms
