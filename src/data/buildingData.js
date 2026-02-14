// Hiranandani Fortune City Panvel - Arcadia Building Data

export const projectInfo = {
  name: 'Hiranandani Fortune City',
  location: 'Panvel',
  tower: 'Arcadia',
  developer: 'Hiranandani Communities',
  tagline: 'A Niranjan Hiranandani Initiative',
};

export const towerFeatures = [
  { id: 1, name: 'Intercom Systems', icon: 'intercom' },
  { id: 2, name: 'Video Door Phone', icon: 'video-door' },
  { id: 3, name: 'CCTV Camera (Ground Floor Entrance Lobby)', icon: 'cctv' },
  { id: 4, name: 'Power Backup (Common Area)', icon: 'power' },
  { id: 5, name: 'Fire Fighting Systems', icon: 'fire' },
];

export const unitDetails = [
  { id: 1, name: 'Imported marble flooring in Living, Dining, and all bedrooms', icon: 'marble' },
  { id: 2, name: 'Vitrified tiles in Kitchen and Bathrooms', icon: 'tiles' },
  { id: 3, name: 'Modular kitchen design with quartz countertop; under-counter setup', icon: 'kitchen' },
  { id: 4, name: 'Air-conditioning in Living and Bedroom', icon: 'ac' },
];

// Tower B typical floors (residential floors — excludes refuge floors 7, 12, 17, 22)
export const typicalFloors = [3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 21, 23, 24, 25, 26, 27];

export const floorTypeLabel = "FLOORS : 3rd-6th, 8th-11th, 13th-16th, 18th-21st, 23rd-27th";

// Measured floor positions on building elevation image (percentage coordinates)
// y = vertical center %, x1 = left edge %, x2 = right edge %
// Derived from left tower + right tower marks on the elevation image
export const floorPositions = {
  27: { y: 20.2, x1: 43.4, x2: 55.9 },
  26: { y: 22.4, x1: 43.1, x2: 56.0 },
  25: { y: 25.1, x1: 43.3, x2: 55.4 },
  24: { y: 28.5, x1: 43.4, x2: 55.2 },
  23: { y: 30.8, x1: 43.5, x2: 55.2 },
  21: { y: 33.2, x1: 43.2, x2: 56.1 },
  20: { y: 35.8, x1: 43.4, x2: 55.4 },
  19: { y: 38.7, x1: 43.3, x2: 55.9 },
  18: { y: 41.6, x1: 43.5, x2: 55.9 },
  16: { y: 45.0, x1: 43.5, x2: 55.5 },
  15: { y: 48.2, x1: 43.5, x2: 55.9 },
  14: { y: 51.1, x1: 43.5, x2: 55.9 },
  13: { y: 53.6, x1: 43.4, x2: 55.6 },
  11: { y: 56.1, x1: 43.4, x2: 55.2 },
  10: { y: 58.6, x1: 43.5, x2: 55.3 },
  9:  { y: 61.8, x1: 43.4, x2: 55.2 },
  8:  { y: 64.4, x1: 43.5, x2: 56.2 },
  6:  { y: 66.6, x1: 43.4, x2: 56.2 },
  5:  { y: 69.0, x1: 43.4, x2: 56.0 },
  4:  { y: 71.3, x1: 43.4, x2: 55.6 },
  3:  { y: 74.2, x1: 43.2, x2: 55.6 },
};

