import { towerFeatures, unitDetails } from '../data/buildingData';
import './Features.css';

function Features() {
  const amenities = [
    { name: 'Swimming Pool', desc: 'Temperature-controlled swimming pool for residents' },
    { name: 'Gymnasium', desc: 'Fully equipped modern fitness center' },
    { name: 'Clubhouse', desc: 'Exclusive clubhouse with lounge and party area' },
    { name: 'Children\'s Play Area', desc: 'Safe and fun outdoor play zone for kids' },
    { name: 'Landscaped Gardens', desc: 'Beautifully designed green spaces and walking paths' },
    { name: 'Multi-purpose Hall', desc: 'Spacious hall for events and celebrations' },
    { name: '24/7 Security', desc: 'Round-the-clock security with CCTV surveillance' },
    { name: 'Covered Parking', desc: 'Dedicated covered parking for all residents' },
  ];

  return (
    <div className="features-page">
      <section className="page-header">
        <h1>Features & Amenities</h1>
        <p>Hiranandani Fortune City, Panvel — Premium Living Standards</p>
      </section>

      {/* Tower Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Tower Features</h2>
          <div className="gold-line"></div>
          <p className="section-subtitle">State-of-the-art infrastructure for safety and convenience</p>

          <div className="tower-features-grid">
            {towerFeatures.map(feature => (
              <div key={feature.id} className="tower-feature-card">
                <div className="tf-icon-wrap">
                  <span className="tf-icon">{getFeatureIcon(feature.icon)}</span>
                </div>
                <h3>{feature.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Details */}
      <section className="section unit-details-section">
        <div className="container">
          <h2 className="section-title">Unit Specifications</h2>
          <div className="gold-line"></div>
          <p className="section-subtitle">Premium finishes and fittings in every Presidentia residence</p>

          <div className="unit-details-grid">
            {unitDetails.map(detail => (
              <div key={detail.id} className="unit-detail-card">
                <div className="ud-icon">{getDetailIcon(detail.icon)}</div>
                <p>{detail.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Lifestyle Amenities</h2>
          <div className="gold-line"></div>
          <p className="section-subtitle">World-class facilities designed for modern living</p>

          <div className="amenities-grid">
            {amenities.map((amenity, index) => (
              <div key={index} className="amenity-card">
                <div className="amenity-number">{String(index + 1).padStart(2, '0')}</div>
                <h3>{amenity.name}</h3>
                <p>{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getFeatureIcon(icon) {
  const icons = {
    'intercom': '📞',
    'video-door': '🚪',
    'cctv': '📹',
    'power': '⚡',
    'fire': '🔥',
  };
  return icons[icon] || '✦';
}

function getDetailIcon(icon) {
  const icons = {
    'marble': '◆',
    'tiles': '▦',
    'kitchen': '◈',
    'ac': '❄',
  };
  return icons[icon] || '✦';
}

export default Features;
