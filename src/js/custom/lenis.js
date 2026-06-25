// import Lenis from '@studio-freight/lenis';
import Lenis from 'lenis'

// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

export function initLenis() {
	//================================================
	// Balanced (твій майже стандарт)
	//   const lenis = new Lenis({
	//     duration: 0.9,
	//     easing: (t) => 1 - Math.pow(1 - t, 2.5),
	//     smooth: true,
	//   });

	// Більш плавний (cinematic)
	//   const lenis = new Lenis({
	//     duration: 1.2,
	//     easing: (t) => 1 - Math.pow(1 - t, 3),
	//     smooth: true,
	//   });

	// Дуже мʼякий, "apple style"
	const lenis = new Lenis({
		duration: 1.4,
		easing: (t) => 1 - Math.pow(1 - t, 4),
		smooth: true,
	})

	// Швидший, більш responsive
	//   const lenis = new Lenis({
	//     duration: 0.7,
	//     easing: (t) => 1 - Math.pow(1 - t, 2),
	//     smooth: true,
	//   });

	// Дуже швидкий (майже native)

	//   const lenis = new Lenis({
	//     duration: 0.5,
	//     easing: (t) => 1 - Math.pow(1 - t, 1.5),
	//     smooth: true,
	//   });

	// З інерцією через lerp (альтернатива duration)
	//   const lenis = new Lenis({
	//     lerp: 0.08,
	//     smooth: true,
	//   });

	// Повільний для storytelling-сайту

	// const lenis = new Lenis({
	//   duration: 1.6,
	//   easing: (t) => 1 - Math.pow(1 - t, 5),
	//   smooth: true,
	// });

	// Точний під 144Hz монітор

	//   const lenis = new Lenis({
	//     duration: 0.8,
	//     easing: (t) => 1 - Math.pow(1 - t, 2.2),
	//     smooth: true,
	//   });

	// Агресивний, "snappy"

	// const lenis = new Lenis({
	//   duration: 0.6,
	//   easing: (t) => 1 - Math.pow(1 - t, 3),
	//   smooth: true,
	// });

	// "snappy" Трохи мʼякший, але швидкий
	//   const lenis = new Lenis({
	//     duration: 0.65,
	//     easing: (t) => 1 - Math.pow(1 - t, 2.7),
	//     smooth: true,
	//   });

	// "snappy" Більш різкий старт
	//   const lenis = new Lenis({
	//     duration: 0.6,
	//     easing: (t) => 1 - Math.pow(1 - t, 3.5),
	//     smooth: true,
	//   });

	// "snappy" Дуже responsive (майже native)

	//   const lenis = new Lenis({
	//     duration: 0.55,
	//     easing: (t) => 1 - Math.pow(1 - t, 2.4),
	//     smooth: true,
	//   });

	// "snappy" Більш плавний фініш
	//   const lenis = new Lenis({
	//     duration: 0.7,
	//     easing: (t) => 1 - Math.pow(1 - t, 3.2),
	//     smooth: true,
	//   });

	// "snappy" Дуже чіткий контроль для scrub-анімацій

	// const lenis = new Lenis({
	//   duration: 0.6,
	//   easing: (t) => 1 - Math.pow(1 - t, 2.2),
	//   smooth: true,
	// });
	//================================================

	//   lenis.on('scroll', ScrollTrigger.update);

	let rafId

	function raf(time) {
		lenis.raf(time)
		rafId = requestAnimationFrame(raf)
	}

	rafId = requestAnimationFrame(raf)

	function toggleLenisLock() {
		const isLocked = document.documentElement.hasAttribute('data-fls-scrolllock')

		isLocked ? lenis.stop() : lenis.start()
	}

	toggleLenisLock()

	const observer = new MutationObserver((mutations) => {
		if (mutations.some((m) => m.attributeName === 'data-fls-scrolllock')) {
			toggleLenisLock()
		}
	})

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-fls-scrolllock'],
	})

	return lenis
}
