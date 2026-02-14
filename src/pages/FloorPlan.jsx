import { useState } from 'react';
import { units, typicalFloors, floorTypeLabel, bhkLegend, galleryImages } from '../data/buildingData';
import ImageModal from '../components/ImageModal';
import './FloorPlan.css';

function FloorPlan() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const unitList = Object.values(units);
  const floorPlanImages = galleryImages.filter(img =>
    img.category === 'floor-plan' || img.category === 'unit-plan' || img.category === '3d-view'
  );

  return (
    <div className="floorplan-page">
      {/* Page Header */}
      <section className="page-header">
        <h1>Floor Plans</h1>
        <p>Arcadia — Hiranandani Fortune City, Panvel</p>
      </section>

      {/* Floor Plan Images - Double Click to Open */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Floor Plan Views</h2>
          <div className="gold-line"></div>
          <p className="section-subtitle">Double-click on any plan to view full size</p>

          <div className="floorplan-images-grid">
            {floorPlanImages.map(img => (
              <div
                key={img.id}
                className="floorplan-image-card"
                onDoubleClick={() => setModalImage(img)}
              >
                <div className="fpi-img-wrap">
                  <img src={img.src} alt={img.title} />
                  <div className="fpi-overlay">
                    <span>Double-click to enlarge</span>
                  </div>
                </div>
                <p className="fpi-title">{img.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor & Unit Details */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <h2 className="section-title">Unit Details</h2>
          <div className="gold-line"></div>

          {/* Floor Info */}
          <div className="floor-info-bar">
            <span className="floor-label">{floorTypeLabel}</span>
          </div>

          {/* BHK Legend */}
          <div className="bhk-legend">
            {bhkLegend.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ background: item.color }}></span>
                <span className="legend-text">Unit {index + 1} — {item.type}</span>
              </div>
            ))}
          </div>

          {/* Floor Selector */}
          <div className="floor-selector">
            <h3>Select Floor</h3>
            <div className="floor-grid">
              {typicalFloors.map(floor => (
                <button
                  key={floor}
                  className={`floor-btn ${selectedFloor === floor ? 'active' : ''}`}
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Cards */}
          <div className="unit-cards">
            {unitList.map(unit => (
              <div
                key={unit.number}
                className={`unit-card ${selectedUnit === unit.number ? 'active' : ''}`}
                style={{ borderTopColor: unit.color }}
                onDoubleClick={() => setSelectedUnit(selectedUnit === unit.number ? null : unit.number)}
              >
                <div className="unit-card-header" style={{ background: unit.color }}>
                  <span className="unit-number">Unit {unit.number}</span>
                  <span className="unit-type">{unit.type}</span>
                </div>

                <div className="unit-card-areas">
                  <div className="area-row">
                    <span>Carpet Area</span>
                    <strong>{unit.carpetArea}</strong>
                  </div>
                  <div className="area-row">
                    <span>Deck Area</span>
                    <strong>{unit.deckArea}</strong>
                  </div>
                  <div className="area-row total">
                    <span>Total Area</span>
                    <strong>{unit.totalArea}</strong>
                  </div>
                </div>

                <div className="unit-card-action">
                  <span>{selectedUnit === unit.number ? 'Double-click to collapse' : 'Double-click to view rooms'}</span>
                </div>

                {selectedUnit === unit.number && (
                  <div className="unit-rooms">
                    <h4>Room Dimensions</h4>
                    <div className="room-list">
                      {unit.rooms.map((room, idx) => (
                        <div key={idx} className="room-row">
                          <span className="room-name">{room.name}</span>
                          <span className="room-size">{room.size}</span>
                        </div>
                      ))}
                    </div>
                    <div className="unit-metric">
                      <p>Carpet: {unit.carpetAreaSqm} | Deck: {unit.deckAreaSqm} | Total: {unit.totalAreaSqm}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedFloor && (
            <div className="floor-selected-info">
              <p>
                Viewing Floor <strong>{selectedFloor}</strong> — All 4 units available on this floor.
                Double-click on a unit card to view detailed room dimensions.
              </p>
            </div>
          )}
        </div>
      </section>

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

export default FloorPlan;
