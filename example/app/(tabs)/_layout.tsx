import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import type React from 'react'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Stack
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          paddingHorizontal: 16,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Chat',
        }}
      />
    </Stack>
  )
}
