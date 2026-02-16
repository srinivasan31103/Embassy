import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { towerFeatures, unitDetails, units, typicalFloors, floorPositions } from '../data/buildingData';
import { unitPaths as arcadiaUnitPaths, unitLabelPositions as arcadiaLabelPositions } from '../data/unitCoordinates';
import { roomPaths } from '../data/roomCoordinates';
import ImageModal from '../components/ImageModal';
import './Home.css';

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

function Home() {
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [currentView, setCurrentView] = useState('building'); // 'building' | 'floorplan' | 'unit'
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const buildingRef = useRef(null);

  const unitPaths = arcadiaUnitPaths;
  const unitLabelPositions = arcadiaLabelPositions;

  // Building hover detection — uses measured floor positions from elevation image
  const BAND_HEIGHT = 2.5; // band height in % of image

  const getFloorFromPosition = useCallback((xFrac, yFrac) => {
    const xPct = xFrac * 100;
    const yPct = yFrac * 100;

    // Building x/y bounds (based on measured data with margin)
    if (xPct < 40 || xPct > 59) return null;
    if (yPct < 16 || yPct > 78) return null;

    let nearest = null;
    let minDist = Infinity;
    for (const floor of typicalFloors) {
      const pos = floorPositions[floor];
      if (!pos) continue;
      const dist = Math.abs(yPct - pos.y);
      if (dist < minDist) { minDist = dist; nearest = floor; }
    }

    if (minDist > 2.0) return null;
    return nearest;
  }, []);

  const getFloorBandStyle = useCallback((floor) => {
    const pos = floorPositions[floor];
    if (!pos) return { display: 'none' };

    return {
      top: `${pos.y - BAND_HEIGHT / 2}%`,
      height: `${BAND_HEIGHT}%`,
      left: `${pos.x1}%`,
      width: `${pos.x2 - pos.x1}%`,
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = buildingRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setHoveredFloor(getFloorFromPosition(x, y));
  }, [getFloorFromPosition]);

  const handleBuildingClick = useCallback(() => {
    if (!hoveredFloor) return;
    setSelectedFloor(hoveredFloor);
  }, [hoveredFloor]);

  const handleBuildingDoubleClick = useCallback(() => {
    if (!hoveredFloor && !selectedFloor) return;
    const floorToView = hoveredFloor || selectedFloor;
    setSelectedFloor(floorToView);
    setCurrentView('floorplan');
    setSelectedUnit(null);
  }, [hoveredFloor, selectedFloor]);

  const handleUnitClick = (unitNum) => {
    setSelectedUnit(unitNum);
    setCurrentView('unit');
  };

  const unitList = Object.values(units);

  // ========== UNIT DETAIL VIEW ==========
  if (currentView === 'unit' && selectedUnit) {
    const unit = units[selectedUnit];
    return (
      <div className="home-page">
        <div className="home-topbar">
          <img src="/images/hiranandani-logo.png" alt="Hiranandani Communities" className="home-topbar-logo-left" />
          <img src="/images/fortune-city-logo.png" alt="Hiranandani Fortune City Panvel" className="home-topbar-logo-right" />
        </div>

        <div className="home-detail-view">
          {/* Left Panel - Room List */}
          <div className="home-detail-left home-unit-room-card">
            <div className="home-room-list">
              {unit.rooms.map((room, idx) => (
                <div key={idx} className={`home-room-row ${hoveredRoom === idx ? 'highlighted' : ''}`}>
                  <span className="home-room-name">{room.name}</span>
                  <span className="home-room-size">{room.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center - 3D Unit Image with room hotspots */}
          <div className="home-detail-center">
            <div className="home-unit-view-header">
              <h2>TOWER B (TYPICAL PLAN)</h2>
              <p>Unit {selectedUnit} &nbsp; | &nbsp; {unit.type}</p>
            </div>
            <div className="home-floorplan-wrap">
              <div className="home-floorplan-img-container">
                <svg
                  className="home-floorplan-svg"
                  viewBox="0 0 3000 1688"
                  preserveAspectRatio="xMidYMid meet"
                  width="100%"
                >
                  <image
                    xlinkHref="/images/3bhk-presidentia-3d.png"
                    href="/images/3bhk-presidentia-3d.png"
                    x="0" y="0"
                    width="3000" height="1688"
                  />
                  {(roomPaths[selectedUnit] || []).map((room, idx) => {
                    // Calculate center of path from coordinates
                    const coords = room.path.match(/\d+,\d+/g) || [];
                    const points = coords.map(c => { const [x, y] = c.split(','); return { x: +x, y: +y }; });
                    const cx = points.reduce((s, p) => s + p.x, 0) / (points.length || 1);
                    const cy = points.reduce((s, p) => s + p.y, 0) / (points.length || 1);
                    return (
                      <g key={idx}
                        onMouseEnter={() => setHoveredRoom(idx)}
                        onMouseLeave={() => setHoveredRoom(null)}
                      >
                        <path
                          d={room.path}
                          className={`room-path ${hoveredRoom === idx ? 'active' : ''}`}
                        />
                        {hoveredRoom === idx && (() => {
                          const minY = Math.min(...points.map(p => p.y));
                          const labelY = minY - 20;
                          return (
                            <>
                              <rect x={cx - 220} y={labelY - 50} width="440" height="60" rx="10" fill="rgba(245,222,179,0.92)" stroke="rgba(197,148,58,0.7)" strokeWidth="2" />
                              <text x={cx} y={labelY - 12} textAnchor="middle" fill="#3a2a0a" fontSize="30" fontFamily="sans-serif" fontWeight="600">
                                {room.name} — {room.size}
                              </text>
                            </>
                          );
                        })()}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="home-detail-right">
            <button className="home-action-btn" onClick={() => { setCurrentView('floorplan'); setSelectedUnit(null); }}>
              Go Back
            </button>
            <button
              className="home-action-btn"
              onClick={() => setModalImage({
                src: '/images/3bhk-unit-plan.png',
                title: `Unit ${selectedUnit} - 2D Plan`
              })}
            >
              2D Unit Plan
            </button>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="home-bottombar">
          <span className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          </span>
          <div className="home-bottombar-items">
            <span className="home-bottombar-item active">Project Highlights</span>
            <span className="home-bottombar-item">Location</span>
            <span className="home-bottombar-item">Master Plan</span>
            <span className="home-bottombar-item">Project Details</span>
            <span className="home-bottombar-item">Amenities</span>
            <span className="home-bottombar-item">Collaterals</span>
            <span className="home-bottombar-item">Walkthrough</span>
          </div>
          <span className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </span>
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

  // ========== FLOOR PLAN DETAIL VIEW ==========
  if (currentView === 'floorplan') {
    return (
      <div className="home-page">
        <div className="home-topbar">
          <img src="/images/hiranandani-logo.png" alt="Hiranandani Communities" className="home-topbar-logo-left" />
          <img src="/images/fortune-city-logo.png" alt="Hiranandani Fortune City Panvel" className="home-topbar-logo-right" />
        </div>

        <div className="home-detail-view">
          {/* Left Panel - Floor & Units */}
          <div className="home-detail-left">
            <div className="home-floor-badge">
              Floor No. : {selectedFloor}
            </div>

            {unitList.map(unit => (
              <button
                key={unit.number}
                className={`home-unit-btn ${hoveredUnit === unit.number ? 'active' : ''}`}
                onClick={() => handleUnitClick(unit.number)}
                onMouseEnter={() => setHoveredUnit(unit.number)}
                onMouseLeave={() => setHoveredUnit(null)}
                style={{ '--unit-color': unit.color }}
              >
                Unit No. {unit.number}
              </button>
            ))}
          </div>

          {/* Center - Floor Plan Image */}
          <div className="home-detail-center">
            <div className="home-floorplan-wrap">
              <div className="home-floorplan-img-container">
                <svg
                  className="home-floorplan-svg"
                  viewBox="0 0 3000 1688"
                  preserveAspectRatio="xMidYMid meet"
                  width="100%"
                >
                  <image
                    xlinkHref="/images/arcadia-typical-plan.png"
                    href="/images/arcadia-typical-plan.png"
                    x="0" y="0"
                    width="3000" height="1688"
                  />
                  {Object.entries(unitPaths).map(([unitNum, pathData]) => (
                    <path
                      key={unitNum}
                      d={pathData}
                      className={`unit-path ${hoveredUnit === Number(unitNum) ? 'active' : ''}`}
                      style={{ fill: units[Number(unitNum)].color }}
                      onMouseEnter={() => setHoveredUnit(Number(unitNum))}
                      onMouseLeave={() => setHoveredUnit(null)}
                      onClick={() => handleUnitClick(Number(unitNum))}
                    />
                  ))}
                </svg>
                {hoveredUnit && (() => {
                  const pos = unitLabelPositions[hoveredUnit];
                  if (!pos) return null;
                  return (
                    <span
                      className="home-floorplan-unit-label"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        background: units[hoveredUnit].color,
                      }}
                    >
                      Unit No. {hoveredUnit}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="home-detail-right">
            <button className="home-action-btn" onClick={() => { setCurrentView('building'); setSelectedUnit(null); }}>
              Go Back
            </button>
            <button
              className="home-action-btn"
              onClick={() => setModalImage({
                src: '/images/arcadia-typical-plan.png',
                title: `Arcadia Typical Floor — Floor ${selectedFloor}`
              })}
            >
              Zoom Image
            </button>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="home-bottombar">
          <span className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          </span>
          <div className="home-bottombar-items">
            <span className="home-bottombar-item active">Project Highlights</span>
            <span className="home-bottombar-item">Location</span>
            <span className="home-bottombar-item">Master Plan</span>
            <span className="home-bottombar-item">Project Details</span>
            <span className="home-bottombar-item">Amenities</span>
            <span className="home-bottombar-item">Collaterals</span>
            <span className="home-bottombar-item">Walkthrough</span>
          </div>
          <span className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </span>
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

  // ========== BUILDING VIEW (Main Page) ==========
  return (
    <div className="home-page">
      <div className="home-topbar">
        <img src="/images/hiranandani-logo.png" alt="Hiranandani Communities" className="home-topbar-logo-left" />
        <img src="/images/fortune-city-logo.png" alt="Hiranandani Fortune City Panvel" className="home-topbar-logo-right" />
      </div>

      <div className="home-main-view">
        <div className="home-panel home-left-panel">
          <div className="home-panel-title">Tower Features</div>
          <div className="home-feature-list">
            {towerFeatures.map(f => (
              <div key={f.id} className="home-feature-item">
                <span className="home-feature-icon">{featureIcons[f.icon]}</span>
                <span className="home-feature-name">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-building-container">
          <div className="home-building">
            <div
              ref={buildingRef}
              className="home-building-wrapper"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredFloor(null)}
              onClick={handleBuildingClick}
              onDoubleClick={handleBuildingDoubleClick}
            >
              <img
                src="/images/building-elevation.png"
                alt="Arcadia Building"
                className="home-building-img"
                draggable={false}
              />
              {selectedFloor && (
                <div className="home-selected-floor" style={getFloorBandStyle(selectedFloor)}>
                  <span className="home-selected-floor-label">Floor {selectedFloor}</span>
                </div>
              )}
              {hoveredFloor && hoveredFloor !== selectedFloor && (
                <div className="home-floor-band" style={getFloorBandStyle(hoveredFloor)} />
              )}
            </div>
          </div>
        </div>

        <div className="home-panel home-right-panel">
          <div className="home-panel-title">Unit Details</div>
          <div className="home-unit-detail-list">
            {unitDetails.map(d => (
              <div key={d.id} className="home-unit-detail-item">
                <span className="home-unit-detail-icon">{unitIcons[d.icon]}</span>
                <span className="home-unit-detail-name">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-bottombar">
        <span className="home-bottombar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
        </span>
        <div className="home-bottombar-items">
          <span className="home-bottombar-item active">Project Highlights</span>
          <span className="home-bottombar-item">Location</span>
          <span className="home-bottombar-item">Master Plan</span>
          <span className="home-bottombar-item">Project Details</span>
          <span className="home-bottombar-item">Amenities</span>
          <span className="home-bottombar-item">Collaterals</span>
          <span className="home-bottombar-item">Walkthrough</span>
        </div>
        <span className="home-bottombar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </span>
      </div>
    </div>
  );
}

export default Home;
