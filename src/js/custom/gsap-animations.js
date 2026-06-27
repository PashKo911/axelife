import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { debounce } from '../common/functions'
import { addTouchAttr, addLoadedAttr } from '@js/common/functions.js'

// ============================================================================
// APP INIT
// ============================================================================

gsap.registerPlugin(ScrollTrigger)

gsap.ticker.lagSmoothing(0)

// ============================================================================
// DEVICE
// ============================================================================
const isMobile = window.innerWidth < 768

// ============================================================================
// SCROLL CONFIG
// ============================================================================
/**
 * SCROLL EXPERIENCE CONFIG
 * Общие настройки скролла сайта
 */
const CONFIG = {
	desktop: {
		/**
		 * Общая длина скролл-сценария
		 * > больше = дольше скролл, плавнее переходы
		 * < меньше = быстрее, агрессивнее
		 */
		scrollMultiplier: 1,

		/**
		 * ScrollTrigger scrub (инерция привязки к скроллу)
		 * > больше = сильнее "вязкость", мягче движение
		 * < меньше = резче, быстрее отклик
		 */
		scrub: 2,

		/**
		 * Длительность "заезда" панели (yPercent 100 → 0)
		 * > больше = плавнее вход секций
		 * < меньше = резче переключение
		 */
		panelEnter: 6,

		/**
		 * Длительность свайпа reveal-слайдов
		 * > больше = медленнее, “дороже” переход
		 * < меньше = быстрее переключение
		 */
		revealSwipe: 4,

		/**
		 * Скорость привязки reveal к scroll timeline
		 * > больше = сильнее растяжение скроллом
		 * < меньше = более резкий switch
		 */
		revealScrollSpeed: 0.015,

		/**
		 * Запас длины сцены (кол-во экранов)
		 * 👉 это тот самый "+6"
		 * > больше = больше "воздуха", медленнее поток
		 * < меньше = сцена короче и быстрее
		 */
		scenePaddingPanels: 6,
	},

	mobile: {
		scrollMultiplier: 1.5,
		scrub: 0.3,
		panelEnter: 8,
		revealSwipe: 5,
		revealScrollSpeed: 0.008,

		/**
		 * На мобиле уменьшаем "воздух"
		 * потому что физический скролл длиннее сам по себе
		 */
		scenePaddingPanels: 4,
	},
}
const C = isMobile ? CONFIG.mobile : CONFIG.desktop

export function initHeroIntro() {
	const header = document.querySelector('.header')
	const title = document.querySelector('.hero__title')
	const actions = document.querySelector('.hero__actions')

	const tl = gsap.timeline({
		defaults: {
			duration: 1,
			ease: 'power2.out',
		},
	})

	if (header) {
		tl.fromTo(
			header,
			{
				autoAlpha: 0,
				y: -20,
			},
			{
				autoAlpha: 1,
				y: 0,
			},
			'0.8'
		)
	}

	if (title) {
		tl.fromTo(
			title,
			{
				autoAlpha: 0,
				y: 20,
			},
			{
				autoAlpha: 1,
				y: 0,
			},
			'0.8'
		)
	}

	if (actions) {
		tl.fromTo(
			actions,
			{
				autoAlpha: 0,
				y: 20,
			},
			{
				autoAlpha: 1,
				y: 0,
			},
			'0.9'
		)
	}
}

// ============================================================================
// SCROLL STORY — single master timeline
// One ScrollTrigger drives the entire page sequence: hero video scrub,
// then each stacked panel slides up (yPercent 100 → 0) in strict order.
// ============================================================================

