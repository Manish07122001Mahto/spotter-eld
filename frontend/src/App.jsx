import { useState, useEffect } from "react";
import { useTripPlanner } from "./hooks/useTripPlanner";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import TripForm from "./components/form/TripForm";
import SummaryCards from "./components/summary/SummaryCards";
import TripMap from "./components/map/TripMap";
import ELDSection from "./components/eld/ELDSection";
import SectionHeader from "./components/common/SectionHeader";
import ErrorToast from "./components/common/ErrorToast";
import ScrollToTop from "./components/common/ScrollToTop";
import { STOP_COLORS, STOP_LABELS } from "./constants/stopConfig";

export default function App() {
  const {
    form,
    result,
    loading,
    slowLoading,
    error,
    clearError,
    handleChange,
    handleSubmit,
  } = useTripPlanner();
  const cycleVal = parseFloat(form.current_cycle_used) || 0;
  const [activeStopIndex, setActiveStopIndex] = useState(null);

  useEffect(() => {
    setActiveStopIndex(null);
  }, [result]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F0F4F8",
        fontFamily: "'Inter', Arial, sans-serif",
        color: "#1B2A3A",
      }}
    >
      <Navbar />

      <div
        className="desc-strip"
        style={{ background: "#F8FBFD", borderBottom: "1px solid #D8E4EE" }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: "#1B3A5C",
            marginBottom: 3,
          }}
        >
          Plan your truck trip in seconds
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#6A8AA8" }}>
          Enter your starting point, pickup, and dropoff locations along with
          your current cycle hours. The app will build a full route with rest
          stops, fuel stops, a map, and daily ELD log sheets automatically.
        </p>
      </div>

      <div className="main-content" style={{ flex: 1 }}>
        <TripForm
          form={form}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {!result && !loading && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #C8D8E8",
              borderRadius: 8,
              padding: "70px 40px",
              textAlign: "center",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B8CCDC"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: "block", margin: "0 auto 16px" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1B3A5C",
                marginBottom: 8,
              }}
            >
              Enter trip details above to generate your route and ELD logs
            </p>
            <p style={{ fontSize: 14, color: "#6A8AA8", margin: 0 }}>
              HOS-compliant schedule, rest stops, fuel stops, and daily log
              sheets will appear here.
            </p>
          </div>
        )}

        {loading && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #C8D8E8",
              borderRadius: 8,
              padding: 70,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #D8E8F4",
                borderTopColor: "#1B3A5C",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#1B3A5C",
                margin: "0 0 6px",
              }}
            >
              Planning your route...
            </p>
            {slowLoading && (
              <p style={{ fontSize: 13, color: "#8AA8C0", margin: 0 }}>
                Server is warming up, this may take a moment...
              </p>
            )}
          </div>
        )}

        {result && (
          <>
            <SummaryCards
              tripSummary={result.trip_summary}
              cycleVal={cycleVal}
            />

            <div className="map-stops-grid">
              <div style={{ minHeight: 280 }}>
                <TripMap
                  mapData={result.map_data}
                  activeStopIndex={activeStopIndex}
                />
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #C8D8E8",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <SectionHeader title="Route Stops" />
                {result.map_data.stops.map((stop, i) => {
                  const isActive = i === activeStopIndex;
                  const dotColor = STOP_COLORS[stop.type] || "#1B3A5C";
                  return (
                    <div
                      key={i}
                      onClick={() => setActiveStopIndex(isActive ? null : i)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "11px 14px",
                        borderBottom:
                          i < result.map_data.stops.length - 1
                            ? "1px solid #F0F6FC"
                            : "none",
                        cursor: "pointer",
                        background: isActive ? "#F4F8FC" : "transparent",
                        borderLeft: isActive
                          ? `3px solid ${dotColor}`
                          : "3px solid transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: dotColor,
                          marginTop: 4,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#1B3A5C",
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                          }}
                        >
                          {STOP_LABELS[stop.type]}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#3A5A78",
                            marginTop: 2,
                          }}
                        >
                          {stop.label}
                        </div>
                        {stop.duration_hrs > 0 && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#8AA8C0",
                              marginTop: 1,
                            }}
                          >
                            {stop.duration_hrs}h stop
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <ELDSection dailyLogs={result.daily_logs} />
          </>
        )}
      </div>

      <Footer />
      <ErrorToast message={error} onDismiss={clearError} />
      <ScrollToTop />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
