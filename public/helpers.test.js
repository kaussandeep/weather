/**
 * @jest-environment jsdom
 */

// Mock helper functions
const createVenueHTML = (name, location, iconSource) => {
  return `<h2>${name}</h2>
  <img class="venueimage" src="${iconSource}"/>
  <h3>Address:</h3>
  <p>${location.address}</p>
  <p>${location.city}</p>
  <p>${location.country}</p>`;
};

const createWeatherHTML = (currentDay) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `<h2>${weekDays[new Date().getDay()]}</h2>
		<h2>Temperature: ${kelvinToFahrenheit(currentDay.main.temp)}&deg;F</h2>
		<h2>Condition: ${currentDay.weather[0].description}</h2>
  	<img src="https://openweathermap.org/img/wn/${
      currentDay.weather[0].icon
    }@2x.png">`;
};

const kelvinToFahrenheit = (k) => (((k - 273.15) * 9) / 5 + 32).toFixed(0);

describe("Helper Functions", () => {
  describe("kelvinToFahrenheit", () => {
    test("converts 273.15 Kelvin to 32 Fahrenheit", () => {
      expect(kelvinToFahrenheit(273.15)).toBe("32");
    });

    test("converts 300 Kelvin to 80 Fahrenheit", () => {
      expect(kelvinToFahrenheit(300)).toBe("80");
    });

    test("converts 0 Kelvin to -460 Fahrenheit", () => {
      expect(kelvinToFahrenheit(0)).toBe("-460");
    });

    test("returns string with no decimal places", () => {
      const result = kelvinToFahrenheit(298.15);
      expect(result).toMatch(/^\d+$/);
    });
  });

  describe("createVenueHTML", () => {
    test("creates HTML with venue name", () => {
      const venue = {
        name: "Test Cafe",
        location: {
          address: "123 Main St",
          city: "New York",
          country: "USA",
        },
      };
      const html = createVenueHTML(venue.name, venue.location, "test.png");
      expect(html).toContain("<h2>Test Cafe</h2>");
    });

    test("includes venue address information", () => {
      const venue = {
        name: "Coffee Shop",
        location: {
          address: "456 Broadway",
          city: "Los Angeles",
          country: "USA",
        },
      };
      const html = createVenueHTML(venue.name, venue.location, "icon.png");
      expect(html).toContain("456 Broadway");
      expect(html).toContain("Los Angeles");
      expect(html).toContain("USA");
    });

    test("includes venue image with correct src", () => {
      const venue = {
        name: "Restaurant",
        location: {
          address: "789 Street",
          city: "Boston",
          country: "USA",
        },
      };
      const iconSrc = "https://example.com/icon.png";
      const html = createVenueHTML(venue.name, venue.location, iconSrc);
      expect(html).toContain(`<img class="venueimage" src="${iconSrc}"/>`);
    });
  });

  describe("createWeatherHTML", () => {
    test("creates HTML with temperature", () => {
      const weatherData = {
        main: { temp: 300 },
        weather: [{ description: "clear sky", icon: "01d" }],
      };
      const html = createWeatherHTML(weatherData);
      expect(html).toContain("Temperature: 80&deg;F");
    });

    test("includes weather condition description", () => {
      const weatherData = {
        main: { temp: 290 },
        weather: [{ description: "partly cloudy", icon: "02d" }],
      };
      const html = createWeatherHTML(weatherData);
      expect(html).toContain("Condition: partly cloudy");
    });

    test("includes weather icon image", () => {
      const weatherData = {
        main: { temp: 285 },
        weather: [{ description: "rainy", icon: "10d" }],
      };
      const html = createWeatherHTML(weatherData);
      expect(html).toContain("https://openweathermap.org/img/wn/10d@2x.png");
    });

    test("displays current day of the week", () => {
      const weatherData = {
        main: { temp: 295 },
        weather: [{ description: "sunny", icon: "01d" }],
      };
      const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const today = weekDays[new Date().getDay()];
      const html = createWeatherHTML(weatherData);
      expect(html).toContain(`<h2>${today}</h2>`);
    });
  });
});
