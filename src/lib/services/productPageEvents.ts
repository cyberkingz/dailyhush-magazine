import { supabase } from '../supabase';

// Event types for product page
export type ProductPageEventType =
  | 'page_view'
  | 'scroll_depth'
  | 'section_view'
  | 'buy_button_click'
  | 'buy_button_view'
  | 'price_viewed'
  | 'testimonial_click'
  | 'faq_expand'
  | 'page_exit';

// Session interface for product page
export interface ProductPageSession {
  id?: string;
  session_id: string;
  email?: string; // From URL params (retargeting emails)
  product_id?: string; // e.g., 'fire-starter'
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
  viewed_price?: boolean;
  sections_viewed?: string[]; // Array of section IDs viewed
  created_at?: string;
  updated_at?: string;
}

// Event interface
export interface ProductPageEvent {
  id?: string;
  session_id: string;
  email?: string; // From URL params for quick user lookup
  event_type: ProductPageEventType;
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
    const sessionKey = 'product_page_session_id';
    let sessionId = sessionStorage.getItem(sessionKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionKey, sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error('Error managing product page session:', error);
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
 * Track product page view
 */
export async function trackProductPageView(productId: string = 'fire-starter'): Promise<string> {
  try {
    const sessionId = getOrCreateSessionId();
    const email = getEmailFromUrl();
    const utmParams = getUtmParams();
    const browserInfo = getBrowserInfo();

    const sessionData: Partial<ProductPageSession> = {
      session_id: sessionId,
      email,
      product_id: productId,
      page_url: window.location.href,
      referrer_url: document.referrer || undefined,
      user_agent: navigator.userAgent,
      browser: browserInfo.browser,
      device_type: browserInfo.deviceType,
      ...utmParams,
    };

    const { error: sessionError } = await supabase
      .from('product_page_sessions')
      .insert([sessionData]);

    if (sessionError) {
      console.error('❌ Error creating product page session:', sessionError);
    } else {
      console.log('✅ Product page session created:', sessionId, email ? `(${email})` : '');
    }

    // Track page view event
    await trackProductPageEvent(sessionId, 'page_view', {
      email,
      metadata: {
        product_id: productId,
        utm_source: utmParams.utm_source,
        utm_campaign: utmParams.utm_campaign,
        is_retargeting: !!email, // Flag if email is present (retargeting)
      },
    });

    return sessionId;
  } catch (error) {
    console.error('❌ Unexpected error tracking product page view:', error);
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

    await trackProductPageEvent(sessionId, 'scroll_depth', {
      email,
      scroll_depth: scrollDepth,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        scroll_depth_percentage: scrollDepth,
      },
    });

    // Update session with max scroll depth
    await updateProductPageSession(sessionId, {
      max_scroll_depth: scrollDepth,
    });

    console.log(`✅ Product page scroll depth: ${scrollDepth}% at ${Math.round(timeSincePageLoad / 1000)}s`);
  } catch (error) {
    console.error('❌ Error tracking scroll depth:', error);
  }
}

/**
 * Track section view
 */
export async function trackSectionView(
  sessionId: string,
  sectionId: string,
  timeSincePageLoad: number
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackProductPageEvent(sessionId, 'section_view', {
      email,
      section_id: sectionId,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        section_id: sectionId,
      },
    });

    console.log(`✅ Product section viewed: ${sectionId} at ${Math.round(timeSincePageLoad / 1000)}s`);
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

    await trackProductPageEvent(sessionId, 'buy_button_click', {
      email,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        button_location: buttonLocation,
        email: email, // Include email in metadata for easier queries
      },
    });

    // Update session to mark buy button clicked
    await updateProductPageSession(sessionId, {
      clicked_buy_button: true,
    });

    console.log(`✅ Product buy button clicked: ${buttonLocation} by ${email || 'anonymous'}`);

    // Also track with Facebook Pixel if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'F.I.R.E. Protocol',
        value: 67,
        currency: 'USD',
      });
    }
  } catch (error) {
    console.error('❌ Error tracking buy button click:', error);
  }
}

/**
 * Track buy button view
 */
export async function trackBuyButtonView(
  sessionId: string,
  timeSincePageLoad: number,
  buttonLocation: string
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackProductPageEvent(sessionId, 'buy_button_view', {
      email,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        button_location: buttonLocation,
      },
    });

    console.log(`✅ Product buy button viewed: ${buttonLocation}`);
  } catch (error) {
    console.error('❌ Error tracking buy button view:', error);
  }
}

/**
 * Track price viewed
 */
export async function trackPriceViewed(
  sessionId: string,
  timeSincePageLoad: number
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackProductPageEvent(sessionId, 'price_viewed', {
      email,
      time_since_page_load_ms: timeSincePageLoad,
    });

    // Update session to mark price viewed
    await updateProductPageSession(sessionId, {
      viewed_price: true,
    });

    console.log(`✅ Product price viewed`);
  } catch (error) {
    console.error('❌ Error tracking price viewed:', error);
  }
}

/**
 * Track FAQ expansion
 */
export async function trackFaqExpand(
  sessionId: string,
  faqQuestion: string,
  timeSincePageLoad: number
): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackProductPageEvent(sessionId, 'faq_expand', {
      email,
      time_since_page_load_ms: timeSincePageLoad,
      metadata: {
        faq_question: faqQuestion,
      },
    });

    console.log(`✅ FAQ expanded: ${faqQuestion.substring(0, 50)}...`);
  } catch (error) {
    console.error('❌ Error tracking FAQ expand:', error);
  }
}

/**
 * Track page exit
 */
export async function trackPageExit(sessionId: string, timeOnPage: number): Promise<void> {
  try {
    const email = getEmailFromUrl();

    await trackProductPageEvent(sessionId, 'page_exit', {
      email,
      time_since_page_load_ms: timeOnPage,
      metadata: {
        time_on_page_ms: timeOnPage,
      },
    });

    // Update session with final time on page
    await updateProductPageSession(sessionId, {
      time_on_page_ms: timeOnPage,
    });

    console.log(`✅ Product page exit: ${Math.round(timeOnPage / 1000)}s on page`);
  } catch (error) {
    console.error('❌ Error tracking page exit:', error);
  }
}

/**
 * Generic event tracking function
 */
async function trackProductPageEvent(
  sessionId: string,
  eventType: ProductPageEventType,
  data?: {
    email?: string;
    scroll_depth?: number;
    section_id?: string;
    time_since_page_load_ms?: number;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const eventData: Omit<ProductPageEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      email: data?.email,
      event_type: eventType,
      scroll_depth: data?.scroll_depth,
      section_id: data?.section_id,
      time_since_page_load_ms: data?.time_since_page_load_ms,
      metadata: data?.metadata,
    };

    const { error } = await supabase
      .from('product_page_events')
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
async function updateProductPageSession(
  sessionId: string,
  updates: Partial<ProductPageSession>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('product_page_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    if (error) {
      console.error('❌ Error updating product page session:', error);
    }
  } catch (error) {
    console.error('❌ Unexpected error updating product page session:', error);
  }
}
