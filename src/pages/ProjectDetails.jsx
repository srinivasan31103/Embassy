import { useState, useRef, useCallback } from 'react';
import { towerFeatures, unitDetails, units, typicalFloors, floorTypeLabel, bhkLegend } from '../data/buildingData';
import ImageModal from '../components/ImageModal';
import './ProjectDetails.css';

// SVG icons for tower features
const featureIcons = {
  intercom: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="4" width="20" height="32" rx="3" />
      <circle cx="20" cy="16" r="5" />
      <rect x="15" y="26" width="10" height="4" rx="1" />
      <line x1="17" y1="28" x2="23" y2="28" />
    </svg>
  ),
  'video-door': (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="8" width="20" height="24" rx="2" />
      <circle cx="16" cy="18" r="4" />
      <rect x="11" y="26" width="10" height="3" rx="1" />
      <path d="M26 16l8-4v16l-8-4z" />
    </svg>
  ),
  cctv: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 24h16l6-10H14z" />
      <circle cx="22" cy="19" r="3" />
      <rect x="18" y="28" width="8" height="4" rx="1" />
      <line x1="22" y1="24" x2="22" y2="28" />
    </svg>
  ),
  power: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="10" width="24" height="20" rx="2" />
      <rect x="12" y="14" width="6" height="12" rx="1" />
      <rect x="22" y="14" width="6" height="12" rx="1" />
      <line x1="15" y1="6" x2="15" y2="10" />
      <line x1="25" y1="6" x2="25" y2="10" />
    </svg>
  ),
  fire: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 4c0 8-8 12-8 20a8 8 0 0016 0c0-8-8-12-8-20z" />
      <path d="M20 16c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" />
    </svg>
  ),
};

// SVG icons for unit details
const unitIcons = {
  marble: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="28" height="28" rx="2" />
      <line x1="6" y1="20" x2="34" y2="20" />
      <line x1="20" y1="6" x2="20" y2="34" />
      <path d="M8 8l10 10M22 8l10 10M8 22l10 10" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  tiles: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <rect x="22" y="6" width="12" height="12" rx="1" />
      <rect x="6" y="22" width="12" height="12" rx="1" />
      <rect x="22" y="22" width="12" height="12" rx="1" />
      <line x1="10" y1="10" x2="14" y2="14" strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="26" x2="30" y2="30" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  kitchen: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="14" width="28" height="20" rx="2" />
      <line x1="6" y1="22" x2="34" y2="22" />
      <rect x="10" y="26" width="8" height="4" rx="1" />
      <rect x="22" y="26" width="8" height="4" rx="1" />
      <circle cx="14" cy="18" r="1.5" />
      <circle cx="20" cy="18" r="1.5" />
      <circle cx="26" cy="18" r="1.5" />
      <path d="M14 14V8M20 14V6M26 14V8" />
    </svg>
  ),
  ac: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="10" width="28" height="14" rx="3" />
      <line x1="10" y1="20" x2="30" y2="20" />
      <path d="M12 28c0-2 2-4 4-4s4 2 4 4" />
      <path d="M20 28c0-2 2-4 4-4s4 2 4 4" />
    </svg>
  ),
};

