import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Leaderboards = () => {
  const friends = [
    { id: '1', name: 'Piyush Mehta', points: 2840, rank: 1, trend: 'up' },
    { id: '2', name: 'Alex Rivers', points: 2450, rank: 2, trend: 'down' },
    { id: '3', name: 'Jordan Smith', points: 1850, rank: 3, trend: 'stable' },
  ];

  const global = [
    { id: 'g1', name: 'RoutineMaster99', points: 15420, rank: 1 },
    { id: 'g2', name: 'ZenWarrior', points: 12100, rank: 2 },
    { id: 'g3', name: 'FocusFlow', points: 11850, rank: 3 },
    { id: 'g4', name: 'HabitHero', points: 9400, rank: 4 },
    { id: 'g5', name: 'SteadyEddie', points: 8200, rank: 5 },
  ];

  const renderRow = (item: { id: any; name: any; points: any; rank: any; trend?: any; }, isGlobal = false) => (
    <View key={item.id} style={styles.row}>
      <View style={styles.rankContainer}>
        {isGlobal && item.rank <= 3 ? (
          <Ionicons 
            name="trophy" 
            size={18} 
            color={item.rank === 1 ? "#fbbf24" : item.rank === 2 ? "#94a3b8" : "#92400e"} 
          />
        ) : (
          <Text style={styles.rankText}>{item.rank}</Text>
        )}
      </View>
      
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.nameText}>{item.name}</Text>
        {!isGlobal && (
          <Text style={styles.trendText}>
            {item.trend === 'up' ? '🔥 Climbing' : '😴 Resting'}
          </Text>
        )}
      </View>

      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{item.points.toLocaleString()}</Text>
        <Text style={styles.ptsLabel}>pts</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Friends Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={20} color="#1e40af" />
          <Text style={styles.sectionTitle}>Friends League</Text>
        </View>
        <View style={styles.card}>
          {friends.map(f => renderRow(f))}
        </View>

        {/* Global Section */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Ionicons name="earth" size={20} color="#1e40af" />
          <Text style={styles.sectionTitle}>Global Champions</Text>
        </View>
        <View style={styles.card}>
          {global.map(g => renderRow(g, true))}
          <TouchableOpacity style={styles.loadMore}>
            <Text style={styles.loadMoreText}>View Full Rankings</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20 },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    gap: 8 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e40af' },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rankContainer: { width: 30, alignItems: 'center' },
  rankText: { fontWeight: 'bold', color: '#64748b', fontSize: 14 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  info: { flex: 1 },
  nameText: { fontWeight: '600', color: '#1e293b', fontSize: 15 },
  trendText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  pointsContainer: { alignItems: 'flex-end' },
  pointsText: { fontWeight: 'bold', color: '#1e40af', fontSize: 15 },
  ptsLabel: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' },
  loadMore: {
    padding: 15,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 13,
  }
});

export default Leaderboards;