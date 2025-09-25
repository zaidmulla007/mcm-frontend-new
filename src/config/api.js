const API_CONFIG = {
  development: 'http://37.27.120.45:5901',
  production: 'https://mcm.showmyui.com:5000'
};

export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return API_CONFIG.development;
    }
    
    // Vercel deployment (vercel.app domain)
    if (hostname.includes('vercel.app')) {
      return API_CONFIG.development;
    }
    
    // Production domain
    return API_CONFIG.production;
  }
  
  // Server-side rendering fallback
  return process.env.VERCEL 
    ? API_CONFIG.development
    : (process.env.NODE_ENV === 'production' 
        ? API_CONFIG.production 
        : API_CONFIG.development);
};

export const API_BASE_URL = getApiUrl();