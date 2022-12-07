import { init } from './helpers'
import { onWindowResize, onScroll, onWindowLoad, onHashChange } from './listeners'
import './style2.css'

//
/// Init
init()
window.addEventListener('load', onWindowLoad)
document.addEventListener('scroll', onScroll)
window.addEventListener('resize', onWindowResize)
window.addEventListener('hashchange', onHashChange)
