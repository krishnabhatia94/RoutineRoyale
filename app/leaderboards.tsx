import { useProfile, getCompetitorFromDB, getDeterministicIndex } from '@/context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Leaderboards = () => {
  const { isDarkMode, friendIDs, name, userId, totalPoints } = useProfile();

  // Generate friends data based on deterministic index for consistent point values to match friends.tsx
  const friendsData = friendIDs.map(id => {
    const comp = getCompetitorFromDB(id);
    const pts = 1000 + (getDeterministicIndex(id, 20) * 100);
    return {
      id: comp.id,
      name: comp.name,
      points: pts,
      trend: (pts % 3 === 0 ? 'stable' : pts % 2 === 0 ? 'up' : 'down') as 'up' | 'down' | 'stable'
    };
  });

  // Add current user
  const currentUserEntry = {
    id: userId || 'current-user',
    name: name || 'You',
    points: totalPoints,
    trend: 'up' as 'up' | 'down' | 'stable'
  };
  
  const allFriends = [...friendsData, currentUserEntry]
    .sort((a, b) => b.points - a.points)
    .map((f, index) => ({ ...f, rank: index + 1 }));

  const global = [
    { id: 'g1', name: 'RoutineMaster99', points: 15420, rank: 1 },
    { id: 'g2', name: 'ZenWarrior', points: 12100, rank: 2 },
    { id: 'g3', name: 'FocusFlow', points: 11850, rank: 3 },
    { id: 'g4', name: 'HabitHero', points: 9400, rank: 4 },
    { id: 'g5', name: 'SteadyEddie', points: 8200, rank: 5 },
  ];

  const renderRow = (item: { id: any; name: any; points: any; rank: any; trend?: any; }, isGlobal = false) => (
    <View key={item.id} style={[styles.row, isDarkMode && styles.rowDark]}>
      <View style={styles.rankContainer}>
        {isGlobal && item.rank <= 3 ? (
          <Ionicons 
            name="trophy" 
            size={18} 
            color={item.rank === 1 ? "#fbbf24" : item.rank === 2 ? (isDarkMode ? "#94a3b8" : "#94a3b8") : "#92400e"} 
          />
        ) : (
          <Text style={[styles.rankText, isDarkMode && styles.rankTextDark]}>{item.rank}</Text>
        )}
      </View>
      
      <View style={[!isGlobal ? styles.avatarPlaceholder : styles.avatar, isDarkMode && (!isGlobal ? styles.avatarPlaceholderDark : styles.avatarDark)]}>
        {!isGlobal ? (
          <Ionicons name="person" size={20} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
        ) : (
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.nameText, isDarkMode && styles.nameTextDark]}>{item.name}</Text>
        {!isGlobal && (
          <Text style={[styles.trendText, isDarkMode && styles.trendTextDark]}>
            {item.trend === 'up' ? '🔥 Climbing' : '😴 Resting'}
          </Text>
        )}
      </View>

      <View style={styles.pointsContainer}>
        <Text style={[styles.pointsText, isDarkMode && styles.pointsTextDark]}>{item.points.toLocaleString()}</Text>
        <Text style={[styles.ptsLabel, isDarkMode && styles.ptsLabelDark]}>pts</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Friends Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={20} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Friends League</Text>
        </View>
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          {allFriends.map(f => renderRow(f))}
        </View>

        {/* Global Section */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Ionicons name="earth" size={20} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Global Champions</Text>
        </View>
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          {global.map(g => renderRow(g, true))}
          <TouchableOpacity style={styles.loadMore}>
            <Text style={[styles.loadMoreText, isDarkMode && styles.loadMoreTextDark]}>View Full Rankings</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
  scrollContainer: { padding: 20 },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    gap: 8 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e40af' },
  sectionTitleDark: { color: '#38bdf8' },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardDark: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowDark: {
    borderBottomColor: '#334155',
  },
  rankContainer: { width: 30, alignItems: 'center' },
  rankText: { fontWeight: 'bold', color: '#64748b', fontSize: 14 },
  rankTextDark: { color: '#94a3b8' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  avatarDark: {
    backgroundColor: '#38bdf8',
  },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  avatarPlaceholderDark: {
    backgroundColor: '#0f172a',
  },
  info: { flex: 1 },
  nameText: { fontWeight: '600', color: '#1e293b', fontSize: 15 },
  nameTextDark: { color: '#f8fafc' },
  trendText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  trendTextDark: { color: '#94a3b8' },
  pointsContainer: { alignItems: 'flex-end' },
  pointsText: { fontWeight: 'bold', color: '#1e40af', fontSize: 15 },
  pointsTextDark: { color: '#38bdf8' },
  ptsLabel: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' },
  ptsLabelDark: { color: '#64748b' },
  loadMore: {
    padding: 15,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 13,
  },
  loadMoreTextDark: { color: '#38bdf8' },
});

export default Leaderboards;