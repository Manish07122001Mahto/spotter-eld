import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { STOP_COLORS, STOP_LABELS } from "../../constants/stopConfig";

function createPinIcon(color, active = false) {
  const w = active ? 32 : 24;
  const h = active ? 42 : 32;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 32">
    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 24 8 24s8-18.5 8-24c0-4.42-3.58-8-8-8z"
      fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
    <circle cx="12" cy="8" r="4" fill="white" opacity="0.88"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 4],
  });
}

function MapFlyTo({ stops, activeIndex }) {
  const map = useMap();
  useEffect(() => {
    if (activeIndex !== null && activeIndex >= 0 && stops[activeIndex]) {
      const { lat, lng } = stops[activeIndex];
      map.flyTo([lat, lng], 11, { duration: 0.7 });
    }
  }, [activeIndex]);
  return null;
}

function MapResetControl({ bounds, resetSignal }) {
  const map = useMap();
  useEffect(() => {
    if (resetSignal > 0) {
      map.fitBounds(bounds, { padding: [32, 32], animate: true });
    }
  }, [resetSignal]);
  return null;
}

function MapContent({ mapData, activeIndex, isModal, bounds, resetSignal }) {
  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline
        positions={mapData.route_coordinates}
        color="#1B3A5C"
        weight={3}
      />
      {mapData.stops.map((stop, i) => {
        const color = STOP_COLORS[stop.type] || "#1B3A5C";
        const isActive = i === activeIndex;
        return (
          <Marker
            key={i}
            position={[stop.lat, stop.lng]}
            icon={createPinIcon(color, isActive)}
          >
            <Tooltip direction="top" offset={[0, -38]} className="eld-tooltip">
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    color,
                    marginBottom: 3,
                  }}
                >
                  {STOP_LABELS[stop.type] || stop.type}
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#1B2A3A" }}
                >
                  {stop.label}
                </div>
                {stop.duration_hrs > 0 && (
                  <div style={{ fontSize: 11, color: "#7A9AB8", marginTop: 2 }}>
                    {stop.duration_hrs}h stop
                  </div>
                )}
                {stop.mile_marker > 0 && (
                  <div style={{ fontSize: 11, color: "#7A9AB8" }}>
                    Mile {stop.mile_marker}
                  </div>
                )}
              </div>
            </Tooltip>
            <Popup>
              <strong>{stop.label}</strong>
              {stop.duration_hrs > 0 && (
                <div style={{ marginTop: 2, color: "#555" }}>
                  {stop.duration_hrs}h stop
                </div>
              )}
            </Popup>
          </Marker>
        );
      })}
      {!isModal && <MapFlyTo stops={mapData.stops} activeIndex={activeIndex} />}
      <MapResetControl bounds={bounds} resetSignal={resetSignal} />
    </>
  );
}

const btnStyle = {
  background: "#fff",
  border: "1px solid #B8CCDC",
  borderRadius: 5,
  width: 30,
  height: 30,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
};

export default function TripMap({ mapData, activeStopIndex }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [modalResetSignal, setModalResetSignal] = useState(0);

  const stopPositions = mapData.stops.map((s) => [s.lat, s.lng]);
  const bounds = L.latLngBounds(stopPositions);

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100%",
          minHeight: 220,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <MapContainer
          bounds={bounds}
          attributionControl={false}
          style={{ height: "100%", minHeight: 220, width: "100%" }}
        >
          <MapContent
            mapData={mapData}
            activeIndex={activeStopIndex}
            isModal={false}
            bounds={bounds}
            resetSignal={resetSignal}
          />
        </MapContainer>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <button
            onClick={() => setResetSignal((s) => s + 1)}
            title="Reset to full route view"
            style={btnStyle}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1B3A5C"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 7 3 3 7 3" />
              <polyline points="17 3 21 3 21 7" />
              <polyline points="21 17 21 21 17 21" />
              <polyline points="7 21 3 21 3 17" />
            </svg>
          </button>
          <button
            onClick={() => setFullscreen(true)}
            title="View fullscreen"
            style={btnStyle}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1B3A5C"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </div>

      {fullscreen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setFullscreen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            background: "rgba(10,26,44,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "92vw",
              height: "88vh",
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <MapContainer
              bounds={bounds}
              attributionControl={false}
              style={{ width: "100%", height: "100%" }}
            >
              <MapContent
                mapData={mapData}
                activeIndex={activeStopIndex}
                isModal={false}
                bounds={bounds}
                resetSignal={modalResetSignal}
              />
            </MapContainer>

            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <button
                onClick={() => setModalResetSignal((s) => s + 1)}
                title="Reset to full route view"
                style={{ ...btnStyle, width: 34, height: 34 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B3A5C"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 7 3 3 7 3" />
                  <polyline points="17 3 21 3 21 7" />
                  <polyline points="21 17 21 21 17 21" />
                  <polyline points="7 21 3 21 3 17" />
                </svg>
              </button>
              <button
                onClick={() => setFullscreen(false)}
                title="Close fullscreen"
                style={{ ...btnStyle, width: 34, height: 34 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B3A5C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
