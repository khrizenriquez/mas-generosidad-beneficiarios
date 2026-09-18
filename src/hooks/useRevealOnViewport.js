import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion() {
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
}

/**
 * Reveals a card once it enters the viewport without attaching a scroll listener.
 *
 * @returns {{ref: import('react').RefObject<HTMLElement | null>, isRevealed: boolean, reduceMotion: boolean}}
 */
export function useRevealOnViewport() {
  const ref = useRef(null);
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  const [isRevealed, setIsRevealed] = useState(
    () => prefersReducedMotion() || !supportsIntersectionObserver,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (!mediaQuery) {
      return undefined;
    }

    const handleMotionPreference = (event) => {
      setReduceMotion(event.matches);
      if (event.matches) {
        setIsRevealed(true);
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreference);
    return () =>
      mediaQuery.removeEventListener('change', handleMotionPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion || !supportsIntersectionObserver || !ref.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0.12 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduceMotion, supportsIntersectionObserver]);

  return { ref, isRevealed, reduceMotion };
}
