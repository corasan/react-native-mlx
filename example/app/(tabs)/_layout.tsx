import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Stack, Tabs } from 'expo-router'
import type React from 'react'
import { Pressable } from 'react-native'

import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { bottom } = useSafeAreaInsets()

  return (
    <Stack
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          paddingBottom: bottom + 24,
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
