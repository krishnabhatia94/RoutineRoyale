import {
  getDeterministicVariance,
  parseLengthToSeconds,
  formatSeconds,
  useProfile,
  getCompetitorFromDB,
  getRandomCompetitors
} from '@/context/ProfileContext';
import { useTasks } from '@/context/TaskListContext';
import { useTaskStatus } from '@/context/TaskStatusContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Avatar from '../components/Avatar';

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const generateParticipantsFromBracket = (userTime: number, bracketIds: string[]) => {
  return bracketIds.map((id) => {
    const competitor = getCompetitorFromDB(id);
    
    // Variance is +/- 15% of user time, deterministic by ID
    const varianceMultiplier = getDeterministicVariance(id);
    const matchedTime = Math.max(60, Math.floor(userTime * (1 + varianceMultiplier)));

    return {
      id: id,
      name: competitor.name,
      icon: competitor.icon,
      totalSeconds: matchedTime,
      isUser: false,
    };
  });
};

const Matchmaking = () => {
  const router = useRouter();
  const { tasks } = useTasks();
  const [searching, setSearching] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const { resetSession } = useTaskStatus();

  const { currentBracket, setBracket, isDarkMode, isFriendRoyale, friendIDs, customAvatar } = useProfile();
  const hasSimulated = useRef(false);

  const userTotalSeconds = useMemo(() => {
    return tasks.reduce((acc, task) => acc + parseLengthToSeconds(task.length), 0);
  }, [tasks]);

  // Animation values
  const pulse = useSharedValue(0);
  const rotation = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      // Reset simulation state on focus
      setSearching(true);
      setMatches([]);
      hasSimulated.current = false;

      pulse.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      rotation.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );

      // Simulate matchmaking
      const timer = setTimeout(() => {
        let activeBracketIds = isFriendRoyale ? [...friendIDs] : [...currentBracket];

        // If bracket is empty and NOT a friends royale, generate 9 new random IDs from DB
        if (!isFriendRoyale && activeBracketIds.length === 0) {
          const newIds = getRandomCompetitors(9);
          setBracket(newIds);
          activeBracketIds = newIds;
        }

        const generated = generateParticipantsFromBracket(userTotalSeconds, activeBracketIds);
        const user = {
          id: 'user-0',
          name: 'You',
          icon: 'person',
          totalSeconds: userTotalSeconds,
          isUser: true,
        };
        
        const allCompetitors = [user, ...generated].sort((a, b) => a.totalSeconds - b.totalSeconds);
        setMatches(allCompetitors);
        setSearching(false);
        hasSimulated.current = true;
      }, 4000);

      return () => clearTimeout(timer);
    }, [userTotalSeconds, currentBracket, isFriendRoyale, friendIDs])
  );

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.8, 2.5]) }],
    opacity: interpolate(pulse.value, [0, 1], [0.6, 0]),
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  if (searching) {
    return (
      <SafeAreaView style={styles.searchingContainer}>
        <View style={styles.radarContainer}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <Animated.View style={[styles.pulseCircle, { ...pulseStyle }, { transitionDelay: '500ms' } as any]} />

          <View style={styles.centerIcon}>
            <Ionicons name="search" size={40} color="white" />
          </View>

          <Animated.View style={[styles.scannerLine, rotateStyle]} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.searchingTitle}>
            {isFriendRoyale ? "Loading Friend's Profiles..." : "Assembling Your Royale..."}
          </Text>
          <Text style={styles.searchingSubtitle}>
            {isFriendRoyale 
              ? "Preparing your friend-only bracket"
              : (currentBracket.length === 0 || currentBracket.length === 9 
                ? "Finding 9 survivors remaining in your bracket" 
                : "Loading competitor profiles...")}
          </Text>
          <Text style={styles.timeTag}>Your Total: {formatSeconds(userTotalSeconds)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Match Found!</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.matchCard}>
          <View style={styles.matchBadge}>
            <Ionicons name="people" size={18} color="white" />
            <Text style={styles.matchBadgeText}>{matches.length} SURVIVORS REMAINING</Text>
          </View>
          <Text style={styles.matchHeadline}>The bracket is locked.</Text>
          <Text style={styles.matchSubline}>You compete against these {matches.length - 1} survivors for the win.</Text>
        </View>

        {matches.map((player, index) => (
          <View key={player.id} style={[
            styles.playerRow, 
            isDarkMode && styles.playerRowDark,
            player.isUser && styles.userRow,
            player.isUser && isDarkMode && styles.userRowDark
          ]}>
            <View style={styles.rankContainer}>
              <Text style={[styles.rankText, player.isUser && styles.userRankText, isDarkMode && styles.rankTextDark]}>{index + 1}</Text>
            </View>

            <View style={[styles.playerIconCircle, isDarkMode && styles.playerIconCircleDark, player.isUser && styles.userIconCircle, player.isUser && isDarkMode && styles.userIconCircleDark]}>
              {player.isUser ? (
                <Avatar customAvatar={customAvatar} size={24} isDarkMode={isDarkMode} />
              ) : (
                <Ionicons name={player.icon} size={20} color={(isDarkMode ? '#94a3b8' : '#64748b')} />
              )}
            </View>

            <View style={styles.playerNameContainer}>
              <Text style={[styles.playerName, isDarkMode && styles.playerNameDark, player.isUser && styles.userPlayerName, player.isUser && isDarkMode && styles.userPlayerNameDark]}>
                {player.name} {player.isUser && '(You)'}
              </Text>
              <Text style={[styles.playerTime, isDarkMode && styles.playerTimeDark]}>{formatSeconds(player.totalSeconds)} routine</Text>
            </View>

            {player.isUser && (
              <View style={styles.youIndicator}>
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => {
            resetSession();
            router.push('/routine_active')
          }}
        >
          <Text style={styles.startBtnText}>Enter the Royale</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchingContainer: {
    flex: 1,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scannerLine: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderLeftWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.8)',
  },
  textContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  searchingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  timeTag: {
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Results styles
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerDark: {
    backgroundColor: '#1e293b',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  headerTitleDark: {
    color: '#38bdf8',
  },
  scrollContent: {
    padding: 20,
  },
  matchCard: {
    backgroundColor: '#1E40AF',
    borderRadius: 24,
    padding: 25,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  matchBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 1,
  },
  matchHeadline: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchSubline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  playerRowDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  userRow: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  userRowDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#38bdf8',
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  rankTextDark: {
    color: '#64748b',
  },
  userRankText: {
    color: '#3b82f6',
  },
  playerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  playerIconCircleDark: {
    backgroundColor: '#0f172a',
  },
  userIconCircle: {
    backgroundColor: 'white',
  },
  userIconCircleDark: {
    backgroundColor: '#1e293b',
  },
  playerNameContainer: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  playerNameDark: {
    color: '#f8fafc',
  },
  userPlayerName: {
    color: '#3b82f6',
  },
  userPlayerNameDark: {
    color: '#38bdf8',
  },
  playerTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  playerTimeDark: {
    color: '#94a3b8',
  },
  youIndicator: {
    paddingLeft: 10,
  },
  startBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 40,
    elevation: 4,
  },
  startBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Matchmaking;
