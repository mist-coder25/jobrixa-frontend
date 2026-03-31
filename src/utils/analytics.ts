import posthog from 'posthog-js';

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
    // Microsoft Clarity
    if ((window as any).clarity) {
      (window as any).clarity('event', eventName);
    }
    // PostHog
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  posthog.identify(userId, properties);
};

