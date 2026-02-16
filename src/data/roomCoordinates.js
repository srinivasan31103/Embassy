// Room SVG path coordinates for 3bhk-presidentia-3d.png (3000x1688)
// Traced from the 3D isometric render of 3BHK Presidentia unit

export const roomPaths = {
  // Unit 2 - 3BHK Presidentia (all units share same 3D image)
  2: [
    { name: 'Bedroom 2', size: "11'0\" x 14'0\"", path: "M 299,477 L 695,474 L 628,893 L 158,877 Z" },
    { name: 'Toilet 2', size: "5'0\" x 8'0\"", path: "M 260,893 L 475,898 L 406,1157 L 188,1157 Z" },
    { name: 'Bedroom 1', size: "11'0\" x 13'0\"", path: "M 723,426 L 1121,428 L 1088,768 L 649,770 Z" },
    { name: 'Toilet', size: "4'6\" x 8'0\"", path: "M 1128,548 L 1289,551 L 1285,768 L 1100,770 Z" },
    { name: 'Kitchen', size: "8'5\" x 11'2\"", path: "M 706,891 L 1063,895 L 1026,1268 L 628,1270 Z" },
    { name: 'Utility', size: "3'6\" x 5'6\"", path: "M 440,1083 L 658,1085 L 612,1293 L 445,1298 L 484,1166 L 420,1166 Z" },
    { name: 'Living/Dining', size: "21'0\" x 14'3\"", path: "M 1324,493 L 1313,875 L 2115,875 L 2090,495 Z" },
    { name: 'Master Bedroom', size: "11'0\" x 15'0\"", path: "M 2120,548 L 2534,548 L 2638,939 L 2187,939 Z" },
    { name: 'M.Toilet', size: "5'0\" x 8'0\"", path: "M 2590,696 L 2777,699 L 2879,937 L 2659,939 Z" },
    { name: 'Entrance Foyer', size: "5'6\" x 6'11\"", path: "M 2162,888 L 2194,1104 L 1953,1094 L 1935,895 Z" },
    { name: 'Balcony', size: "13'0\" x 5'0\"", path: "M 1458,393 L 1463,488 L 1953,493 L 1935,386 Z" },
    { name: 'Balcony 2', size: "7'0\" x 5'0\"", path: "M 396,379 L 669,372 L 639,465 L 366,467 Z" },
    { name: 'Passage', size: "11'8\" x 3'3\"", path: "M 1095,898 L 1907,891 L 1889,1020 L 1114,1018 Z" },
  ],
};

// All units use same 3BHK image for now
roomPaths[1] = roomPaths[2];
roomPaths[3] = roomPaths[2];
roomPaths[4] = roomPaths[2];
