import Swiper from 'swiper'
import { Navigation, EffectFade, Thumbs, Pagination } from 'swiper/modules'

import './slider.scss'

export async function initSliders() {
	/**
	 * =========================
	 * HOW WORKS SLIDERS
	 * =========================
	 */
	const thumbsEl = document.querySelector('.how-works__thumbs-slider')
	const mediaEl = document.querySelector('.how-works__media-slider')
	const contentEl = document.querySelector('.how-works__content-slider')
	const navEl = document.querySelector('.how-works__nav-slider')

	if (thumbsEl && mediaEl && contentEl && navEl) {
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

		const sync = (index) => {
			contentSlider.slideTo(index)
			navSlider.slideTo(index)
		}

		mediaSlider.on('slideChange', () => {
			sync(mediaSlider.activeIndex)
		})

		thumbsSlider.on('slideChange', () => {
			sync(thumbsSlider.activeIndex)
		})
	}

	/**
	 * =========================
	 * TRUST SLIDER
	 * =========================
	 */
	const trustEl = document.querySelector('.trust__slider')

	if (trustEl) {
		new Swiper(trustEl, {
			modules: [Navigation, Pagination],

			observer: true,
			observeParents: true,
			autoHeight: true,
			slidesPerView: 2,
			spaceBetween: 20,
			speed: 700,

			navigation: {
				prevEl: '.trust__swiper-button-prev',
				nextEl: '.trust__swiper-button-next',
			},

			pagination: {
				el: '.trust__swiper-pagination',
				type: 'fraction',
				renderFraction: (currentClass, totalClass) => {
					return `
						<span class="${currentClass}"></span>
						<span class="trust__pagination-separator"> / </span>
						<span class="${totalClass}"></span>
					`
				},
			},

			breakpoints: {
				320: {
					slidesPerView: 1.15,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2.2,
					spaceBetween: 20,
				},
				1480: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
			},
		})
	}
}
