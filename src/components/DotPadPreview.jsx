function DotPadPreview({
  matrix = [],
  title = "Tactile preview",
}) {
  if (!matrix.length) {
    return (
      <section className="device">
        <p>No tactile pattern available.</p>
      </section>
    );
  }

  const columns = matrix[0]?.length || 1;

  return (
    <section
      className="device"
      aria-label="Virtual DotPad preview"
    >
      <div className="device-topbar">
        <div>
          <span className="device-label">
            DOTPAD PREVIEW
          </span>

          <strong>{title}</strong>
        </div>

        <div className="connection">
          <span />
          Virtual mode
        </div>
      </div>

      <div className="screen-wrap">
        <div
          className="dot-grid"
          style={{
            "--cols": columns,
            "--rows": matrix.length,
          }}
          role="img"
          aria-label={title}
        >
          {matrix.flatMap((row, rowIndex) =>
            row.map((point, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className={
                  point
                    ? "dot on"
                    : "dot"
                }
                aria-hidden="true"
              />
            ))
          )}
        </div>
      </div>

      <div
        className="device-buttons"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div
        className="braille-line"
        aria-hidden="true"
      />
    </section>
  );
}

export default DotPadPreview;