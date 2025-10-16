import { supabase } from '../supabase';

// Event types for thank you page
export type ThankYouPageEventType =
  | 'page_view'
  | 'scroll_depth'
  | 'section_view'
  | 'buy_button_click'
  | 'buy_button_view'
  | 'page_exit';

// Session interface for thank you page
export interface ThankYouPageSession {
  id?: string;
  session_id: string;
  email?: string; // From URL params
  quiz_submission_id?: string; // Link to quiz submission
  quiz_score?: number;
  quiz_type?: string;
  page_url: string;
  referrer_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  user_agent?: string;
  browser?: string;
  device_type?: string;
  max_scroll_depth?: number;
  time_on_page_ms?: number;
  clicked_buy_button?: boolean;
  sections_viewed?: string[]; // Array of section IDs viewed
  created_at?: string;
  updated_at?: string;
}

// Event interface
export interface ThankYouPageEvent {
  id?: string;
  session_id: string;
  email?: string; // From URL params for quick user lookup
  event_type: ThankYouPageEventType;
  scroll_depth?: number;
  section_id?: string;
  time_since_page_load_ms?: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

/**
 * Generate or retrieve session ID
 */
function getOrCreateSessionId(): string {
  try {
    const sessionKey = 'thank_you_page_session_id';
    let sessionId = sessionStorage.getItem(sessionKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionKey, sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error('Error managing thank you page session:', error);
    return crypto.randomUUID();
  }
}

/**
 * Extract email from URL params
 */
function getEmailFromUrl(): string | undefined {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('email') || undefined;
  } catch (error) {
    console.error('Error extracting email from URL:', error);
    return undefined;
  }
}

/**
 * Extract UTM params from URL
 */
function getUtmParams() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
    };
  } catch (error) {
    console.error('Error extracting UTM params:', error);
    return {};
  }
}

/**
 * Get browser and device info
 */
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let deviceType = 'desktop';

  // Detect browser
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';

  // Detect device type
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet/i.test(ua)) deviceType = 'tablet';

  return { browser, deviceType };
}

/**
 * Track thank you page view
 */
export async function trackThankYouPageView(quizData?: {
  submissionId?: string;
  score?: number;
  type?: string;
}): Promise<string> {
  try {
    const sessionId = getOrCreateSessionId();
    const email = getEmailFromUrl();
    const utmParams = getUtmParams();
    const browserInfo = getBrowserInfo();

    const sessionData: Partial<ThankYouPageSession> = {
      session_id: sessionId,
      email,
      quiz_submission_id: quizData?.submissionId,
      quiz_score: quizData?.score,
      quiz_type: quizData?.type,
      page_url: window.location.href,
      referrer_url: document.referrer || undefined,
      user_agent: navigator.userAgent,
      browser: browserInfo.browser,
      device_type: browserInfo.deviceType,
      ...utmParams,
    };

    const { error: sessionError } = await supabase
      .from('thank_you_page_sessions')
      .insert([sessionData]);

    if (sessionError) {
      console.error('❌ Error creating thank you page session:', sessionError);
    } else {
      console.log('✅ Thank you page session created:', sessionId, email ? `(${email})` : '');
    }

    // Track page view event
    await trackThankYouPageEvent(sessionId, 'page_view', {
      email,
      metadata: {
        quiz_score: quizData?.score,
        quiz_type: quizData?.type,
        utm_source: utmParams.utm_source,
        utm_campaign: utmParams.utm_campaign,
      },
    });

    return sessionId;
  } catch (error) {
    console.error('❌ Unexpected error tracking thank you page view:', error);
    return getOrCreateSessionId();
  }
}

/**
 * Track scroll depth milestone
 */
