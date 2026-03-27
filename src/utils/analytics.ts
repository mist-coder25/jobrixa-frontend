export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
  // Microsoft Clarity
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('event', eventName);
  }
};
