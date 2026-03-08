import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePoints } from '../context/PointsContext'; // Import Points
import { useTaskStatus } from '../context/TaskStatusContext';

const Post_Routine = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { elapsedSeconds, formatTime } = useTaskStatus();
  const { lastPointsGained } = usePoints(); // Get points from context

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Celebration Header */}
        <View style={styles.headerSection}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={64} color="#fbbf24" />
          </View>
          <Text style={styles.congratsText}>Routine Complete!</Text>
          <Text style={styles.finishTimeText}>
            You finished your routine in {formatTime(elapsedSeconds)}!
          </Text>
        </View>

        {/* Stats Rows */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Ionicons name="podium-outline" size={24} color="#3b82f6" />
            <Text style={styles.statText}>You Placed #4 today so far</Text>
          </View>
          
          <View style={[styles.statRow, styles.statRowBorder]}>
            <Ionicons name="flash-outline" size={24} color="#10b981" />
            <Text style={styles.statText}>Current Streak: 5 Days</Text>
          </View>

          {/* NEW Points Gained Row */}
          <View style={[styles.statRow, styles.statRowBorder]}>
            <Ionicons name="star-outline" size={24} color="#8b5cf6" />
            <Text style={styles.statText}>Points Gained: +{lastPointsGained} PTS</Text>
          </View>
        </View>

        {/* Navigation Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity 
            style={styles.homeBtn}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  trophyCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fef3c7', justifyContent: 'center',
    alignItems: 'center', marginBottom: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  congratsText: { fontSize: 28, fontWeight: '900', color: '#1e293b' },
  finishTimeText: { fontSize: 18, color: '#64748b', marginTop: 10, fontWeight: '600' },
  
  statsCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  statRowBorder: { borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  statText: { marginLeft: 15, fontSize: 16, color: '#1e293b', fontWeight: 'bold' },

  footer: { marginTop: 'auto' },
  homeBtn: {
    backgroundColor: '#3b82f6', padding: 18, borderRadius: 16, alignItems: 'center',
  },
  homeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
});

export default Post_Routine;