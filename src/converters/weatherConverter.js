export function convertWeather(weather) {
  return {
    id: weather.id,
    category: "weather",
    title: "Weather forecast",
    pictograms: [weather.condition],
    shortValue: `${weather.temperature}°`,
    audioSummary:
      `Today, ${weather.condition}, ` +
      `${weather.temperature} degrees.`,
    rawData: weather,
  };
}