import { addTouchAttr, addLoadedAttr, debounce } from '@js/common/functions.js'
import { initLenis } from './custom/lenis.js'
import { initScrollStory, initHeroIntro } from './custom/gsap-animations.js'
import { initSliders } from '../components/layout/slider/slider.js'

addTouchAttr()
initLenis()

const updateFaqHeight = () => {
	const faqSectionContainer = document.querySelector('.faq__container')
	if (!faqSectionContainer) return
	document.documentElement.style.setProperty('--faq-height', `${faqSectionContainer.offsetHeight}px`)
}

window.addEventListener('resize', debounce(updateFaqHeight, 200))

addLoadedAttr(async () => {
	await initSliders()

	initScrollStory()
	initHeroIntro()

	updateFaqHeight()
})
