import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add(
  {
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  ({ conditions }) => {
    if (conditions?.reduceMotion) {
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.from('[data-hero-item]', { autoAlpha: 0, y: 28, duration: 0.7, stagger: 0.1 });

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((section) => {
      gsap.from(section, {
        autoAlpha: 0,
        y: 48,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
      gsap.from(group.children, {
        autoAlpha: 0,
        y: 28,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: group,
          start: 'top 84%',
          once: true,
        },
      });
    });
  },
);