// Units per floor
export const units = {
  1: {
    number: 1,
    type: '2 BHK',
    color: '#F5E6CC',
    rooms: [
      { name: 'Entrance Foyer', size: "4'6\" x 6'3\"" },
      { name: 'Living/Dining', size: "11'4\" x 15'10\"" },
      { name: 'Deck', size: "11'2\" x 4'7\"" },
      { name: 'Kitchen', size: "10'10\" x 8'" },
      { name: 'Dry Balcony', size: "3'3\" x 8'0\"" },
      { name: 'Utility/Storage', size: "7' x 3'5\"" },
      { name: 'Bedroom 2 Passage', size: "3'5\" x 3'7\"" },
      { name: 'Bedroom 2', size: "11'7\" x 11'" },
      { name: 'Toilet 2', size: "8' x 5'" },
      { name: 'Passage 1', size: "5' x 3'5\"" },
      { name: 'Common Toilet', size: "8' x 4'5\"" },
      { name: 'Master Passage', size: "3'5\" x 3'5\"" },
      { name: 'Master Bedroom', size: "11' x 12'10\"" },
      { name: 'Master Toilet', size: "5' x 8'4\"" },
    ],
    carpetArea: '74.48 Sq.Ft',
    deckArea: '4.92 Sq.Ft',
    totalArea: '113.12 Sq.Ft',
    carpetAreaSqm: '69.63 Sq.M',
    deckAreaSqm: '4.92 Sq.M',
    totalAreaSqm: '106.35 Sq.M',
  },
  2: {
    number: 2,
    type: '3 BHK',
    color: '#F5DEB3',
    rooms: [
      { name: 'Entrance Foyer', size: "5'6\" x 6'11\"" },
      { name: 'Living/Dining', size: "21'0\" x 14'3\"" },
      { name: 'Balcony', size: "13'0\" x 5'0\"" },
      { name: 'Kitchen', size: "8'5\" x 11'2\"" },
      { name: 'Utility', size: "3'6\" x 5'6\"" },
      { name: 'Walk In', size: "5'0\" x 6'0\"" },
      { name: 'Passage', size: "11'8\" x 3'3\"" },
      { name: 'Bedroom 1', size: "11'0\" x 13'0\"" },
      { name: 'Toilet', size: "4'6\" x 8'0\"" },
      { name: 'Master Bedroom', size: "11'0\" x 15'0\"" },
      { name: 'M.Toilet', size: "5'0\" x 8'0\"" },
      { name: 'Bedroom 2', size: "11'0\" x 14'0\"" },
      { name: 'Toilet 2', size: "5'0\" x 8'0\"" },
      { name: 'Balcony 2', size: "7'0\" x 5'0\"" },
    ],
    carpetArea: '1182.565 Sq.Ft',
    deckArea: '99.879 Sq.Ft',
    totalArea: '1282.444 Sq.Ft',
    carpetAreaSqm: '109.863 Sq.M',
    deckAreaSqm: '9.279 Sq.M',
    totalAreaSqm: '119.142 Sq.M',
  },
  3: {
    number: 3,
    type: '2 BHK',
    color: '#E8C99B',
    rooms: [
      { name: 'Entrance Foyer', size: "4'6\" x 6'3\"" },
      { name: 'Living/Dining', size: "11'4\" x 15'10\"" },
      { name: 'Deck', size: "11'2\" x 4'7\"" },
      { name: 'Kitchen', size: "10'10\" x 8'" },
      { name: 'Dry Balcony', size: "3'3\" x 8'0\"" },
      { name: 'Utility/Storage', size: "7' x 3'5\"" },
      { name: 'Bedroom 2 Passage', size: "3'5\" x 3'7\"" },
      { name: 'Bedroom 2', size: "11'7\" x 11'" },
      { name: 'Toilet 2', size: "8' x 5'" },
      { name: 'Passage 1', size: "5' x 3'5\"" },
      { name: 'Common Toilet', size: "8' x 4'5\"" },
      { name: 'Master Passage', size: "3'5\" x 3'5\"" },
      { name: 'Master Bedroom', size: "11' x 12'10\"" },
      { name: 'Master Toilet', size: "5' x 8'4\"" },
    ],
    carpetArea: '74.48 Sq.Ft',
    deckArea: '4.92 Sq.Ft',
    totalArea: '113.12 Sq.Ft',
    carpetAreaSqm: '69.63 Sq.M',
    deckAreaSqm: '4.92 Sq.M',
    totalAreaSqm: '106.35 Sq.M',
  },
  4: {
    number: 4,
    type: '2 BHK',
    color: '#F5E6CC',
    rooms: [
      { name: 'Entrance Foyer', size: "4'6\" x 6'3\"" },
      { name: 'Living/Dining', size: "11'4\" x 15'10\"" },
      { name: 'Deck', size: "11'2\" x 4'7\"" },
      { name: 'Kitchen', size: "10'10\" x 8'" },
      { name: 'Dry Balcony', size: "3'3\" x 8'0\"" },
      { name: 'Utility/Storage', size: "7' x 3'5\"" },
      { name: 'Bedroom 2 Passage', size: "3'5\" x 3'7\"" },
      { name: 'Bedroom 2', size: "11'7\" x 11'" },
      { name: 'Toilet 2', size: "8' x 5'" },
      { name: 'Passage 1', size: "5' x 3'5\"" },
      { name: 'Common Toilet', size: "8' x 4'5\"" },
      { name: 'Master Passage', size: "3'5\" x 3'5\"" },
      { name: 'Master Bedroom', size: "11' x 12'10\"" },
      { name: 'Master Toilet', size: "5' x 8'4\"" },
    ],
    carpetArea: '74.48 Sq.Ft',
    deckArea: '4.92 Sq.Ft',
    totalArea: '113.12 Sq.Ft',
    carpetAreaSqm: '69.63 Sq.M',
    deckAreaSqm: '4.92 Sq.M',
    totalAreaSqm: '106.35 Sq.M',
  },
};

// BHK legend colors for floor plan
export const bhkLegend = [
  { type: '2 BHK', color: '#F5E6CC' },
  { type: '3 BHK', color: '#F5DEB3' },
  { type: '2 BHK', color: '#E8C99B' },
  { type: '2 BHK', color: '#F5E6CC' },
];

// Gallery images for the project
export const galleryImages = [
  { id: 1, src: '/images/tower-b-typical-floor.png', title: 'Tower B - Typical Floor Plan', category: 'floor-plan' },
  { id: 2, src: '/images/3bhk-presidentia-3d.png', title: '3BHK Presidentia - 3D View', category: '3d-view' },
  { id: 3, src: '/images/3bhk-unit-plan.png', title: 'Arcadia 3BHK Presidentia I - Unit Plan', category: 'unit-plan' },
  { id: 4, src: '/images/arcadia-typical-plan.png', title: 'Arcadia Typical Plan - 3D Overview', category: '3d-view' },
  { id: 5, src: '/images/building-elevation.png', title: 'Building Elevation', category: 'elevation' },
];
