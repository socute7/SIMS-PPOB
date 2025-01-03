import { Stack, Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}
