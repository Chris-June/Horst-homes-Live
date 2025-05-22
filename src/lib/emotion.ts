import createCache from '@emotion/cache';

// Create a function to create a cache instance
const createEmotionCache = () => {
  // Only run this on the client-side
  if (typeof document !== 'undefined') {
    // Find the insertion point by ID
    let insertionPoint = document.getElementById('emotion-insertion-point');
    
    // If not found, try finding by name for backward compatibility
    if (!insertionPoint) {
      insertionPoint = document.querySelector<HTMLElement>('meta[name="emotion-insertion-point"]');
    }
    
    // If still not found, create one
    if (!insertionPoint) {
      insertionPoint = document.createElement('meta');
      insertionPoint.setAttribute('name', 'emotion-insertion-point');
      insertionPoint.id = 'emotion-insertion-point';
      insertionPoint.setAttribute('content', '');
      document.head.appendChild(insertionPoint);
    }
    
    return createCache({
      key: 'css',
      prepend: true,
      insertionPoint: insertionPoint as HTMLElement,
    });
  }
  
  // Return a no-op cache for server-side
  return createCache({ key: 'css' });
};

// Create and export the cache instance
export const emotionCache = createEmotionCache();
