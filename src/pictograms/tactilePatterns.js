import {
  createEmptyMatrix,
  drawCircle,
  drawDigit,
  drawLine,
} from "./drawingUtils";

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 24;

export function createWeatherPattern({
  condition = "sunny",
  temperature = 24,
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
}) {
  const matrix = createEmptyMatrix(
    columns,
    rows
  );

  if (condition === "sunny") {
    drawSun(matrix, columns, rows);
  }

  if (condition === "cloudy") {
    drawCloud(matrix, columns, rows);
  }

  if (condition === "rainy") {
    drawCloud(matrix, columns, rows);
    drawRain(matrix, columns, rows);
  }

  drawTemperature(
    matrix,
    temperature,
    columns,
    rows
  );

  return matrix;
}

function drawSun(matrix, columns, rows) {
  const centerX = Math.round(columns * 0.26);
  const centerY = Math.round(rows * 0.5);

  const radius = Math.max(
    3,
    Math.round(Math.min(columns, rows) * 0.15)
  );

  drawCircle(
    matrix,
    centerX,
    centerY,
    radius
  );

  for (
    let angle = 0;
    angle < Math.PI * 2;
    angle += Math.PI / 4
  ) {
    drawLine(
      matrix,
      Math.round(
        centerX +
          Math.cos(angle) * (radius + 2)
      ),
      Math.round(
        centerY +
          Math.sin(angle) * (radius + 2)
      ),
      Math.round(
        centerX +
          Math.cos(angle) * (radius + 5)
      ),
      Math.round(
        centerY +
          Math.sin(angle) * (radius + 5)
      )
    );
  }
}

function drawCloud(matrix, columns, rows) {
  const centerX = Math.round(columns * 0.25);
  const centerY = Math.round(rows * 0.5);

  drawCircle(matrix, centerX - 5, centerY, 4);
  drawCircle(matrix, centerX, centerY - 3, 5);
  drawCircle(matrix, centerX + 5, centerY, 4);

  drawLine(
    matrix,
    centerX - 9,
    centerY + 4,
    centerX + 9,
    centerY + 4
  );
}

function drawRain(matrix, columns, rows) {
  const centerX = Math.round(columns * 0.25);
  const startY = Math.round(rows * 0.72);

  [-5, 0, 5].forEach((offset) => {
    drawLine(
      matrix,
      centerX + offset,
      startY,
      centerX + offset - 2,
      startY + 4
    );
  });
}

function drawTemperature(
  matrix,
  temperature,
  columns,
  rows
) {
  const value = String(Math.abs(temperature));
  const scale = Math.max(
    1,
    Math.floor(rows / 12)
  );

  const startX = Math.round(columns * 0.58);
  const startY = Math.round(rows * 0.35);

  [...value].forEach((digit, index) => {
    drawDigit(
      matrix,
      startX + index * 4 * scale,
      startY,
      digit,
      scale
    );
  });

  drawCircle(
    matrix,
    startX + value.length * 4 * scale + scale,
    startY + scale,
    Math.max(1, scale)
  );
}