export function initScrollStory() {
	const story = document.querySelector('[data-scroll-story]')
	const panels = gsap.utils.toArray('[data-stack-panel]')
	const hero = panels[0]

	if (!story || !hero) return

	const video = hero.querySelector('.hero__video-media')
	const title = hero.querySelector('.hero__title')
	const cueBlocks = hero.querySelectorAll('[data-hero-video-cue]')

	if (!video) return

	// Layer panels: later sections sit above earlier ones.
	panels.forEach((panel, index) => {
		gsap.set(panel, {
			zIndex: index + 1,
			y: 0,
		})

		if (index > 0) {
			gsap.set(panel, { yPercent: 100 })
		}
	})

	const revealPanel = document.querySelector('.reveal')
	const revealSlides = revealPanel?.querySelectorAll('.reveal__slide')
	const revealProgressFill = revealPanel?.querySelector('.reveal__progress-fill')
	const revealLabels = revealPanel?.querySelectorAll('.reveal__progress-label')

	video.pause()
	video.currentTime = 0

	if (revealSlides?.length) {
		revealSlides.forEach((slide, index) => {
			if (index === 0) return

			gsap.set(slide, {
				clipPath: 'inset(100% 0 0 0)',
			})
		})
	}

	if (revealProgressFill) {
		gsap.set(revealProgressFill, {
			attr: {
				y2: 0,
			},
		})
	}

	gsap.set(cueBlocks, {
		autoAlpha: 0,
		y: 48,
	})

	function buildMasterTimeline() {
		const videoDuration = video.duration || HERO_VIDEO_DURATION
		const overlayPanels = panels.slice(1)

		const baseScroll = window.innerHeight * (panels.length + C.scenePaddingPanels)
		const totalScrollPx = baseScroll * C.scrollMultiplier

		const playhead = { time: 0 }

		const revealTl = gsap.timeline({
			onUpdate() {
				if (!revealLabels?.length || !revealSlides?.length) return

				const progress = revealTl.progress()

				const activeIndex = Math.min(Math.floor(progress * revealSlides.length), revealSlides.length - 1)

				revealLabels.forEach((label, index) => {
					label.classList.toggle('active', index === activeIndex)
				})
			},
		})

		if (revealSlides?.length) {
			revealSlides.forEach((slide, index) => {
				if (index === 0) return
				revealTl.to(slide, {
					clipPath: 'inset(0% 0 0 0)',
					duration: C.revealSwipe,
					ease: 'power3.inOut',
				})
			})

			if (revealProgressFill) {
				revealTl.to(
					revealProgressFill,
					{
						attr: {
							y2: 400,
						},
						duration: revealTl.duration(),
						ease: 'none',
					},
					0
				)
			}
		}

		const masterTl = gsap.timeline({
			defaults: {
				ease: 'none',
			},
			scrollTrigger: {
				trigger: story,
				start: 'top top',
				end: () => `+=${totalScrollPx}`,
				pin: true,
				scrub: C.scrub,
				anticipatePin: 1,
				invalidateOnRefresh: true,
			},
		})

		// HERO
		masterTl.addLabel('hero', 0)

		masterTl.to(
			playhead,
			{
				time: videoDuration,
				duration: videoDuration,
				onUpdate: () => {
					video.currentTime = playhead.time
				},
			},
			'hero'
		)

		if (title) {
			masterTl.to(
				title,
				{
					autoAlpha: 0,
					y: -24,
					duration: 1,
					ease: 'power2.out',
				},
				'hero+=2.8'
			)
		}

		cueBlocks.forEach((block) => {
			masterTl.to(
				block,
				{
					autoAlpha: 1,
					y: 0,
					duration: 4.5,
					ease: 'power2.out',
				},
				'hero+=6'
			)
		})

		// PANELS

		overlayPanels.forEach((panel, index) => {
			const panelHeight = panel.scrollHeight
			const internalScroll = Math.max(0, panelHeight - window.innerHeight)
			const enterDuration = C.panelEnter
			const scrollDuration = internalScroll * C.revealScrollSpeed
			const label = `panel-${index + 1}`

			masterTl.addLabel(label)

			// Заезд панели
			masterTl.fromTo(
				panel,
				{
					yPercent: 100,
				},
				{
					yPercent: 0,
					duration: enterDuration,
					ease: 'none',
				},
				label
			)

			if (panel.classList.contains('reveal')) {
				masterTl.add(revealTl, `${label}+=${enterDuration}`)
			}

			if (internalScroll > 0) {
				masterTl.to(
					panel,
					{
						y: -internalScroll,
						duration: scrollDuration,
						ease: 'none',
					},
					`${label}+=${enterDuration}`
				)
			}
		})

		ScrollTrigger.refresh()
	}

	if (video.readyState >= 1) {
		buildMasterTimeline()
	} else {
		video.addEventListener('loadedmetadata', buildMasterTimeline, {
			once: true,
		})
	}

	const handleResize = debounce(200, () => {
		ScrollTrigger.refresh()
	})

	window.addEventListener('resize', handleResize)
}

// ============================================================================
// SECTION REVEALS
// ============================================================================
