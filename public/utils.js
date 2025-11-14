// This is a new utility file WITHOUT tests to trigger the auto-test-generation action

/**
 * Utility functions for the weather app
 */

const formatTemperature = (kelvin, unit = "F") => {
  if (unit === "F") {
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
  } else if (unit === "C") {
    return Math.round(kelvin - 273.15);
  }
  return kelvin;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const validateCity = (cityName) => {
  if (!cityName || cityName.trim().length === 0) {
    return false;
  }
  // Basic validation: only letters, spaces, and hyphens
  const cityPattern = /^[a-zA-Z\s\-]+$/;
  return cityPattern.test(cityName);
};

const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

module.exports = {
  formatTemperature,
  formatDate,
  getWeatherIcon,
  validateCity,
  truncateText,
};
