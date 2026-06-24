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

const HERO_VIDEO_DURATION = 11.05

// ============================================================================
// HERO INTRO
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
// HERO VIDEO
// ============================================================================

function initHeroScrollVideo() {
	const hero = document.querySelector('.hero')

	if (!hero) return

	const video = hero.querySelector('.hero__video-media')
	const title = hero.querySelector('.hero__title')
	const cueBlocks = hero.querySelectorAll('[data-hero-video-cue]')

	if (!video) return

	video.pause()
	video.currentTime = 0

	gsap.set(cueBlocks, {
		autoAlpha: 0,
		y: 48,
	})

	function createTimeline() {
		const duration = video.duration || HERO_VIDEO_DURATION

		const playhead = {
			time: 0,
		}

		const tl = gsap.timeline({
			defaults: {
				ease: 'none',
			},
			scrollTrigger: {
				trigger: hero,
				start: 'top top',
				end: '+=2000',
				pin: true,
				scrub: 1,
				anticipatePin: 1,
				invalidateOnRefresh: true,
			},
		})

		// ---------------------------------------------------------------------
		// VIDEO SCRUB
		// ---------------------------------------------------------------------

		tl.to(
			playhead,
			{
				time: duration,
				duration,
				onUpdate: () => {
					video.currentTime = playhead.time
				},
			},
			0
		)

		// ---------------------------------------------------------------------
		// TITLE HIDE AT 4s
		// ---------------------------------------------------------------------

		if (title) {
			tl.to(
				title,
				{
					autoAlpha: 0,
					y: -24,
					duration: 1,
				},
				2.8
			)
		}

		// ---------------------------------------------------------------------
		// CUE BLOCKS
		// ---------------------------------------------------------------------

		cueBlocks.forEach((block) => {
			tl.to(
				block,
				{
					autoAlpha: 1,
					y: 0,
					duration: 2.5,
					ease: 'power2.out',
				},
				6
			)
		})

		ScrollTrigger.refresh()
	}

	if (video.readyState >= 1) {
		createTimeline()
	} else {
		video.addEventListener('loadedmetadata', createTimeline, {
			once: true,
		})
	}
}

// ============================================================================
// START APP
// ============================================================================
initHeroScrollVideo()
addLoadedAttr(() => {
	initHeroIntro()
})
