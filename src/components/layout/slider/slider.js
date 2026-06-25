import Swiper from 'swiper'
import { Navigation, EffectFade, Thumbs } from 'swiper/modules'

import './slider.scss'
// import 'swiper/css/effect-fade'

function initHowWorksSliders() {
	const thumbsEl = document.querySelector('.how-works__thumbs-slider')
	const mediaEl = document.querySelector('.how-works__media-slider')
	const contentEl = document.querySelector('.how-works__content-slider')
	const navEl = document.querySelector('.how-works__nav-slider')

	if (!thumbsEl || !mediaEl || !contentEl || !navEl) return

	// THUMBS
	const thumbsSlider = new Swiper(thumbsEl, {
		modules: [Navigation],

		observer: true,
		observeParents: true,

		direction: 'vertical',

		slidesPerView: 4,
		spaceBetween: 12,

		speed: 800,

		watchSlidesProgress: true,
		slideToClickedSlide: true,
	})

	// NAV TITLE
	const navSlider = new Swiper(navEl, {
		modules: [EffectFade],

		observer: true,
		observeParents: true,

		slidesPerView: 1,

		speed: 800,

		allowTouchMove: false,

		effect: 'fade',
		fadeEffect: {
			crossFade: true,
		},
	})

	// CONTENT
	const contentSlider = new Swiper(contentEl, {
		modules: [EffectFade],

		observer: true,
		observeParents: true,

		slidesPerView: 1,

		speed: 800,

		allowTouchMove: false,

		effect: 'fade',
		fadeEffect: {
			crossFade: true,
		},
	})

	// MEDIA (главный)
	const mediaSlider = new Swiper(mediaEl, {
		modules: [Navigation, EffectFade, Thumbs],

		observer: true,
		observeParents: true,

		slidesPerView: 1,

		speed: 800,

		effect: 'fade',
		fadeEffect: {
			crossFade: true,
		},

		thumbs: {
			swiper: thumbsSlider,
		},

		navigation: {
			prevEl: '.how-works__swiper-button-prev',
			nextEl: '.how-works__swiper-button-next',
		},
	})

	// синхронизация всех остальных
	mediaSlider.on('slideChange', () => {
		const index = mediaSlider.activeIndex

		contentSlider.slideTo(index)
		navSlider.slideTo(index)
	})

	thumbsSlider.on('slideChange', () => {
		const index = thumbsSlider.activeIndex

		contentSlider.slideTo(index)
		navSlider.slideTo(index)
	})
}

window.addEventListener('load', initHowWorksSliders)
