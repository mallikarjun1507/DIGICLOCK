import { useColorScheme } from "react-native";
import { lightColors, darkColors, greenColors } from "../theme/colors";

export function useTheme() {
  const systemScheme = useColorScheme();
  const hour = new Date().getHours();

  // time-based theme
  let timeScheme: "light" | "green" | "dark";

  if (hour >= 6 && hour < 12) {
    timeScheme = "light"; // Morning 
  } else if (hour >= 12 && hour < 18) {
    timeScheme = "green"; // Afternoon 
  } else {
    timeScheme = "dark"; // Evening 
  }

  // Combine system preference with time logic
  let scheme: "light" | "green" | "dark" =
    systemScheme === "dark" ? "dark" : timeScheme;

  // Pick colors based on final theme
  const colors =
    scheme === "dark"
      ? darkColors
      : scheme === "green"
      ? greenColors
      : lightColors;

  return { scheme, colors };
}
