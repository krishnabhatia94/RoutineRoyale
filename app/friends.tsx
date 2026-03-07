import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Friends = () => {
  // Mock data for the leaderboard
  const friends = [
    { id: 1, name: 'Alex Rivers', points: 2450, status: 'Completed Morning Yoga', rank: 1 },
    { id: 2, name: 'Sam Chen', points: 2100, status: 'On a 5-day streak!', rank: 2 },
    { id: 3, name: 'Jordan Smith', points: 1850, status: 'Just clocked in', rank: 3 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Weekly Leaderboard Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.leaderboardCard}>
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{friend.rank}</Text>
              </View>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={20} color="#1e40af" />
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendStatus}>{friend.status}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{friend.points}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add Friends Call to Action */}
        <TouchableOpacity style={styles.addFriendsBtn}>
          <Ionicons name="person-add" size={20} color="white" />
          <Text style={styles.addFriendsText}>Find More Rivals</Text>
        </TouchableOpacity>

        {/* Activity Feed */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityItem}>
          <Ionicons name="megaphone-outline" size={24} color="#3b82f6" />
          <Text style={styles.activityText}>
            <Text style={{ fontWeight: 'bold' }}>Sam Chen</Text> just earned the "Early Bird" badge!
          </Text>
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
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15,
    width: '100%'
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e40af' },
  seeAll: { color: '#3b82f6', fontWeight: '600' },
  
  // Leaderboard Styles
  leaderboardCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rankBadge: {
    width: 25,
    alignItems: 'center',
  },
  rankText: { fontWeight: 'bold', color: '#64748b' },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  friendInfo: { flex: 1 },
  friendName: { fontWeight: 'bold', color: '#1e293b', fontSize: 15 },
  friendStatus: { color: '#64748b', fontSize: 12, marginTop: 2 },
  pointsContainer: { alignItems: 'flex-end' },
  pointsText: { fontWeight: 'bold', color: '#1e40af', fontSize: 16 },
  pointsLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' },

  // Buttons & Feed
  addFriendsBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  addFriendsText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  activityText: { marginLeft: 12, color: '#1e40af', fontSize: 14, flex: 1 },
});

export default Friends;