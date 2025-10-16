import { useEffect, useRef, useState } from 'react';

/**
 * Hook to track scroll depth on a page
 * Returns percentage of page scrolled and triggers callbacks at milestones
 */
export function useScrollDepth(options?: {
  milestones?: number[]; // e.g., [25, 50, 75, 100]
  onMilestone?: (milestone: number) => void;
  throttle?: number; // ms
}) {
  const {
    milestones = [25, 50, 75, 90, 100],
    onMilestone,
    throttle = 500,
  } = options || {};

  const [scrollDepth, setScrollDepth] = useState(0);
  const [maxScrollDepth, setMaxScrollDepth] = useState(0);
  const triggeredMilestones = useRef<Set<number>>(new Set());
  const throttleTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const calculateScrollDepth = () => {
      // Calculate how far down the page the user has scrolled
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const totalScrollableHeight = documentHeight - windowHeight;
      const currentScrollPercentage = totalScrollableHeight > 0
        ? Math.round((scrollTop / totalScrollableHeight) * 100)
        : 0;

      setScrollDepth(currentScrollPercentage);

      // Track max scroll depth (furthest the user has scrolled)
      setMaxScrollDepth(prev => Math.max(prev, currentScrollPercentage));

      // Check for milestone triggers
      milestones.forEach(milestone => {
        if (
          currentScrollPercentage >= milestone &&
          !triggeredMilestones.current.has(milestone)
        ) {
          triggeredMilestones.current.add(milestone);
          onMilestone?.(milestone);
        }
      });
    };

    const handleScroll = () => {
      // Throttle scroll events
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }

      throttleTimeout.current = setTimeout(() => {
        calculateScrollDepth();
      }, throttle);
    };

    // Initial calculation
    calculateScrollDepth();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [milestones, onMilestone, throttle]);

  return {
    scrollDepth,
    maxScrollDepth,
  };
}
