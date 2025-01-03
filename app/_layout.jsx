import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </Provider>
  );
}
