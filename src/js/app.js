import { addTouchAttr, addLoadedAttr, isMobile, FLS } from '@js/common/functions.js'
import { initLenis } from './custom/lenis.js'
import { initScrollStory, initHeroIntro } from './custom/gsap-animations.js'

addLoadedAttr()
addTouchAttr()
initLenis()

initScrollStory()
addLoadedAttr(() => {
	initHeroIntro()
})
