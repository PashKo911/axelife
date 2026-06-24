// Підключення функціоналу "Чортоги Фрілансера"
import Lenis from 'lenis'
import { addTouchAttr, addLoadedAttr, isMobile, FLS } from '@js/common/functions.js'

addLoadedAttr()
addTouchAttr()
//========================================================================================================================================================
// Lenis
const lenis = new Lenis()

function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
