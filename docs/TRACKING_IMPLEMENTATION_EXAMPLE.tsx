/**
 * TRACKING IMPLEMENTATION EXAMPLE
 *
 * This file shows how to integrate the new tracking system into:
 * 1. Thank You Page
 * 2. Product Page (FireStarter)
 *
 * Copy the relevant code snippets into your actual pages.
 */

import React, { useEffect, useRef } from 'react';
import { useScrollDepth } from '../hooks/useScrollDepth';

// ============================================================
// EXAMPLE 1: THANK YOU PAGE IMPLEMENTATION
// ============================================================

import {
  trackThankYouPageView,
  trackScrollDepth as trackThankYouScrollDepth,
  trackSectionView as trackThankYouSectionView,
  trackBuyButtonClick as trackThankYouBuyClick,
  trackBuyButtonView as trackThankYouBuyView,
  trackPageExit as trackThankYouPageExit,
} from '../lib/services/thankYouPageEvents';

export function ThankYouPageExample() {
  // Tracking state
  const sessionIdRef = useRef<string>();
  const pageLoadTime = useRef(Date.now());

  // Initialize tracking on page load
  useEffect(() => {
    // Track page view with quiz data
    trackThankYouPageView({
      submissionId: 'quiz-submission-id', // Replace with actual quiz submission ID
      score: 8, // Replace with actual quiz score
      type: 'Overthinkaholic', // Replace with actual quiz type
    }).then((sessionId) => {
      sessionIdRef.current = sessionId;
    });

    // Track page exit when user leaves
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const timeOnPage = Date.now() - pageLoadTime.current;
        trackThankYouPageExit(sessionIdRef.current, timeOnPage);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track scroll depth milestones
  useScrollDepth({
    milestones: [25, 50, 75, 90, 100],
    onMilestone: (milestone) => {
      if (sessionIdRef.current) {
        const timeSincePageLoad = Date.now() - pageLoadTime.current;
        trackThankYouScrollDepth(sessionIdRef.current, milestone, timeSincePageLoad);
      }
    },
  });

  // Track section visibility using Intersection Observer
  useEffect(() => {
    if (!sessionIdRef.current) return;

    const sections = document.querySelectorAll('[data-section-id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sessionIdRef.current) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              const timeSincePageLoad = Date.now() - pageLoadTime.current;
              trackThankYouSectionView(sessionIdRef.current, sectionId, timeSincePageLoad);
            }
          }
        });
      },
      { threshold: 0.5 } // 50% of section must be visible
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Track buy button clicks
  const handleBuyClick = (buttonLocation: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current;
      trackThankYouBuyClick(sessionIdRef.current, timeSincePageLoad, buttonLocation);
    }

    // Continue with normal checkout flow
    window.location.href = 'https://your-checkout-url.com';
  };

  return (
    <div>
      {/* Hero Section */}
      <section data-section-id="hero">
        <h1>Your Quiz Results</h1>
        <button onClick={() => handleBuyClick('hero')}>
          Get F.I.R.E. Protocol - $67
        </button>
      </section>

      {/* Diagnosis Section */}
      <section data-section-id="diagnosis">
        <h2>You're a Shame-Locked Ruminator</h2>
        <p>Here's what that means...</p>
      </section>

      {/* Solution Section */}
      <section data-section-id="solution">
        <h2>The F.I.R.E. Protocol Can Help</h2>
        <button onClick={() => handleBuyClick('solution')}>
          Get Started - $67
        </button>
      </section>

      {/* Research Section */}
      <section data-section-id="research">
        <h2>The Science Behind It</h2>
      </section>

      {/* Final CTA */}
      <section data-section-id="final-cta">
        <button onClick={() => handleBuyClick('final-cta')}>
          Get F.I.R.E. Protocol - $67
        </button>
      </section>
    </div>
  );
}

// ============================================================
// EXAMPLE 2: PRODUCT PAGE (FIRE STARTER) IMPLEMENTATION
// ============================================================

