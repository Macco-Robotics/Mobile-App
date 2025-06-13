import React from "react";
import { ThemeProvider } from "./context/themeContext";
import { Stack } from "expo-router";

export default function App() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
