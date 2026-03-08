import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Avatar from '../components/Avatar';
import React, { useEffect, useRef } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile, MOCK_NAMES, MOCK_ICONS, getDeterministicIndex, getDeterministicVariance, parseLengthToSeconds, getCompetitorFromDB } from '../context/ProfileContext';
import { useTaskStatus } from '../context/TaskStatusContext';
import { useTasks } from '../context/TaskListContext';

const Post_Routine = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { elapsedSeconds, formatTime, completedTaskIds, isActive } = useTaskStatus();
  const { lastPointsGained, addPoints, incrementChallengesWon, activeQuest, currentBracket, eliminateFromBracket, setBracket, isDarkMode, isFriendRoyale, friendIDs, customAvatar } = useProfile();
  const { tasks } = useTasks();

  const parTime = React.useMemo(() => {
    return tasks.reduce((acc, task) => acc + parseLengthToSeconds(task.length), 0);
  }, [tasks]);

  const leaderboard = React.useMemo(() => {
    // Return empty if we don't have enough data to generate yet
    if (!isActive && elapsedSeconds > 0) {
      // Use friendIDs if in Friends Royale mode, otherwise currentBracket
      const activeBracketIds = isFriendRoyale ? friendIDs : currentBracket;
      
      const competitors = activeBracketIds.map((id) => {
        const competitor = getCompetitorFromDB(id);
        
        // Deterministic variance based on ID - +/- 108 seconds centered around user
        const variance = (getDeterministicVariance(id) / 0.15) * 108;
        let calculatedTime = Math.floor(elapsedSeconds + variance);
        
        if (calculatedTime <= 0) {
          calculatedTime = Math.floor(Math.random() * Math.max(1, elapsedSeconds)) + 1;
        }

        return { 
          id, 
          name: competitor.name, 
          icon: competitor.icon, 
          time: calculatedTime, 
          isUser: false 
        };
      });

      const user = { id: 'user-0', name: 'You', icon: 'person', time: elapsedSeconds, isUser: true };
      return [...competitors, user].sort((a, b) => a.time - b.time);
    }
    
    // Fallback if routine hasn't finished
    return [{ id: 'user-0', name: 'You', icon: 'person', time: elapsedSeconds, isUser: true }];
  }, [elapsedSeconds, isActive, currentBracket, parTime, isFriendRoyale, friendIDs]);

  const userRank = leaderboard.findIndex(p => p.isUser) + 1;

  // Award points based on placement exactly once per session
  const pointsAwarded = useRef(false);

  // Reset award flag if user starts a new session (detected via 0 elapsed time)
  useEffect(() => {
    if (elapsedSeconds === 0) {
      pointsAwarded.current = false;
    }
  }, [elapsedSeconds]);

  const placementPoints = ((11 - userRank) + 2) * 2;
  const questCompleted = activeQuest && completedTaskIds.includes(-activeQuest.id);
  const questPoints = questCompleted ? activeQuest.points : 0;

  useEffect(() => {
    // ONLY award points if:
    // 1. Not already awarded
    // 2. We have a rank (leaderboard loaded)
    // 3. The routine is FINISHED (isActive is false)
    // 4. We actually did something (elapsedSeconds > 0)
    if (!pointsAwarded.current && userRank > 0 && !isActive && elapsedSeconds > 0) {
      const totalGained = placementPoints + questPoints;
      addPoints(totalGained);
      if (userRank === 1 && !isFriendRoyale) {
        incrementChallengesWon();
      }
      pointsAwarded.current = true;
    }
  }, [userRank, isActive, elapsedSeconds, placementPoints, questPoints, addPoints, incrementChallengesWon]);

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* Celebration Header */}
          <View style={styles.headerSection}>
            <View style={[styles.trophyCircle, isDarkMode && styles.trophyCircleDark]}>
              <Ionicons name="trophy" size={64} color={isDarkMode ? "#38bdf8" : "#fbbf24"} />
            </View>
            <Text style={[styles.congratsText, isDarkMode && styles.congratsTextDark]}>Routine Complete!</Text>
            <Text style={[styles.finishTimeText, isDarkMode && styles.finishTimeTextDark]}>
              You finished your routine in {formatTime(elapsedSeconds)}!
            </Text>
          </View>

          {/* Stats Rows */}
          <View style={[styles.statsCard, isDarkMode && styles.statsCardDark]}>
            <View style={styles.statRow}>
              <Ionicons name="podium-outline" size={24} color={isDarkMode ? "#38bdf8" : "#3b82f6"} />
              <Text style={[styles.statText, isDarkMode && styles.statTextDark]}>You Placed #{userRank} today</Text>
            </View>



            {/* Stats Card Improvements */}
            <View style={[styles.statRow, styles.statRowBorder, isDarkMode && styles.statRowBorderDark]}>
              <Ionicons name="medal-outline" size={24} color={isDarkMode ? "#38bdf8" : "#3b82f6"} />
              <Text style={[styles.statText, isDarkMode && styles.statTextDark]}>Placement Reward: +{placementPoints} PTS</Text>
            </View>

            {activeQuest && (
              <View style={[styles.statRow, styles.statRowBorder, isDarkMode && styles.statRowBorderDark]}>
                <Ionicons 
                  name={questCompleted ? "gift" : "gift-outline"} 
                  size={24} 
                  color={questCompleted ? (isDarkMode ? "#38bdf8" : "#f59e0b") : (isDarkMode ? "#334155" : "#94a3b8")} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.statText, 
                    isDarkMode && styles.statTextDark,
                    !questCompleted && { color: isDarkMode ? '#475569' : '#94a3b8' }
                  ]}>
                    {questCompleted 
                      ? `Quest Reward: +${activeQuest.points} PTS` 
                      : "Quest Not Completed"}
                  </Text>
                  {questCompleted && <Text style={[styles.statSubtext, isDarkMode && styles.statSubtextDark]}>Quest: {activeQuest.title}</Text>}
                </View>
              </View>
            )}

            <View style={[styles.statRow, styles.statRowBorder, isDarkMode && styles.statRowBorderDark, styles.totalRow, isDarkMode && styles.totalRowDark]}>
              <Ionicons name="flash" size={24} color="#8b5cf6" />
              <Text style={styles.totalPointsText}>Total Gained: +{placementPoints + questPoints} PTS</Text>
            </View>
          </View>

          {/* Leaderboard Summary */}
          <View style={styles.leaderboardSection}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>LEADERBOARD SUMMARY</Text>
            <View style={[styles.leaderboardCard, isDarkMode && styles.leaderboardCardDark]}>
              {leaderboard.map((player, index) => {
                const isLast = index === leaderboard.length - 1;
                // ONLY strike out if:
                // 1. It's the last row
                // 2. There's more than one person (user isn't the only survivor)
                // 3. The person being crossed out is NOT the user
                // 4. NOT in Friends Royale mode
                const shouldStrike = !isFriendRoyale && isLast && leaderboard.length > 1 && !player.isUser;
                
                return (
                  <View key={player.id} style={[styles.rankRow, isDarkMode && styles.rankRowDark, player.isUser && styles.userRankRow, player.isUser && isDarkMode && styles.userRankRowDark]}>
                    <Text style={[styles.rankNumber, isDarkMode && styles.rankNumberDark]}>{index + 1}</Text>
                    {player.isUser ? (
                      <View style={{ marginHorizontal: 10 }}>
                        <Avatar customAvatar={customAvatar} size={20} isDarkMode={isDarkMode} />
                      </View>
                    ) : (
                      <Ionicons 
                        name={player.icon as any} 
                        size={16} 
                        color={(isDarkMode ? "#64748b" : "#64748b")} 
                        style={{ marginHorizontal: 10 }} 
                      />
                    )}
                    <Text style={[
                      styles.rankName, 
                      isDarkMode && styles.rankNameDark,
                      player.isUser && styles.userRankName,
                      player.isUser && isDarkMode && styles.userRankNameDark,
                      shouldStrike && styles.eliminatedPlayer
                    ]}>
                      {player.name}
                    </Text>
                    <Text style={[styles.rankTime, isDarkMode && styles.rankTimeDark, shouldStrike && styles.eliminatedPlayer]}>{formatTime(player.time)}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Navigation Button */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <TouchableOpacity
              style={[styles.homeBtn, isDarkMode && styles.homeBtnDark]}
              onPress={() => {
                if (isFriendRoyale) {
                  router.replace('/friends');
                  return;
                }

                const lastPlayer = leaderboard[leaderboard.length - 1];
                
                if (lastPlayer.isUser && leaderboard.length > 1) {
                  // User lost the Royale
                  Alert.alert(
                    "Royale Over",
                    "You Lost This Royale!",
                    [{ 
                      text: "Try Again", 
                      onPress: () => {
                        setBracket([]);
                        router.replace('/home');
                      }
                    }]
                  );
                } else {
                  // Eliminate rival if user wasn't last OR if user was only one left
                  if (!lastPlayer.isUser) {
                    eliminateFromBracket(lastPlayer.id);
                  }
                  router.replace('/home');
                }
              }}
            >
              <Text style={styles.homeBtnText}>{isFriendRoyale ? "Back to Friends" : "Back to Home"}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 24 },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  trophyCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fef3c7', justifyContent: 'center',
    alignItems: 'center', marginBottom: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  trophyCircleDark: { backgroundColor: '#1e293b' },
  congratsText: { fontSize: 28, fontWeight: '900', color: '#1e293b' },
  congratsTextDark: { color: '#f8fafc' },
  finishTimeText: { fontSize: 18, color: '#64748b', marginTop: 10, fontWeight: '600' },
  finishTimeTextDark: { color: '#94a3b8' },

  statsCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  statsCardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  statRowBorder: { borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  statRowBorderDark: { borderTopColor: '#334155' },
  statText: { marginLeft: 15, fontSize: 16, color: '#1e293b', fontWeight: 'bold' },
  statTextDark: { color: '#f8fafc' },
  statSubtext: { marginLeft: 15, fontSize: 12, color: '#64748b', fontWeight: '500' },
  statSubtextDark: { color: '#94a3b8' },
  totalRow: { backgroundColor: '#f5f3ff', marginTop: 10, borderRadius: 12, borderTopWidth: 0, paddingHorizontal: 15 },
  totalRowDark: { backgroundColor: 'rgba(139, 92, 246, 0.1)' },
  totalPointsText: { marginLeft: 15, fontSize: 18, color: '#7c3aed', fontWeight: '900' },

  footer: { marginTop: 30 },
  homeBtn: {
    backgroundColor: '#3b82f6', padding: 18, borderRadius: 16, alignItems: 'center',
  },
  homeBtnDark: { backgroundColor: '#1e40af' },
  homeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 17 },

  leaderboardSection: { marginTop: 30 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 15 },
  sectionTitleDark: { color: '#64748b' },
  leaderboardCard: { backgroundColor: 'white', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  leaderboardCardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12 },
  rankRowDark: { borderBottomColor: '#334155' },
  userRankRow: { backgroundColor: '#eff6ff' },
  userRankRowDark: { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  rankNumber: { width: 25, fontSize: 14, fontWeight: 'bold', color: '#94a3b8', textAlign: 'center' },
  rankNumberDark: { color: '#64748b' },
  rankName: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '600' },
  rankNameDark: { color: '#f8fafc' },
  userRankName: { color: '#3b82f6', fontWeight: 'bold' },
  userRankNameDark: { color: '#38bdf8' },
  rankTime: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  rankTimeDark: { color: '#94a3b8' },
  eliminatedPlayer: { textDecorationLine: 'line-through', color: '#94a3b8' },
  rankDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 5, marginHorizontal: 10 },
});

export default Post_Routine;