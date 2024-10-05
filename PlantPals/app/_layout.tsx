import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="camera" options={{headerShown: false}}/>
      <Stack.Screen name="api" options={{headerShown: false}}/>
    </Stack>
  );
}
