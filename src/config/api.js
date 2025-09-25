const API_CONFIG = {
  development: 'http://37.27.120.45:5901',
  production: 'https://mcm.showmyui.com:5000'
};

export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? API_CONFIG.development
      : API_CONFIG.production;
  }
  
  return process.env.NODE_ENV === 'production' 
    ? API_CONFIG.production 
    : API_CONFIG.development;
};

export const API_BASE_URL = getApiUrl();