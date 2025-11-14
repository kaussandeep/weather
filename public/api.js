// API Configuration and Helper Functions
// This file has NO tests - should trigger auto-test generation!

const API_CONFIG = {
  foursquare: {
    baseUrl: 'https://api.foursquare.com/v2/venues/explore',
    version: '20200404'
  },
  openWeather: {
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    units: 'metric'
  }
};

const buildApiUrl = (service, params) => {
  const config = API_CONFIG[service];
  if (!config) {
    throw new Error(`Unknown service: ${service}`);
  }
  
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  return `${config.baseUrl}?${queryString}`;
};

const handleApiError = (error, serviceName) => {
  console.error(`Error in ${serviceName}:`, error);
  return {
    success: false,
    error: error.message || 'An unknown error occurred',
    service: serviceName
  };
};

const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

const cacheResponse = (key, data, expirationMinutes = 10) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
    expiration: expirationMinutes * 60 * 1000
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

const getCachedResponse = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  const { data, timestamp, expiration } = JSON.parse(cached);
  if (Date.now() - timestamp > expiration) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data;
};

module.exports = {
  API_CONFIG,
  buildApiUrl,
  handleApiError,
  retryRequest,
  cacheResponse,
  getCachedResponse
};
