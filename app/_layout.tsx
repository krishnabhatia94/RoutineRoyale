import { PointsProvider, usePoints } from '@/context/PointsContext'; // Added usePoints
import { TaskListProvider } from '@/context/TaskListContext';
import { TaskStatusProvider } from '@/context/TaskStatusContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. Created a sub-component to consume the Context
const PointsHeader = () => {
  const { totalPoints } = usePoints(); // Pulls live points from context

  return (
    <View style={styles.pointsBadge}>
      <Text style={styles.pointsValue}>{totalPoints}</Text>
      <Text style={styles.pointsLabel}>pts</Text>
    </View>
  );
};

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskStatusProvider>
        <TaskListProvider>
          <PointsProvider>
            <Tabs
              screenOptions={{
                headerTitle: () => <Text style={styles.headerTitle}>Routine Royale</Text>,
                // 2. Use the sub-component here
                headerRight: () => <PointsHeader />,
                headerStyle: {
                  backgroundColor: 'white',
                  borderBottomWidth: 1,
                  borderBottomColor: '#e2e8f0',
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                },
                headerTitleAlign: 'left',
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                  backgroundColor: 'white',
                  borderTopWidth: 1,
                  borderTopColor: '#e2e8f0',
                  height: Platform.OS === 'android' ? 65 + insets.bottom : 88,
                  paddingBottom: Platform.OS === 'android' ? insets.bottom + 8 : insets.bottom,
                  paddingTop: 10,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '500',
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
              {/* ... other Tabs.Screen components remain exactly the same ... */}
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

              <Tabs.Screen name="index" options={{ href: null }} />
              <Tabs.Screen name="edit_avatar" options={{ href: null }} />
              <Tabs.Screen
                name="routine_active"
                options={{
                  href: null,
                  tabBarStyle: { display: 'none' },
                  headerShown: true
                }}
              />
              <Tabs.Screen name="task_list" options={{ href: null }} />
              <Tabs.Screen name="post_routine" options={{ href: null }} />
              <Tabs.Screen name="matchmaking" options={{ href: null }} />
            </Tabs>
          </PointsProvider>
        </TaskListProvider>
      </TaskStatusProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e40af', marginLeft: Platform.OS === 'ios' ? 0 : 10 },
  pointsBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
  },
  pointsValue: { fontWeight: 'bold', fontSize: 14, color: '#1e40af' },
  pointsLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginLeft: 4, fontWeight: '600' },
});