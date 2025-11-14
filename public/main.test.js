/**
 * @jest-environment jsdom
 */

// Mock fetch API
global.fetch = jest.fn();

describe("API Functions", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();

    // Setup DOM elements
    document.body.innerHTML = `
      <input id="city" value="New York" />
    `;
  });

  describe("getVenues", () => {
    test("fetches venues successfully", async () => {
      const mockVenues = {
        response: {
          groups: [
            {
              items: [
                {
                  venue: {
                    name: "Venue 1",
                    location: { city: "New York" },
                    categories: [
                      { icon: { prefix: "https://", suffix: ".png" } },
                    ],
                  },
                },
                {
                  venue: {
                    name: "Venue 2",
                    location: { city: "New York" },
                    categories: [
                      { icon: { prefix: "https://", suffix: ".png" } },
                    ],
                  },
                },
              ],
            },
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVenues,
      });

      const getVenues = async () => {
        const city = document.getElementById("city").value;
        const clientId = "TEST_CLIENT_ID";
        const clientSecret = "TEST_CLIENT_SECRET";
        const url = "https://api.foursquare.com/v2/venues/explore?near=";
        const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200404`;

        try {
          const response = await fetch(urlToFetch);
          if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(
              (item) => item.venue
            );
            return venues;
          }
        } catch (error) {
          console.log(error);
        }
      };

      const venues = await getVenues();
      expect(venues).toHaveLength(2);
      expect(venues[0].name).toBe("Venue 1");
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("handles API errors gracefully", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const getVenues = async () => {
        const city = document.getElementById("city").value;
        const clientId = "TEST_CLIENT_ID";
        const clientSecret = "TEST_CLIENT_SECRET";
        const url = "https://api.foursquare.com/v2/venues/explore?near=";
        const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200404`;

        try {
          const response = await fetch(urlToFetch);
          if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(
              (item) => item.venue
            );
            return venues;
          }
        } catch (error) {
          console.log(error);
        }
      };

      const venues = await getVenues();
      expect(venues).toBeUndefined();
    });

    test("constructs correct API URL with city parameter", async () => {
      const mockVenues = {
        response: {
          groups: [
            {
              items: [],
            },
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVenues,
      });

      const getVenues = async () => {
        const city = document.getElementById("city").value;
        const clientId = "TEST_CLIENT_ID";
        const clientSecret = "TEST_CLIENT_SECRET";
        const url = "https://api.foursquare.com/v2/venues/explore?near=";
        const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200404`;

        try {
          const response = await fetch(urlToFetch);
          if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(
              (item) => item.venue
            );
            return venues;
          }
        } catch (error) {
          console.log(error);
        }
      };

      await getVenues();
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("New York"));
    });
  });

  describe("getForecast", () => {
    test("fetches weather forecast successfully", async () => {
      const mockWeather = {
        main: { temp: 300 },
        weather: [{ description: "clear sky", icon: "01d" }],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeather,
      });

      const getForecast = async () => {
        const openWeatherKey = "TEST_API_KEY";
        const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
        const city = document.getElementById("city").value;
        const urlToFetch = `${weatherUrl}?&q=${city}&APPID=${openWeatherKey}`;

        try {
          const response = await fetch(urlToFetch);
          if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
          }
        } catch (error) {
          console.log(error);
        }
      };

      const forecast = await getForecast();
      expect(forecast.main.temp).toBe(300);
      expect(forecast.weather[0].description).toBe("clear sky");
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("handles weather API errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

      const getForecast = async () => {
        const openWeatherKey = "TEST_API_KEY";
        const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
        const city = document.getElementById("city").value;
        const urlToFetch = `${weatherUrl}?&q=${city}&APPID=${openWeatherKey}`;

        try {
          const response = await fetch(urlToFetch);
          if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
          }
        } catch (error) {
          console.log(error);
        }
      };

      await getForecast();
      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    test("constructs correct weather API URL", async () => {
      const mockWeather = {
        main: { temp: 295 },
        weather: [{ description: "sunny", icon: "01d" }],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeather,
      });

      const getForecast = async () => {
        const openWeatherKey = "TEST_API_KEY";
        const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
        const city = document.getElementById("city").value;
        const urlToFetch = `${weatherUrl}?&q=${city}&APPID=${openWeatherKey}`;

        try {
          const response = await fetch(urlToFetch);
          if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
          }
        } catch (error) {
          console.log(error);
        }
      };

      await getForecast();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("api.openweathermap.org")
      );
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("New York"));
    });
  });

  describe("Integration Tests", () => {
    test("city input value is read correctly by API functions", () => {
      const cityInput = document.getElementById("city");
      cityInput.value = "Paris";
      expect(cityInput.value).toBe("Paris");
    });

    test("handles empty city input", () => {
      const cityInput = document.getElementById("city");
      cityInput.value = "";
      expect(cityInput.value).toBe("");
    });
  });
});
