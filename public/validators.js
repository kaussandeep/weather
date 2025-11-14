// Input Validation Functions
// NO TESTS - This should trigger the auto-test-generation action!

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's 10 digits (US format) or 11 digits (with country code)
  return cleaned.length === 10 || cleaned.length === 11;
};

const validateZipCode = (zipCode, country = 'US') => {
  if (country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  } else if (country === 'CA') {
    return /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(zipCode);
  }
  return true; // Don't validate for other countries
};

const validateCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }
  
  return latitude >= -90 && latitude <= 90 && 
         longitude >= -180 && longitude <= 180;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  
  return end >= start;
};

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validateZipCode,
  validateCoordinates,
  sanitizeInput,
  validateDateRange,
  isValidUrl
};
