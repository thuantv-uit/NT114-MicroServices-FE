// Hàm tính màu sắc dựa trên process (0: đỏ, 100: xanh lá)
const getCardBackgroundColor = (process) => {
  const colors = {
    0: { r: 255, g: 0, b: 0 }, // Đỏ
    25: { r: 255, g: 128, b: 0 }, // Cam
    50: { r: 255, g: 255, b: 0 }, // Vàng
    75: { r: 128, g: 255, b: 0 }, // Xanh lá nhạt
    100: { r: 0, g: 255, b: 0 }, // Xanh lá
  };

  const processValues = Object.keys(colors).map(Number).sort((a, b) => a - b);
  let lower = processValues.find((val) => val <= process) || 0;
  let upper = processValues.find((val) => val > process) || 100;

  if (process <= lower) return `rgb(${colors[lower].r}, ${colors[lower].g}, ${colors[lower].b})`;
  if (process >= upper) return `rgb(${colors[upper].r}, ${colors[upper].g}, ${colors[upper].b})`;

  const ratio = (process - lower) / (upper - lower);
  const r = Math.round(colors[lower].r + (colors[upper].r - colors[lower].r) * ratio);
  const g = Math.round(colors[lower].g + (colors[upper].g - colors[lower].g) * ratio);
  const b = Math.round(colors[lower].b + (colors[upper].b - colors[lower].b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
};

export default getCardBackgroundColor;