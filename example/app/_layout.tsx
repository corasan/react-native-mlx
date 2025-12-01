import { Stack } from 'expo-router'
import 'react-native-reanimated'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import 'expo-dev-client'
import { BenchmarkProvider } from '../components/benchmark-context'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function RootLayout() {
  return (
    <BenchmarkProvider>
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
          <Stack.Screen
            name="settings-modal"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </KeyboardProvider>
    </BenchmarkProvider>
  )
}
