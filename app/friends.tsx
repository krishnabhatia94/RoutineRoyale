import { useProfile, getCompetitorFromDB, getDeterministicIndex } from '@/context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Friends = () => {
  const router = useRouter();
  const { isDarkMode, setIsFriendRoyale, friendIDs } = useProfile();

  // Populate dynamic friends list from friendIDs
  const dynamicFriends = friendIDs.map((id, index) => {
    const competitor = getCompetitorFromDB(id);
    // Generate some deterministic mock points
    const points = 1000 + (getDeterministicIndex(id, 20) * 100);
    return {
      id: id,
      name: competitor.name,
      points: points,
      status: index === 0 ? 'Completed Morning Yoga' : 'Just finished a workout!',
      rank: index + 1 // Sort them by index for now
    };
  }).sort((a, b) => b.points - a.points).map((f, i) => ({ ...f, rank: i + 1 }));

  const handleStartFriendsRoyale = () => {
    setIsFriendRoyale(true);
    router.push('/matchmaking');
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Friends Royale Portal Card */}
        <View style={[styles.portalCard, isDarkMode && styles.portalCardDark]}>
          <Text style={styles.portalHeadline}>Ready for a Friends Royale?</Text>
          <TouchableOpacity
            style={styles.clockBtn}
            onPress={handleStartFriendsRoyale}
          >
            <Ionicons name="people" size={24} color="white" />
            <Text style={styles.btnText}>Start Friends Royale</Text>
          </TouchableOpacity>
          <View style={[styles.statusBadge, isDarkMode && styles.statusBadgeDark]}>
            <Text style={[styles.statusText, isDarkMode && styles.statusTextDark]}>
              Compete with your top {friendIDs.length} friends!
            </Text>
          </View>
        </View>

        {/* Weekly Leaderboard Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Weekly Leaderboard</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, isDarkMode && styles.seeAllDark]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.leaderboardCard, isDarkMode && styles.leaderboardCardDark]}>
          {dynamicFriends.map((friend) => (
            <View key={friend.id} style={[styles.friendRow, isDarkMode && styles.friendRowDark]}>
              <View style={styles.rankBadge}>
                <Text style={[styles.rankText, isDarkMode && styles.rankTextDark]}>{friend.rank}</Text>
              </View>
              <View style={[styles.avatarPlaceholder, isDarkMode && styles.avatarPlaceholderDark]}>
                <Ionicons name="person" size={20} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
              </View>
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, isDarkMode && styles.friendNameDark]}>{friend.name}</Text>
                <Text style={[styles.friendStatus, isDarkMode && styles.friendStatusDark]}>{friend.status}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={[styles.pointsText, isDarkMode && styles.pointsTextDark]}>{friend.points.toLocaleString()}</Text>
                <Text style={[styles.pointsLabel, isDarkMode && styles.pointsLabelDark]}>pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add Friends Call to Action */}
        <TouchableOpacity style={[styles.addFriendsBtn, isDarkMode && styles.addFriendsBtnDark]}>
          <Ionicons name="person-add" size={20} color="white" />
          <Text style={styles.addFriendsText}>Find More Rivals</Text>
        </TouchableOpacity>

        {/* Activity Feed */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Recent Activity</Text>
        </View>

        <View style={[styles.activityItem, isDarkMode && styles.activityItemDark]}>
          <Ionicons name="megaphone-outline" size={24} color={isDarkMode ? "#38bdf8" : "#3b82f6"} />
          <Text style={[styles.activityText, isDarkMode && styles.activityTextDark]}>
            <Text style={{ fontWeight: 'bold' }}>Sam Chen</Text> just earned the "Early Bird" badge!
          </Text>
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
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15,
    width: '100%'
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e40af' },
  sectionTitleDark: { color: '#38bdf8' },
  seeAll: { color: '#3b82f6', fontWeight: '600' },
  seeAllDark: { color: '#38bdf8' },
  
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
  leaderboardCardDark: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0.2,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  friendRowDark: {
    borderBottomColor: '#334155',
  },
  rankBadge: {
    width: 25,
    alignItems: 'center',
  },
  rankText: { fontWeight: 'bold', color: '#64748b' },
  rankTextDark: { color: '#94a3b8' },
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
  friendInfo: { flex: 1 },
  friendName: { fontWeight: 'bold', color: '#1e293b', fontSize: 15 },
  friendNameDark: { color: '#f8fafc' },
  friendStatus: { color: '#64748b', fontSize: 12, marginTop: 2 },
  friendStatusDark: { color: '#94a3b8' },
  pointsContainer: { alignItems: 'flex-end' },
  pointsText: { fontWeight: 'bold', color: '#1e40af', fontSize: 16 },
  pointsTextDark: { color: '#38bdf8' },
  pointsLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' },
  pointsLabelDark: { color: '#64748b' },

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
  addFriendsBtnDark: {
    backgroundColor: '#1d4ed8',
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
  activityItemDark: {
    backgroundColor: '#1e293b',
  },
  activityText: { marginLeft: 12, color: '#1e40af', fontSize: 14, flex: 1 },
  activityTextDark: { color: '#38bdf8' },
  
  // Portal Card Styles (from Home.tsx)
  portalCard: {
    width: '100%',
    backgroundColor: '#1e40af',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  portalCardDark: { backgroundColor: '#1e293b' },
  portalHeadline: { color: 'white', fontSize: 20, marginBottom: 30, fontWeight: '600', textAlign: 'center' },
  clockBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center'
  },
  btnText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  statusBadge: { marginTop: 30, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 10 },
  statusBadgeDark: { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  statusText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  statusTextDark: { color: '#38bdf8' },
});

export default Friends;