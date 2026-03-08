import { useTasks } from '@/context/TaskListContext';
import { useTaskStatus } from '@/context/TaskStatusContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfile } from '../context/ProfileContext';

const Home = () => {
  const router = useRouter();

  const [status, setStatus] = useState("View Current Royale");
  const [isClockedIn, setIsClockedIn] = useState(false);

  const { resetSession } = useTaskStatus();
  const { tasks } = useTasks();
  const { currentBracket, totalPoints, isDarkMode, setIsFriendRoyale } = useProfile();

  const playersLeft = currentBracket.length === 0 ? 10 : currentBracket.length + 1;

  // Mock data for announcements
  const announcements = [
    { id: 1, title: 'Season 1 Begins!', body: 'First set of challenges and rewards are now live.', icon: 'trophy' },
  ];

  const handleClockIn = () => {
    if (tasks.length === 0) {
      Alert.alert(
        "Routine Empty!",
        "You need to add at least one task to your routine before you can begin a bracket.",
        [{ text: "Edit Task List", onPress: () => router.push('/task_list') }, { text: "OK" }]
      );
      return;
    }
    // setStatus("Loading...");
    setIsFriendRoyale(false);
    router.push('/matchmaking');
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Portal Card */}
        <View style={[styles.portalCard, isDarkMode && styles.portalCardDark]}>
          <Text style={styles.portalHeadline}>Ready to start your routine?</Text>

          <TouchableOpacity
            style={[
              styles.clockBtn,
              isClockedIn && styles.clockBtnSuccess,
              tasks.length === 0 && { opacity: 0.6 }
            ]}
            onPress={handleClockIn}
            disabled={isClockedIn}
          >
            <Ionicons name={isClockedIn ? "checkmark-circle" : "play"} size={24} color="white" />
            <Text style={styles.btnText}>{status}</Text>
          </TouchableOpacity>

          <View style={[styles.statusBadge, isDarkMode && styles.statusBadgeDark]}>
            <Text style={[styles.statusText, isDarkMode && styles.statusTextDark]}>
              {playersLeft}/10 Players Left This Royale!
            </Text>
          </View>
        </View>

        {/* --- NEW SECTION START --- */}
        <View style={styles.dividerContainer}>
          <View style={[styles.line, isDarkMode && styles.lineDark]} />
          <Text style={[styles.dividerText, isDarkMode && styles.dividerTextDark]}>YOUR ROUTINE</Text>
          <View style={[styles.line, isDarkMode && styles.lineDark]} />
        </View>

        <TouchableOpacity
          style={[styles.taskEditBtn, isDarkMode && styles.taskEditBtnDark]}
          onPress={() => router.push('/task_list')}
        >
          <View style={styles.taskEditIconBg}>
            <Ionicons name="list" size={20} color="white" />
          </View>
          <Text style={styles.taskEditBtnText}>Edit Task List</Text>
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? "#64748b" : "#94a3b8"} />
        </TouchableOpacity>

        {/* Divider Section */}
        <View style={styles.dividerContainer}>
          <View style={[styles.line, isDarkMode && styles.lineDark]} />
          <Text style={[styles.dividerText, isDarkMode && styles.dividerTextDark]}>ANNOUNCEMENTS</Text>
          <View style={[styles.line, isDarkMode && styles.lineDark]} />
        </View>

        {/* Announcements List */}
        {announcements.map((item) => (
          <View key={item.id} style={[styles.announcementCard, isDarkMode && styles.announcementCardDark]}>
            <View style={[styles.announcementIconBg, isDarkMode && styles.announcementIconBgDark]}>
              <Ionicons name={item.icon as any} size={20} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
            </View>
            <View style={styles.announcementContent}>
              <Text style={[styles.announcementTitle, isDarkMode && styles.announcementTitleDark]}>{item.title}</Text>
              <Text style={[styles.announcementBody, isDarkMode && styles.announcementBodyDark]}>{item.body}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
  scrollContainer: { padding: 20, alignItems: 'center' },

  // Portal Card Styles
  portalCard: {
    width: '100%',
    backgroundColor: '#1e40af',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginTop: 20
  },
  portalCardDark: { backgroundColor: '#1e293b' },
  portalHeadline: { color: 'white', fontSize: 20, marginBottom: 30, fontWeight: '600' },
  clockBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center'
  },
  clockBtnSuccess: { backgroundColor: '#10b981' },
  btnText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  statusBadge: { marginTop: 30, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 10 },
  statusBadgeDark: { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  statusText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  statusTextDark: { color: '#38bdf8' },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  lineDark: { backgroundColor: '#334155' },
  dividerText: {
    marginHorizontal: 15,
    color: '#94a3b8',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontSize: 11
  },
  dividerTextDark: { color: '#64748b' },

  // New Task Edit Button Styles
  taskEditBtn: {
    flexDirection: 'row',
    backgroundColor: '#2b4fc7',
    width: '100%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  taskEditBtnDark: { backgroundColor: '#1e293b' },
  taskEditIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#3b82f6', // Matches your theme's primary blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskEditBtnText: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },

  // Announcement Card Styles
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  announcementCardDark: { backgroundColor: '#1e293b' },
  announcementIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  announcementIconBgDark: { backgroundColor: '#334155' },
  announcementContent: { flex: 1 },
  announcementTitle: { fontWeight: 'bold', color: '#1e293b', fontSize: 15 },
  announcementTitleDark: { color: '#f8fafc' },
  announcementBody: { color: '#64748b', fontSize: 13, marginTop: 2 },
  announcementBodyDark: { color: '#94a3b8' },
});

export default Home;