import { addTouchAttr, addLoadedAttr } from '@js/common/functions.js'
import { initLenis } from './custom/lenis.js'
import { initScrollStory, initHeroIntro } from './custom/gsap-animations.js'
import { initSliders } from '../components/layout/slider/slider.js'

addTouchAttr()

// initLenis()

addLoadedAttr(async () => {
	await initSliders()

	initScrollStory()

	initHeroIntro()
})
