import React from "react";
import "../styles/theme.css";

// PUBLIC_INTERFACE
export default function Header() {
  /** Ocean Professional header with a subtle gradient and retro pixel accent */
  return (
    <header className="header card" role="banner" aria-label="App Header">
      <div className="col" style={{ gap: 6 }}>
        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>🌊</span>
          <h1 className="title" style={{ margin: 0 }}>
            Ocean Weather
          </h1>
          <span className="badge">Professional</span>
        </div>
        <span className="pixel-accent" aria-hidden="true">
          ░ RETRO ░ MODERN ░
        </span>
      </div>
    </header>
  );
}
