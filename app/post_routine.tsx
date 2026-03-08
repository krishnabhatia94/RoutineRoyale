import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePoints } from '../context/PointsContext'; // Import Points
import { useTaskStatus } from '../context/TaskStatusContext';

const Post_Routine = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { elapsedSeconds, formatTime } = useTaskStatus();
  const { lastPointsGained, addPoints } = usePoints();

  // Generate randomized competitors once per mount
  const leaderboard = React.useMemo(() => {
    const competitors = [
      { id: 1, name: 'Alex', icon: 'flash' },
      { id: 2, name: 'Jordan', icon: 'barbell' },
      { id: 3, name: 'Taylor', icon: 'water' },
      { id: 4, name: 'Casey', icon: 'body' },
      { id: 5, name: 'Morgan', icon: 'cafe' },
      { id: 6, name: 'Riley', icon: 'leaf' },
      { id: 7, name: 'Jamie', icon: 'bicycle' },
      { id: 8, name: 'Skylar', icon: 'walk' },
      { id: 9, name: 'Charlie', icon: 'heart' },
    ].map(c => {
      // +/- 1.8 minutes (108 seconds)
      const variance = (Math.random() * 216) - 108;
      let calculatedTime = Math.floor(elapsedSeconds + variance);
      
      // If time hits 0 or less, re-roll between 1s and user's time
      if (calculatedTime <= 0) {
        calculatedTime = Math.floor(Math.random() * Math.max(1, elapsedSeconds)) + 1;
      }

      return {
        ...c,
        time: calculatedTime,
        isUser: false
      };
    });

    const user = { id: 0, name: 'You', icon: 'person', time: elapsedSeconds, isUser: true };
    return [...competitors, user].sort((a, b) => a.time - b.time);
  }, [elapsedSeconds]);

  const userRank = leaderboard.findIndex(p => p.isUser) + 1;

  // Award points based on placement exactly once
  const pointsAwarded = useRef(false);
  useEffect(() => {
    if (!pointsAwarded.current && userRank > 0) {
      // Formula: ((11 - place) + 2) * 2
      const pointsGained = ((11 - userRank) + 2) * 2;
      addPoints(pointsGained);
      pointsAwarded.current = true;
    }
  }, [userRank, addPoints]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.statText}>You Placed #{userRank} today</Text>
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

          {/* Leaderboard Summary */}
          <View style={styles.leaderboardSection}>
            <Text style={styles.sectionTitle}>LEADERBOARD SUMMARY</Text>
            <View style={styles.leaderboardCard}>
              {leaderboard.map((player, index) => (
                <View key={player.id} style={[styles.rankRow, player.isUser && styles.userRankRow]}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                  <Ionicons name={player.icon as any} size={16} color={player.isUser ? "#3b82f6" : "#64748b"} style={{ marginHorizontal: 10 }} />
                  <Text style={[styles.rankName, player.isUser && styles.userRankName]}>{player.name}</Text>
                  <Text style={styles.rankTime}>{formatTime(player.time)}</Text>
                </View>
              ))}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 24 },
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

  footer: { marginTop: 30 },
  homeBtn: {
    backgroundColor: '#3b82f6', padding: 18, borderRadius: 16, alignItems: 'center',
  },
  homeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 17 },

  leaderboardSection: { marginTop: 30 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 15 },
  leaderboardCard: { backgroundColor: 'white', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12 },
  userRankRow: { backgroundColor: '#eff6ff' },
  rankNumber: { width: 25, fontSize: 14, fontWeight: 'bold', color: '#94a3b8', textAlign: 'center' },
  rankName: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '600' },
  userRankName: { color: '#3b82f6', fontWeight: 'bold' },
  rankTime: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  rankDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 5, marginHorizontal: 10 },
});

export default Post_Routine;