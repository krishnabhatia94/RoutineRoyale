import { ProfileProvider, useProfile } from '@/context/ProfileContext';
import { TaskListProvider } from '@/context/TaskListContext';
import { TaskStatusProvider } from '@/context/TaskStatusContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PointsHeader = () => {
  const { totalPoints, isDarkMode } = useProfile();

  return (
    <View style={[styles.pointsBadge, isDarkMode && styles.pointsBadgeDark]}>
      <Text style={[styles.pointsValue, isDarkMode && styles.pointsValueDark]}>{totalPoints}</Text>
      <Text style={[styles.pointsLabel, isDarkMode && styles.pointsLabelDark]}>pts</Text>
    </View>
  );
};

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useProfile();

  return (
    <Tabs
      initialRouteName="setup"
      screenOptions={{
        headerTitle: () => <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>RoutineRoyale</Text>,
        headerRight: () => <PointsHeader />,
        headerStyle: {
          backgroundColor: isDarkMode ? '#1e293b' : 'white',
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#334155' : '#e2e8f0',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDarkMode ? 0.2 : 0.05,
          shadowRadius: 2,
        },
        headerTitleAlign: 'left',
        tabBarActiveTintColor: isDarkMode ? '#38bdf8' : '#3b82f6',
        tabBarInactiveTintColor: isDarkMode ? '#94a3b8' : '#666',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1e293b' : 'white',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#334155' : '#e2e8f0',
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
      <Tabs.Screen
        name="setup"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="edit_avatar"
        options={{
          href: null,
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tabs.Screen
        name="routine_active"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
          headerShown: true
        }}
      />
      <Tabs.Screen
        name="task_list"
        options={{
          href: null,
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tabs.Screen name="post_routine" options={{ href: null }} />
      <Tabs.Screen name="matchmaking" options={{ href: null }} />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
        <TaskStatusProvider>
          <TaskListProvider>
            <TabNavigator />
          </TaskListProvider>
        </TaskStatusProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e40af', marginLeft: Platform.OS === 'ios' ? 0 : 10 },
  headerTitleDark: { color: '#f8fafc' },
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
  pointsBadgeDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  pointsValue: { fontWeight: 'bold', fontSize: 14, color: '#1e40af' },
  pointsValueDark: { color: '#38bdf8' },
  pointsLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginLeft: 4, fontWeight: '600' },
  pointsLabelDark: { color: '#94a3b8' },
});
