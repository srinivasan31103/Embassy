import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { towerFeatures, unitDetails, units, typicalFloors, floorTypeLabel, floorPositions } from '../data/buildingData';
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

  // Room hotspot zones on the 3D image (percentage positions)
  // Traced from 3bhk-presidentia-3d.png — positions match the 3D isometric render
  const roomHotspots = {
    2: [ // Unit 2 (3BHK Presidentia — matches the 3D image)
      { name: 'Entrance Foyer', size: "5'6\" x 6'11\"", top: 56.8, left: 65, width: 7.1, height: 7.6 },
      { name: 'Living/Dining', size: "21'0\" x 14'3\"", top: 34.9, left: 45.3, width: 24.4, height: 18.2 },
      { name: 'Balcony', size: "13'0\" x 5'0\"", top: 27, left: 49.1, width: 14.6, height: 6.5 },
      { name: 'Kitchen', size: "8'5\" x 11'2\"", top: 53.6, left: 23.2, width: 12.3, height: 19 },
      { name: 'Utility', size: "3'6\" x 5'6\"", top: 69.4, left: 15.5, width: 7, height: 6.4 },
      { name: 'Passage', size: "11'8\" x 3'3\"", top: 51.9, left: 21.2, width: 22.1, height: 1.1 },
      { name: 'Bedroom 1', size: "11'0\" x 13'0\"", top: 33.5, left: 6.9, width: 15.4, height: 17.7 },
      { name: 'Toilet', size: "4'6\" x 8'0\"", top: 58.3, left: 5.8, width: 9.7, height: 10.7 },
      { name: 'Master Bedroom', size: "11'0\" x 15'0\"", top: 37.6, left: 71.6, width: 14, height: 14.2 },
      { name: 'M.Toilet', size: "5'0\" x 8'0\"", top: 46.4, left: 88.4, width: 3, height: 8.6 },
      { name: 'Bedroom 2', size: "11'0\" x 14'0\"", top: 30.8, left: 24.9, width: 10.4, height: 19.6 },
      { name: 'Toilet 2', size: "5'0\" x 8'0\"", top: 38.1, left: 37.9, width: 5, height: 8 },
      { name: 'Balcony 2', size: "7'0\" x 5'0\"", top: 25.7, left: 13.5, width: 7.7, height: 5.8 },
    ],
    1: [ // Unit 1 (2BHK — mapped onto 3BHK image)
      { name: 'Dry Balcony', size: "3'3\" x 8'0\"", top: 8, left: 6, width: 11, height: 12 },
      { name: 'Bedroom 2', size: "11'7\" x 11'", top: 20, left: 4, width: 22, height: 28 },
      { name: 'Toilet 2', size: "8' x 5'", top: 40, left: 15, width: 10, height: 13 },
      { name: 'Deck', size: "11'2\" x 4'7\"", top: 3, left: 32, width: 24, height: 14 },
      { name: 'Living/Dining', size: "11'4\" x 15'10\"", top: 17, left: 28, width: 31, height: 38 },
      { name: 'Kitchen', size: "10'10\" x 8'", top: 56, left: 26, width: 16, height: 22 },
      { name: 'Entrance Foyer', size: "4'6\" x 6'3\"", top: 52, left: 44, width: 10, height: 10 },
      { name: 'Utility/Storage', size: "7' x 3'5\"", top: 66, left: 14, width: 10, height: 14 },
      { name: 'Common Toilet', size: "8' x 4'5\"", top: 60, left: 3, width: 11, height: 17 },
      { name: 'Passage 1', size: "5' x 3'5\"", top: 56, left: 46, width: 16, height: 7 },
      { name: 'Master Bedroom', size: "11' x 12'10\"", top: 17, left: 59, width: 24, height: 33 },
      { name: 'Master Toilet', size: "5' x 8'4\"", top: 17, left: 83, width: 13, height: 21 },
    ],
    3: [ // Unit 3 (2BHK — mapped onto 3BHK image)
      { name: 'Dry Balcony', size: "3'3\" x 8'0\"", top: 8, left: 6, width: 11, height: 12 },
      { name: 'Bedroom 2', size: "11'7\" x 11'", top: 20, left: 4, width: 22, height: 28 },
      { name: 'Toilet 2', size: "8' x 5'", top: 40, left: 15, width: 10, height: 13 },
      { name: 'Deck', size: "11'2\" x 4'7\"", top: 3, left: 32, width: 24, height: 14 },
      { name: 'Living/Dining', size: "11'4\" x 15'10\"", top: 17, left: 28, width: 31, height: 38 },
      { name: 'Kitchen', size: "10'10\" x 8'", top: 56, left: 26, width: 16, height: 22 },
      { name: 'Entrance Foyer', size: "4'6\" x 6'3\"", top: 52, left: 44, width: 10, height: 10 },
      { name: 'Utility/Storage', size: "7' x 3'5\"", top: 66, left: 14, width: 10, height: 14 },
      { name: 'Common Toilet', size: "8' x 4'5\"", top: 60, left: 3, width: 11, height: 17 },
      { name: 'Passage 1', size: "5' x 3'5\"", top: 56, left: 46, width: 16, height: 7 },
      { name: 'Master Bedroom', size: "11' x 12'10\"", top: 17, left: 59, width: 24, height: 33 },
      { name: 'Master Toilet', size: "5' x 8'4\"", top: 17, left: 83, width: 13, height: 21 },
    ],
    4: [ // Unit 4 (2BHK — mapped onto 3BHK image)
      { name: 'Dry Balcony', size: "3'3\" x 8'0\"", top: 8, left: 6, width: 11, height: 12 },
      { name: 'Bedroom 2', size: "11'7\" x 11'", top: 20, left: 4, width: 22, height: 28 },
      { name: 'Toilet 2', size: "8' x 5'", top: 40, left: 15, width: 10, height: 13 },
      { name: 'Deck', size: "11'2\" x 4'7\"", top: 3, left: 32, width: 24, height: 14 },
      { name: 'Living/Dining', size: "11'4\" x 15'10\"", top: 17, left: 28, width: 31, height: 38 },
      { name: 'Kitchen', size: "10'10\" x 8'", top: 56, left: 26, width: 16, height: 22 },
      { name: 'Entrance Foyer', size: "4'6\" x 6'3\"", top: 52, left: 44, width: 10, height: 10 },
      { name: 'Utility/Storage', size: "7' x 3'5\"", top: 66, left: 14, width: 10, height: 14 },
      { name: 'Common Toilet', size: "8' x 4'5\"", top: 60, left: 3, width: 11, height: 17 },
      { name: 'Passage 1', size: "5' x 3'5\"", top: 56, left: 46, width: 16, height: 7 },
      { name: 'Master Bedroom', size: "11' x 12'10\"", top: 17, left: 59, width: 24, height: 33 },
      { name: 'Master Toilet', size: "5' x 8'4\"", top: 17, left: 83, width: 13, height: 21 },
    ],
  };

  // SVG path data for each unit — pixel coordinates matching 3000x1688 image
  const unitPaths = {
    2: "M 946,192 L 1118,191 L 1146,135 L 1331,135 L 1531,142 L 1537,201 L 1736,201 L 1735,463 L 1553,465 L 1523,648 L 1451,648 L 1446,676 L 1211,685 L 1205,546 L 1131,543 L 1140,478 L 1279,472 L 1264,401 L 1146,405 L 1143,437 L 1035,435 L 1031,534 L 927,537 L 946,192 Z",
    1: "M 1757,202 L 1923,200 L 1960,150 L 2153,143 L 2358,128 L 2362,182 L 2547,187 L 2557,532 L 2468,533 L 2466,433 L 2377,422 L 2383,394 L 2358,402 L 2364,472 L 2362,541 L 2292,546 L 2290,683 L 2053,678 L 2046,648 L 1974,650 L 1970,472 L 1764,478 L 1755,478 L 1757,209 Z",
    3: "M 1298,956 L 1294,1081 L 1340,1089 L 1343,1181 L 1248,1181 L 1243,1087 L 1159,1094 L 1158,1429 L 1315,1437 L 1344,1486 L 1535,1492 L 1539,1483 L 1729,1483 L 1731,1092 L 1537,1083 L 1529,944 L 1300,940 Z",
    4: "M 1972,946 L 2199,946 L 2199,1070 L 2108,1085 L 2108,1215 L 2229,1215 L 2244,1096 L 2438,1090 L 2442,1277 L 2492,1283 L 2486,1381 L 2432,1377 L 2425,1505 L 1940,1502 L 1938,1486 L 1746,1481 L 1748,1079 L 1963,1083 Z",
  };

  const unitLabelPositions = {
    2: { top: '5%', left: '38%' },
    1: { top: '5%', left: '68%' },
    3: { top: '53%', left: '42%' },
    4: { top: '53%', left: '65%' },
  };

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
              <div className="home-unit-3d-container">
                <img
                  className="home-unit-3d-img"
                  src="/images/3bhk-presidentia-3d.png"
                  alt={`Unit ${selectedUnit} - ${unit.type} 3D View`}
                />
                {/* Room hotspot zones */}
                {(roomHotspots[selectedUnit] || []).map((room, idx) => (
                  <div
                    key={idx}
                    className="home-room-hotspot"
                    style={{
                      top: `${room.top}%`,
                      left: `${room.left}%`,
                      width: `${room.width}%`,
                      height: `${room.height}%`,
                    }}
                    onMouseEnter={() => setHoveredRoom(idx)}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {hoveredRoom === idx && (
                      <span className="home-room-tooltip">
                        {room.name} {room.size}
                      </span>
                    )}
                  </div>
                ))}
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
          <Link to="/" className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          </Link>
          <div className="home-bottombar-items">
            <Link to="/" className="home-bottombar-item active">Project Highlights</Link>
            <Link to="/contact" className="home-bottombar-item">Location</Link>
            <Link to="/floor-plan" className="home-bottombar-item">Master Plan</Link>
            <Link to="/" className="home-bottombar-item">Project Details</Link>
            <Link to="/features" className="home-bottombar-item">Amenities</Link>
            <Link to="/" className="home-bottombar-item">Collaterals</Link>
            <Link to="/" className="home-bottombar-item">Walkthrough</Link>
          </div>
          <Link to="/contact" className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </Link>
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
                    xlinkHref="/images/tower-b-typical-floor.png"
                    href="/images/tower-b-typical-floor.png"
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
                src: '/images/tower-b-typical-floor.png',
                title: `Arcadia Typical Floor — Floor ${selectedFloor}`
              })}
            >
              Zoom Image
            </button>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="home-bottombar">
          <Link to="/" className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          </Link>
          <div className="home-bottombar-items">
            <Link to="/" className="home-bottombar-item active">Project Highlights</Link>
            <Link to="/contact" className="home-bottombar-item">Location</Link>
            <Link to="/floor-plan" className="home-bottombar-item">Master Plan</Link>
            <Link to="/" className="home-bottombar-item">Project Details</Link>
            <Link to="/features" className="home-bottombar-item">Amenities</Link>
            <Link to="/" className="home-bottombar-item">Collaterals</Link>
            <Link to="/" className="home-bottombar-item">Walkthrough</Link>
          </div>
          <Link to="/contact" className="home-bottombar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </Link>
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
        <Link to="/" className="home-bottombar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
        </Link>
        <div className="home-bottombar-items">
          <Link to="/" className="home-bottombar-item active">Project Highlights</Link>
          <Link to="/contact" className="home-bottombar-item">Location</Link>
          <Link to="/floor-plan" className="home-bottombar-item">Master Plan</Link>
          <Link to="/" className="home-bottombar-item">Project Details</Link>
          <Link to="/features" className="home-bottombar-item">Amenities</Link>
          <Link to="/" className="home-bottombar-item">Collaterals</Link>
          <Link to="/" className="home-bottombar-item">Walkthrough</Link>
        </div>
        <Link to="/contact" className="home-bottombar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </Link>
      </div>
    </div>
  );
}

export default Home;
