import React from "react";
import "../styles/theme.css";

// PUBLIC_INTERFACE
export default function WeatherCard({ data, loading, error, cityRequested }) {
  /**
   * Displays weather data including temperature, humidity, condition, and icon.
   * Shows loading skeletons and handles error/empty states gracefully.
   */
  if (error) {
    return (
      <section className="card weather-main">
        <div className="error" role="alert" aria-live="assertive">
          <strong>Unable to load weather.</strong>
          <div style={{ marginTop: 6, fontSize: 14 }}>{error}</div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="card weather-main" aria-busy="true">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 180, height: 18 }} />
          <div className="skeleton" style={{ width: 80, height: 18 }} />
        </div>
        <div className="row" style={{ gap: 16, alignItems: "center", marginBottom: 14 }}>
          <div className="skeleton" style={{ width: 56, height: 56 }} />
          <div className="skeleton" style={{ width: 180, height: 36 }} />
        </div>
        <div className="col" style={{ gap: 10 }}>
          <div className="skeleton" style={{ width: "100%", height: 16 }} />
          <div className="skeleton" style={{ width: "100%", height: 16 }} />
          <div className="skeleton" style={{ width: "60%", height: 16 }} />
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card weather-main">
        <div className="empty" role="status" aria-live="polite">
          {cityRequested ? (
            <span>No results yet. Try searching a different city.</span>
          ) : (
            <span>Start by searching for a city to see the current weather.</span>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="card weather-main">
      <div className="spread" style={{ marginBottom: 10 }}>
        <div className="row" style={{ gap: 10 }}>
          <div
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(180deg, rgba(37,99,235,0.12), rgba(37,99,235,0.06))",
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(37,99,235,0.25)",
            }}
          >
            <span style={{ fontSize: 28 }}>{data.icon}</span>
          </div>
          <div className="col" style={{ gap: 2 }}>
            <div style={{ fontSize: 14, color: "var(--color-muted)" }}>Current weather in</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text)" }}>{data.city}</div>
          </div>
        </div>
        {data._demo ? (
          <span className="pixel-button" title="Demo mode">DEMO</span>
        ) : (
          <span className="badge" style={{ alignSelf: "center" }}>Live</span>
        )}
      </div>

      <div className="weather-grid">
        <div className="card" style={{ padding: 16 }}>
          <div className="row" style={{ gap: 12, alignItems: "baseline" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "var(--color-text)" }}>
              {data.temperatureC != null ? `${data.temperatureC}°` : "—"}
            </div>
            <div style={{ color: "var(--color-muted)" }}>{data.condition}</div>
          </div>
        </div>

        <div className="card weather-side">
          <div className="metric">
            <div className="label">Humidity</div>
            <div className="value">{data.humidity != null ? `${data.humidity}%` : "—"}</div>
            <div aria-hidden="true">💧</div>
          </div>
          <div className="metric">
            <div className="label">Feels Like</div>
            <div className="value">{data.temperatureC != null ? `${Math.round(Number(data.temperatureC))}°` : "—"}</div>
            <div aria-hidden="true">🌡️</div>
          </div>
        </div>
      </div>
    </section>
  );
}
