import {
  createWeatherPattern,
} from "./tactilePatterns";

export function composePattern(information) {
  if (!information) {
    return [];
  }

  switch (information.category) {
    case "weather":
      return createWeatherPattern({
        condition:
          information.rawData?.condition ||
          "sunny",
        temperature:
          information.rawData?.temperature ??
          24,
      });

    default:
      return [];
  }
}