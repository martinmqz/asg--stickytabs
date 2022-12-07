
const config = {
  type: 'simple', // simple (default), vpanel
  cssClass: 'stickytabs-sticky',
  speed: 750, // scrolling time in milliseconds
  isIE11: !!window.MSInputMethodContext && !!document.documentMode,
  activeNavLinkCssClass: 'active',
  activeContentCssClass: 'active',
  skipPaneCssClass: 'stickytabs-skip',
  lastPaneCssClass: 'stickytabs-last'
}

export default config
