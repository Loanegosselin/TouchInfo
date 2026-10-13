export function createEmptyMatrix(columns, rows) {
  return Array.from(
    { length: rows },
    () => Array(columns).fill(0)
  );
}

export function setPoint(
  matrix,
  x,
  y,
  value = 1
) {
  if (
    y >= 0 &&
    y < matrix.length &&
    x >= 0 &&
    x < matrix[y].length
  ) {
    matrix[y][x] = value;
  }
}

export function drawLine(
  matrix,
  startX,
  startY,
  endX,
  endY
) {
  let x = startX;
  let y = startY;

  const deltaX = Math.abs(endX - startX);
  const stepX = startX < endX ? 1 : -1;

  const deltaY = -Math.abs(endY - startY);
  const stepY = startY < endY ? 1 : -1;

  let error = deltaX + deltaY;

  while (true) {
    setPoint(matrix, x, y);

    if (x === endX && y === endY) {
      break;
    }

    const doubledError = 2 * error;

    if (doubledError >= deltaY) {
      error += deltaY;
      x += stepX;
    }

    if (doubledError <= deltaX) {
      error += deltaX;
      y += stepY;
    }
  }
}

export function drawRectangle(
  matrix,
  x,
  y,
  width,
  height,
  filled = false
) {
  if (filled) {
    for (
      let currentY = y;
      currentY < y + height;
      currentY += 1
    ) {
      drawLine(
        matrix,
        x,
        currentY,
        x + width - 1,
        currentY
      );
    }

    return;
  }

  drawLine(
    matrix,
    x,
    y,
    x + width - 1,
    y
  );

  drawLine(
    matrix,
    x,
    y + height - 1,
    x + width - 1,
    y + height - 1
  );

  drawLine(
    matrix,
    x,
    y,
    x,
    y + height - 1
  );

  drawLine(
    matrix,
    x + width - 1,
    y,
    x + width - 1,
    y + height - 1
  );
}

export function drawCircle(
  matrix,
  centerX,
  centerY,
  radius
) {
  let x = radius;
  let y = 0;
  let error = 0;

  while (x >= y) {
    const points = [
      [x, y],
      [y, x],
      [-y, x],
      [-x, y],
      [-x, -y],
      [-y, -x],
      [y, -x],
      [x, -y],
    ];

    points.forEach(([offsetX, offsetY]) => {
      setPoint(
        matrix,
        centerX + offsetX,
        centerY + offsetY
      );
    });

    y += 1;

    if (error <= 0) {
      error += 2 * y + 1;
    }

    if (error > 0) {
      x -= 1;
      error -= 2 * x + 1;
    }
  }
}

export function drawDigit(
  matrix,
  x,
  y,
  digit,
  scale = 1
) {
  const digitPatterns = {
    0: ["111", "101", "101", "101", "111"],
    1: ["010", "110", "010", "010", "111"],
    2: ["111", "001", "111", "100", "111"],
    3: ["111", "001", "111", "001", "111"],
    4: ["101", "101", "111", "001", "001"],
    5: ["111", "100", "111", "001", "111"],
    6: ["111", "100", "111", "101", "111"],
    7: ["111", "001", "010", "010", "010"],
    8: ["111", "101", "111", "101", "111"],
    9: ["111", "101", "111", "001", "111"],
  };

  const pattern = digitPatterns[digit];

  if (!pattern) {
    return;
  }

  pattern.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      if (cell === "1") {
        drawRectangle(
          matrix,
          x + columnIndex * scale,
          y + rowIndex * scale,
          scale,
          scale,
          true
        );
      }
    });
  });
}