import {
  trackProductPageView,
  trackScrollDepth as trackProductScrollDepth,
  trackSectionView as trackProductSectionView,
  trackBuyButtonClick as trackProductBuyClick,
  trackBuyButtonView as trackProductBuyView,
  trackPriceViewed,
  trackFaqExpand,
  trackPageExit as trackProductPageExit,
} from '../lib/services/productPageEvents';

export function FireStarterPageExample() {
  // Tracking state
  const sessionIdRef = useRef<string>();
  const pageLoadTime = useRef(Date.now());

  // Initialize tracking on page load
  useEffect(() => {
    trackProductPageView('fire-starter').then((sessionId) => {
      sessionIdRef.current = sessionId;
    });

    // Track page exit
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const timeOnPage = Date.now() - pageLoadTime.current;
        trackProductPageExit(sessionIdRef.current, timeOnPage);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track scroll depth
  useScrollDepth({
    milestones: [25, 50, 75, 90, 100],
    onMilestone: (milestone) => {
      if (sessionIdRef.current) {
        const timeSincePageLoad = Date.now() - pageLoadTime.current;
        trackProductScrollDepth(sessionIdRef.current, milestone, timeSincePageLoad);
      }
    },
  });

  // Track price section visibility
  useEffect(() => {
    const priceSection = document.querySelector('[data-section-id="pricing"]');
    if (!priceSection || !sessionIdRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && sessionIdRef.current) {
          const timeSincePageLoad = Date.now() - pageLoadTime.current;
          trackPriceViewed(sessionIdRef.current, timeSincePageLoad);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(priceSection);
    return () => observer.disconnect();
  }, []);

  // Track buy button clicks
  const handleBuyClick = (buttonLocation: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current;
      trackProductBuyClick(sessionIdRef.current, timeSincePageLoad, buttonLocation);
    }

    // Continue with checkout
    window.location.href = 'https://your-checkout-url.com';
  };

  // Track FAQ expansion
  const handleFaqClick = (question: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current;
      trackFaqExpand(sessionIdRef.current, question, timeSincePageLoad);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section data-section-id="hero">
        <h1>Your Body Decides to Panic 7 Seconds Before Your Brain Knows</h1>
        <button onClick={() => handleBuyClick('hero')}>
          Get F.I.R.E. Protocol - $67
        </button>
      </section>

      {/* Research Section */}
      <section data-section-id="research">
        <h2>The Research Behind F.I.R.E.</h2>
      </section>

      {/* Features Section */}
      <section data-section-id="features">
        <h2>How F.I.R.E. Works</h2>
      </section>

      {/* Pricing Section */}
      <section data-section-id="pricing">
        <h2>Get F.I.R.E. Protocol Today</h2>
        <p className="text-4xl font-bold">$67</p>
        <button onClick={() => handleBuyClick('pricing')}>
          Get Started Now
        </button>
      </section>

      {/* FAQ Section */}
      <section data-section-id="faq">
        <h2>Frequently Asked Questions</h2>
        <button onClick={() => handleFaqClick('How is this different from therapy?')}>
          How is this different from therapy?
        </button>
        <button onClick={() => handleFaqClick('What if I have a low quiz score?')}>
          What if I have a low quiz score?
        </button>
      </section>

      {/* Final CTA */}
      <section data-section-id="final-cta">
        <button onClick={() => handleBuyClick('final-cta')}>
          Get F.I.R.E. Protocol - $67
        </button>
      </section>
    </div>
  );
}

// ============================================================
// INTEGRATION CHECKLIST
// ============================================================

/**
 * TODO: Before deploying
 *
 * 1. ✅ Run database migration (supabase migration up)
 * 2. □ Copy tracking initialization code into ThankYouPage component
 * 3. □ Copy tracking initialization code into FireStarter component
 * 4. □ Add data-section-id attributes to all major sections
 * 5. □ Add tracking to all buy button click handlers
 * 6. □ Test with ?email=test@example.com URL param
 * 7. □ Verify data in Supabase tables
 * 8. □ Build analytics dashboard to view insights
 *
 * NOTE: Email tracking works automatically if email is in URL params.
 * Example URLs:
 * - /thank-you?email=user@example.com&score=8&type=Overthinkaholic
 * - /product/fire-starter?email=user@example.com&utm_campaign=retargeting_day3
 */
