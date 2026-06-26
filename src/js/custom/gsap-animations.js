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
// SCROLL STORY — timing constants
// ============================================================================

const HERO_VIDEO_DURATION = 11.05
const HERO_SCROLL_DISTANCE = 2000

// ============================================================================
// HERO INTRO (load-time, pre-scroll)
// ============================================================================

export function initHeroIntro() {
	const header = document.querySelector('.header')
	const title = document.querySelector('.hero__title')
	const actions = document.querySelector('.hero__actions')

	const tl = gsap.timeline({
		defaults: {
			duration: 0.8,
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
			'0.5'
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
			'0.5'
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
			'0.6'
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
		const panelHeights = overlayPanels.map((panel) => Math.max(panel.scrollHeight, window.innerHeight))
		const panelDurations = panelHeights.map((height) => (height / HERO_SCROLL_DISTANCE) * videoDuration)
		const totalPanelsScroll = panelHeights.reduce((sum, height) => sum + height, 0)
		const totalScrollPx = HERO_SCROLL_DISTANCE + totalPanelsScroll
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

				// revealTl.to(slide, {
				// 	clipPath: 'inset(0% 0 0 0)',
				// 	duration: 1,
				// 	ease: 'none',
				// })
				revealTl.to(slide, {
					clipPath: 'inset(0% 0 0 0)',
					duration: 3,
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
				scrub: 1,
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
		let phaseStart = videoDuration

		overlayPanels.forEach((panel, index) => {
			const panelHeight = panel.scrollHeight
			const internalScroll = Math.max(0, panelHeight - window.innerHeight)
			const enterDuration = panelDurations[index] * 0.7
			const scrollDuration = internalScroll > 0 ? panelDurations[index] : 0
			const label = `panel-${index + 1}`

			masterTl.addLabel(label, phaseStart)

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

			if (panel.classList.contains('reveal')) {
				phaseStart += enterDuration + scrollDuration + revealTl.duration() * 0.65
			} else {
				phaseStart += enterDuration + scrollDuration
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
// START APP
// ============================================================================
