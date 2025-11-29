import { Stack } from 'expo-router'
// import * as SplashScreen from 'expo-splash-screen'
import 'react-native-reanimated'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import 'expo-dev-client'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

// SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="download-modal"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </KeyboardProvider>
  )
}
