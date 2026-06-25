import { addTouchAttr, addLoadedAttr } from '@js/common/functions.js'
import { initLenis } from './custom/lenis.js'
import { initScrollStory, initHeroIntro } from './custom/gsap-animations.js'
import { initHowWorksSliders } from '../components/layout/slider/slider.js'

addTouchAttr()

initLenis()

addLoadedAttr(async () => {
	await initHowWorksSliders()

	initScrollStory()

	initHeroIntro()
})
