import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { addTouchAttr, addLoadedAttr } from '@js/common/functions.js'

import './index.scss'

// ============================================================================
// APP INIT
// ============================================================================

// addTouchAttr()

gsap.registerPlugin(ScrollTrigger)

// ============================================================================
// LENIS
// ============================================================================

export const lenis = new Lenis({
	smoothWheel: true,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
	lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// ============================================================================
// SCROLL STORY — timing constants
// ============================================================================

const HERO_VIDEO_DURATION = 11.05
const HERO_SCROLL_DISTANCE = 2000

function getPanelScrollDistance() {
	return window.innerHeight
}

// ============================================================================
// HERO INTRO (load-time, pre-scroll)
// ============================================================================

function initHeroIntro() {
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

function initScrollStory() {
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
		gsap.set(panel, { zIndex: index + 1 })

		if (index > 0) {
			gsap.set(panel, { yPercent: 100 })
		}
	})

	video.pause()
	video.currentTime = 0

	gsap.set(cueBlocks, {
		autoAlpha: 0,
		y: 48,
	})

	function buildMasterTimeline() {
		const videoDuration = video.duration || HERO_VIDEO_DURATION
		const overlayPanels = panels.slice(1)
		const panelCount = overlayPanels.length
		const panelScrollPx = getPanelScrollDistance()

		// Map scroll pixels to timeline duration so scrub speed stays consistent.
		const panelTimelineDuration = (panelScrollPx / HERO_SCROLL_DISTANCE) * videoDuration
		const totalScrollPx = HERO_SCROLL_DISTANCE + panelCount * panelScrollPx

		const playhead = { time: 0 }

		// ---------------------------------------------------------------------
		// MASTER TIMELINE + SINGLE SCROLLTRIGGER
		// trigger: the pinned viewport wrapper
		// scrub: ties scroll position 1:1 to timeline progress
		// end: total scroll distance across all phases
		// ---------------------------------------------------------------------
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

		// ---------------------------------------------------------------------
		// PHASE 1 — Hero video scrub
		// ---------------------------------------------------------------------
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

		// ---------------------------------------------------------------------
		// PHASE 2+ — Stacked panel transitions (strictly sequential)
		// Each overlay panel enters only after the previous phase completes.
		// ---------------------------------------------------------------------
		overlayPanels.forEach((panel, index) => {
			const phaseStart = videoDuration + index * panelTimelineDuration
			const label = `panel-${index + 1}`

			masterTl.addLabel(label, phaseStart)
			masterTl.fromTo(
				panel,
				{ yPercent: 100 },
				{ yPercent: 0, duration: panelTimelineDuration, ease: 'none' },
				label
			)
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
}

// ============================================================================
// START APP
// ============================================================================
initScrollStory()
addLoadedAttr(() => {
	initHeroIntro()
})
