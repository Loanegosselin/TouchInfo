export function createEmptyMatrix(rows, columns) {
  return Array.from(
    { length: rows },
    () => Array(columns).fill(0)
  );
}

export function insertPattern(
  targetMatrix,
  pattern,
  startRow,
  startColumn
) {
  const result = targetMatrix.map((row) => [...row]);

  pattern.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const targetRow = startRow + rowIndex;
      const targetColumn = startColumn + columnIndex;

      if (
        result[targetRow] &&
        result[targetRow][targetColumn] !== undefined
      ) {
        result[targetRow][targetColumn] = value;
      }
    });
  });

  return result;
}