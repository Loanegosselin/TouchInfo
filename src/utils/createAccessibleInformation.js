export function createAccessibleInformation({
  id,
  category,
  title,
  pictograms = [],
  shortValue = "",
  audioSummary = "",
  priority = "normal",
  timestamp = new Date().toISOString(),
}) {
  return {
    id,
    category,
    title,
    pictograms,
    shortValue,
    audioSummary,
    priority,
    timestamp,
  };
}