function ProjectDetails() {
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [hoverY, setHoverY] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [detailView, setDetailView] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const buildingRef = useRef(null);
  const clickTimerRef = useRef(null);

  // Building zone within the image (percentage-based)
  // Adjust these values to match where the actual building is in the elevation image
  const BUILDING_TOP = 0.05;
  const BUILDING_BOTTOM = 0.92;

  // Floors sorted low to high
  const allFloors = [...typicalFloors].sort((a, b) => a - b);

  const getFloorFromY = useCallback((yPercent) => {
    if (yPercent < BUILDING_TOP || yPercent > BUILDING_BOTTOM) return null;

    const buildingHeight = BUILDING_BOTTOM - BUILDING_TOP;
    const relativeY = (yPercent - BUILDING_TOP) / buildingHeight;

    // relativeY 0 = top (highest floor), 1 = bottom (lowest floor)
    const floorIndex = Math.floor((1 - relativeY) * allFloors.length);
    const clampedIndex = Math.max(0, Math.min(allFloors.length - 1, floorIndex));

    return allFloors[clampedIndex];
  }, [allFloors]);

  const handleMouseMove = useCallback((e) => {
    const rect = buildingRef.current?.getBoundingClientRect();
    if (!rect) return;

    const y = (e.clientY - rect.top) / rect.height;
    const pixelY = e.clientY - rect.top;

    const floor = getFloorFromY(y);
    setHoveredFloor(floor);
    setHoverY(pixelY);
  }, [getFloorFromY]);

  const handleMouseLeave = () => {
    setHoveredFloor(null);
  };

  const handleBuildingClick = useCallback(() => {
    if (!hoveredFloor) return;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    clickTimerRef.current = setTimeout(() => {
      setSelectedFloor(hoveredFloor);
      clickTimerRef.current = null;
    }, 250);
  }, [hoveredFloor]);

  const handleBuildingDoubleClick = useCallback(() => {
    if (!hoveredFloor && !selectedFloor) return;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    const floorToView = hoveredFloor || selectedFloor;
    setSelectedFloor(floorToView);
    setDetailView(true);
    setSelectedUnit(null);
  }, [hoveredFloor, selectedFloor]);

  const handleGoBack = () => {
    setDetailView(false);
    setSelectedUnit(null);
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
  };

  const unitList = Object.values(units);

  // ========== FLOOR PLAN DETAIL VIEW ==========
  if (detailView) {
    return (
      <div className="pd-page">
        <div className="pd-detail-view">
          {/* Left Panel - Floor & Units */}
          <div className="pd-detail-left">
            <div className="pd-floor-badge">
              Floor No. : {selectedFloor}
            </div>

            {unitList.map(unit => (
              <button
                key={unit.number}
                className={`pd-unit-btn ${selectedUnit === unit.number ? 'active' : ''}`}
                onClick={() => setSelectedUnit(selectedUnit === unit.number ? null : unit.number)}
                style={{
                  '--unit-color': unit.color,
                }}
              >
                {selectedUnit === unit.number ? `UNIT NO. ${unit.number}` : `Unit No. ${unit.number}`}
              </button>
            ))}

            {/* Floor selector mini */}
            <div className="pd-floor-mini-selector">
              <p className="pd-floor-mini-label">Change Floor</p>
              <div className="pd-floor-mini-grid">
                {typicalFloors.map(floor => (
                  <button
                    key={floor}
                    className={`pd-floor-mini-btn ${selectedFloor === floor ? 'active' : ''}`}
                    onClick={() => handleFloorSelect(floor)}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Floor Plan Image */}
          <div className="pd-detail-center">
            <div className="pd-detail-header">
              <h2>ARCADIA — TYPICAL FLOOR</h2>
              <p>{floorTypeLabel}</p>
            </div>

            <div className="pd-floorplan-wrap">
              <img
                src="/images/tower-b-typical-floor.png"
                alt="Arcadia Typical Floor Plan"
                draggable={false}
              />
            </div>

            <div className="pd-legend">
              {bhkLegend.map((item, idx) => (
                <div key={idx} className="pd-legend-item">
                  <span className="pd-legend-color" style={{ background: item.color }}></span>
                  <span>{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Actions & Unit Info */}
          <div className="pd-detail-right">
            {selectedUnit && (
              <div
                className="pd-unit-info-badge"
                style={{ background: units[selectedUnit].color }}
              >
                Unit No. {selectedUnit} — {units[selectedUnit].type}
              </div>
            )}

            <button className="pd-action-btn" onClick={handleGoBack}>
              Go Back
            </button>
            <button
              className="pd-action-btn"
              onClick={() => setModalImage({
                src: '/images/tower-b-typical-floor.png',
                title: `Arcadia Typical Floor — Floor ${selectedFloor}`
              })}
            >
              Zoom Image
            </button>

            {selectedUnit && (
              <div className="pd-unit-details-card">
                <h4>{units[selectedUnit].type} — Unit {selectedUnit}</h4>
                <div className="pd-room-list">
                  {units[selectedUnit].rooms.map((room, idx) => (
                    <div key={idx} className="pd-room-row">
                      <span className="pd-room-name">{room.name}</span>
                      <span className="pd-room-size">{room.size}</span>
                    </div>
                  ))}
                </div>
                <div className="pd-area-summary">
                  <div className="pd-area-row">
                    <span>Carpet Area</span>
                    <strong>{units[selectedUnit].carpetArea}</strong>
                  </div>
                  <div className="pd-area-row">
                    <span>Deck Area</span>
                    <strong>{units[selectedUnit].deckArea}</strong>
                  </div>
                  <div className="pd-area-row total">
                    <span>Total Area</span>
                    <strong>{units[selectedUnit].totalArea}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {modalImage && (
          <ImageModal
            image={modalImage.src}
            title={modalImage.title}
            onClose={() => setModalImage(null)}
          />
        )}
      </div>
    );
  }

  // ========== BUILDING VIEW (Main) ==========
  return (
    <div className="pd-page">
      <div className="pd-main-view">
        {/* Left Panel - Tower Features */}
        <div className="pd-panel pd-left-panel">
          <div className="pd-panel-title">Tower Features</div>
          <div className="pd-feature-list">
            {towerFeatures.map(f => (
              <div key={f.id} className="pd-feature-item">
                <span className="pd-feature-icon">
                  {featureIcons[f.icon]}
                </span>
                <span className="pd-feature-name">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Building */}
        <div className="pd-building-container">
          <div className="pd-tower-label">Arcadia</div>
          <div
            ref={buildingRef}
            className="pd-building"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleBuildingClick}
            onDoubleClick={handleBuildingDoubleClick}
          >
            <img
              src="/images/building-elevation.png"
              alt="Arcadia Building"
              className="pd-building-img"
              draggable={false}
            />

            {/* Hover floor indicator */}
            {hoveredFloor && (
              <div
                className="pd-floor-indicator"
                style={{ top: hoverY }}
              >
                <div className="pd-floor-indicator-line"></div>
                <span className="pd-floor-indicator-label">Floor {hoveredFloor}</span>
              </div>
            )}

            {/* Selected floor badge (when not hovering) */}
            {selectedFloor && !hoveredFloor && (
              <div className="pd-selected-badge">
                Floor {selectedFloor}
              </div>
            )}
          </div>

          <p className="pd-hint">
            Hover to see floors &bull; Click to select &bull; Double-click to view plan
          </p>
        </div>

        {/* Right Panel - Unit Details */}
        <div className="pd-panel pd-right-panel">
          <div className="pd-panel-title">Unit Details</div>
          <div className="pd-unit-detail-list">
            {unitDetails.map(d => (
              <div key={d.id} className="pd-unit-detail-item">
                <span className="pd-unit-detail-icon">
                  {unitIcons[d.icon]}
                </span>
                <span className="pd-unit-detail-name">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