export async function trackScrollDepth(
  sessionId: string,
  scrollDepth: number,
  timeSincePageLoad: number
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackThankYouPageEvent(sessionId, 'scroll_depth', {
      email,
      scroll_depth: scrollDepth,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        scroll_depth_percentage: scrollDepth,
      },
    });

    // Update session with max scroll depth
    await updateThankYouPageSession(sessionId, {
      max_scroll_depth: scrollDepth,
    });

    console.log(`✅ Scroll depth tracked: ${scrollDepth}% at ${Math.round(timeSincePageLoad / 1000)}s`);
  } catch (error) {
    console.error('❌ Error tracking scroll depth:', error);
  }
}

/**
 * Track section view (when user scrolls to a specific section)
 */
export async function trackSectionView(
  sessionId: string,
  sectionId: string,
  timeSincePageLoad: number
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackThankYouPageEvent(sessionId, 'section_view', {
      email,
      section_id: sectionId,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        section_id: sectionId,
      },
    });

    console.log(`✅ Section viewed: ${sectionId} at ${Math.round(timeSincePageLoad / 1000)}s`);
  } catch (error) {
    console.error('❌ Error tracking section view:', error);
  }
}

/**
 * Track buy button click
 */
export async function trackBuyButtonClick(
  sessionId: string,
  timeSincePageLoad: number,
  buttonLocation: string
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackThankYouPageEvent(sessionId, 'buy_button_click', {
      email,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        button_location: buttonLocation,
        email: email, // Include email in metadata for easier queries
      },
    });

    // Update session to mark buy button clicked
    await updateThankYouPageSession(sessionId, {
      clicked_buy_button: true,
    });

    console.log(`✅ Buy button clicked: ${buttonLocation} by ${email || 'anonymous'}`);
  } catch (error) {
    console.error('❌ Error tracking buy button click:', error);
  }
}

/**
 * Track buy button view (when it comes into viewport)
 */
export async function trackBuyButtonView(
  sessionId: string,
  timeSincePageLoad: number,
  buttonLocation: string
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackThankYouPageEvent(sessionId, 'buy_button_view', {
      email,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        button_location: buttonLocation,
      },
    });

    console.log(`✅ Buy button viewed: ${buttonLocation} at ${Math.round(timeSincePageLoad / 1000)}s`);
  } catch (error) {
    console.error('❌ Error tracking buy button view:', error);
  }
}

/**
 * Track page exit (when user leaves the page)
 */
export async function trackPageExit(sessionId: string, timeOnPage: number): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackThankYouPageEvent(sessionId, 'page_exit', {
      email,
      time_since_page_load_ms: timeOnPage,
      metadata: {
        time_on_page_ms: timeOnPage,
      },
    });

    // Update session with final time on page
    await updateThankYouPageSession(sessionId, {
      time_on_page_ms: timeOnPage,
    });

    console.log(`✅ Page exit tracked: ${Math.round(timeOnPage / 1000)}s on page`);
  } catch (error) {
    console.error('❌ Error tracking page exit:', error);
  }
}

/**
 * Generic event tracking function
 */
async function trackThankYouPageEvent(
  sessionId: string,
  eventType: ThankYouPageEventType,
  data?: {
    email?: string;
    scroll_depth?: number;
    section_id?: string;
    time_since_page_load_ms?: number;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const eventData: Omit<ThankYouPageEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      email: data?.email,
      event_type: eventType,
      scroll_depth: data?.scroll_depth,
      section_id: data?.section_id,
      time_since_page_load_ms: data?.time_since_page_load_ms,
      metadata: data?.metadata,
    };

    const { error } = await supabase
      .from('thank_you_page_events')
      .insert([eventData]);

    if (error) {
      console.error(`❌ Error tracking ${eventType} event:`, error);
    }
  } catch (error) {
    console.error(`❌ Unexpected error tracking ${eventType} event:`, error);
  }
}

/**
 * Update session with partial data
 */
async function updateThankYouPageSession(
  sessionId: string,
  updates: Partial<ThankYouPageSession>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('thank_you_page_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    if (error) {
      console.error('❌ Error updating thank you page session:', error);
    }
  } catch (error) {
    console.error('❌ Unexpected error updating thank you page session:', error);
  }
}
