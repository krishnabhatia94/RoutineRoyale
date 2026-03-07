import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => <Text style={styles.headerTitle}>Routine Royale</Text>,
        headerRight: () => (
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsValue}>0</Text>
            <Text style={styles.pointsLabel}>pts</Text>
          </View>
        ),
        headerStyle: { backgroundColor: '#f8fafc', elevation: 0, shadowOpacity: 0 },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#666',
        
        // --- COMPREHENSIVE ANDROID NAVIGATION FIX ---
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          // We add the system inset to a base height
          height: Platform.OS === 'android' ? 65 + insets.bottom : 88, 
          paddingBottom: Platform.OS === 'android' ? insets.bottom + 8 : insets.bottom,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          // Small nudge for Android text
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "trophy" : "trophy-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "people-circle" : "people-circle-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboards"
        options={{
          title: 'Leaderboards',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "podium" : "podium-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
      
      {/* Keeps index hidden from the bar */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="edit_avatar" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e40af', marginLeft: 10 },
  pointsBadge: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pointsValue: { fontWeight: 'bold', fontSize: 14, color: '#1e40af' },
  pointsLabel: { fontSize: 8, color: '#64748b', textTransform: 'uppercase' },
});