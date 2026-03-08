import { useTaskStatus } from '@/context/TaskStatusContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = () => {
  const router = useRouter();
  
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("Clock In");
  const [isClockedIn, setIsClockedIn] = useState(false);

  const { resetSession } = useTaskStatus();

  // Mock data for announcements
  const announcements = [
    { id: 1, title: 'Season 1 Begins!', body: 'First set of challenges and rewards are now live.', icon: 'trophy' },
    { id: 2, title: 'Double Points Weekend', body: 'Earn 2x points on all morning routines.', icon: 'flash' }
  ];

  const handleClockIn = () => {
    // setStatus("Loading...");
    resetSession();
    router.push('/routine_active');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Portal Card */}
        <View style={styles.portalCard}>
          <Text style={styles.portalHeadline}>Ready to start your routine?</Text>
          
          <TouchableOpacity 
            style={[styles.clockBtn, isClockedIn && styles.clockBtnSuccess]} 
            onPress={handleClockIn}
            disabled={isClockedIn}
          >
            <Ionicons name={isClockedIn ? "checkmark-circle" : "play"} size={24} color="white" />
            <Text style={styles.btnText}>{status}</Text>
          </TouchableOpacity>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              6/10 Players Left This Month!
            </Text>
          </View>
        </View>

        {/* --- NEW SECTION START --- */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>YOUR ROUTINE</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          style={styles.taskEditBtn}
          onPress={() => router.push('/task_list')}
        >
          <View style={styles.taskEditIconBg}>
            <Ionicons name="list" size={20} color="white" />
          </View>
          <Text style={styles.taskEditBtnText}>Edit Task List</Text>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>

        {/* Divider Section */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ANNOUNCEMENTS</Text>
          <View style={styles.line} />
        </View>

        {/* Announcements List */}
        {announcements.map((item) => (
          <View key={item.id} style={styles.announcementCard}>
            <View style={styles.announcementIconBg}>
              <Ionicons name={item.icon as any} size={20} color="#1e40af" />
            </View>
            <View style={styles.announcementContent}>
              <Text style={styles.announcementTitle}>{item.title}</Text>
              <Text style={styles.announcementBody}>{item.body}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
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
  statusText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { 
    marginHorizontal: 15, 
    color: '#94a3b8', 
    fontWeight: 'bold', 
    letterSpacing: 1.5, 
    fontSize: 11 
  },

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
  announcementIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  announcementContent: { flex: 1 },
  announcementTitle: { fontWeight: 'bold', color: '#1e293b', fontSize: 15 },
  announcementBody: { color: '#64748b', fontSize: 13, marginTop: 2 },
});

export default Home;