import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./styles/theme.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Footer from "./components/Footer";
import { getCurrentWeather } from "./services/weatherApi";

// PUBLIC_INTERFACE
function App() {
  /**
   * Main weather app container.
   * Manages theme, search input, fetch state, and renders UI components.
   */

  // Theme handling (light/dark optional switch kept minimal)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.body.classList.add("app-bg");
    document.documentElement.setAttribute("data-theme", theme);
    return () => document.body.classList.remove("app-bg");
  }, [theme]);

  // App states
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [lastCity, setLastCity] = useState("");

  const apiConfigured = useMemo(() => {
    const base = process.env.REACT_APP_WEATHER_API_BASE;
    const key = process.env.REACT_APP_WEATHER_API_KEY;
    const demo = String(process.env.REACT_APP_WEATHER_DEMO_MODE || "").toLowerCase() === "true";
    return Boolean((base && key) || demo);
  }, []);

  const handleSearch = async (city) => {
    setError("");
    setLoading(true);
    setLastCity(city);
    try {
      const data = await getCurrentWeather(city);
      setWeather(data);
    } catch (e) {
      setWeather(null);
      setError(e?.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
          <Header />
          <button
            className="btn btn-outline"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {!apiConfigured && (
          <div className="info card" role="note" style={{ marginBottom: 16, padding: 16 }}>
            API is not fully configured. Running in demo mode with mocked data.
            To enable live data, set REACT_APP_WEATHER_API_BASE and REACT_APP_WEATHER_API_KEY in your .env file.
          </div>
        )}

        <div className="col" style={{ gap: 16 }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
          <WeatherCard data={weather} loading={loading} error={error} cityRequested={Boolean(lastCity)} />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
