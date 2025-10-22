/**
 * Weather API client
 * Reads base URL and API key from environment variables.
 * Exposes PUBLIC_INTERFACE getCurrentWeather(city).
 */

// Helper to read env safely
const BASE_URL = process.env.REACT_APP_WEATHER_API_BASE || "";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "";
const DEMO_MODE = String(process.env.REACT_APP_WEATHER_DEMO_MODE || "").toLowerCase() === "true";

// Small util to build query strings
function qs(params) {
  const u = new URLSearchParams(params);
  return u.toString();
}

// PUBLIC_INTERFACE
export async function getCurrentWeather(city) {
  /**
   * Fetch current weather for a city by name.
   * - If demo mode is enabled or API key is missing, returns mock data.
   * - Otherwise, performs a fetch to the configured API.
   * Returns a normalized object: { city, temperatureC, humidity, condition, icon }
   */
  if (!API_KEY || !BASE_URL || DEMO_MODE) {
    // Demo/mock payload to keep UI functional
    await new Promise((r) => setTimeout(r, 600));
    return {
      city,
      temperatureC: 22,
      humidity: 58,
      condition: "Partly Cloudy",
      icon: "⛅",
      _demo: true,
      message: (!API_KEY || !BASE_URL) ? "Running in demo mode (missing API config)." : "Demo mode enabled.",
    };
  }

  // Example for OpenWeatherMap's /weather endpoint
  // Adapt field mapping as needed for other providers.
  const url = `${BASE_URL.replace(/\/$/, "")}/weather?${qs({
    q: city,
    appid: API_KEY,
    units: "metric",
  })}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Weather API error (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json();

  // Normalize payload
  const temp = data?.main?.temp ?? null;
  const humidity = data?.main?.humidity ?? null;
  const condition = data?.weather?.[0]?.main ?? "Unknown";
  const iconCode = data?.weather?.[0]?.icon ?? "";
  const cityName = data?.name || city;

  return {
    city: cityName,
    temperatureC: typeof temp === "number" ? Math.round(temp) : null,
    humidity: typeof humidity === "number" ? humidity : null,
    condition,
    icon: mapIcon(iconCode, condition),
    _demo: false,
  };
}

// Simple icon mapper for a feel-good UI without extra libraries
function mapIcon(iconCode, condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("cloud")) return "⛅";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("storm") || c.includes("thunder")) return "⛈️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("clear")) return "☀️";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "🌫️";
  // Quick fallback using icon code if provided
  if ((iconCode || "").startsWith("01")) return "☀️";
  if ((iconCode || "").startsWith("02")) return "⛅";
  if ((iconCode || "").startsWith("03") || (iconCode || "").startsWith("04")) return "☁️";
  if ((iconCode || "").startsWith("09") || (iconCode || "").startsWith("10")) return "🌧️";
  if ((iconCode || "").startsWith("11")) return "⛈️";
  if ((iconCode || "").startsWith("13")) return "❄️";
  if ((iconCode || "").startsWith("50")) return "🌫️";
  return "🌍";
}
