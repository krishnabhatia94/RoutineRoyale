import { useTasks } from '@/context/TaskListContext';
import { useTaskStatus } from '@/context/TaskStatusContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';

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

// Mock function to generate participants
const generateParticipants = (userTime: number) => {
  const names = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Jamie', 'Skylar', 'Charlie'];
  const icons = ['flash', 'barbell', 'water', 'body', 'cafe', 'leaf', 'bicycle', 'walk', 'heart'];

  return names.map((name, index) => {
    // Variance is +/- 15% of user time
    const variance = (Math.random() * 0.3 - 0.15) * userTime;
    const matchedTime = Math.max(60, Math.floor(userTime + variance));

    return {
      id: index + 100,
      name,
      icon: icons[index % icons.length],
      totalSeconds: matchedTime,
      isUser: false,
    };
  });
};

const formatSeconds = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const parseLengthToSeconds = (lengthStr: string) => {
  const num = parseInt(lengthStr.replace(/[^0-9]/g, '')) || 0;
  const lower = lengthStr.toLowerCase();
  if (lower.includes('hour') || lower.includes('hr')) return num * 3600;
  if (lower.includes('second') || lower.includes('sec')) return num;
  return num * 60; // default to minutes
};

const Matchmaking = () => {
  const router = useRouter();
  const { tasks } = useTasks();
  const [searching, setSearching] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  const { resetSession } = useTaskStatus();

  const userTotalSeconds = useMemo(() => {
    return tasks.reduce((acc, task) => acc + parseLengthToSeconds(task.length), 0);
  }, [tasks]);

  // Animation values
  const pulse = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
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
      const generated = generateParticipants(userTotalSeconds);
      const user = {
        id: -1,
        name: 'You',
        icon: 'person',
        totalSeconds: userTotalSeconds,
        isUser: true,
      };
      setMatches([user, ...generated].sort((a, b) => a.totalSeconds - b.totalSeconds));
      setSearching(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [userTotalSeconds]);

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
          <Text style={styles.searchingTitle}>Assembling Your Royale...</Text>
          <Text style={styles.searchingSubtitle}>Finding 9 competitors with similar routines</Text>
          <Text style={styles.timeTag}>Your Total: {formatSeconds(userTotalSeconds)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e40af" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Found!</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.matchCard}>
          <View style={styles.matchBadge}>
            <Ionicons name="people" size={18} color="white" />
            <Text style={styles.matchBadgeText}>TOP 10 COMPETITORS</Text>
          </View>
          <Text style={styles.matchHeadline}>This month's group is set.</Text>
          <Text style={styles.matchSubline}>You compete against these players for the highest score.</Text>
        </View>

        {matches.map((player, index) => (
          <View key={player.id} style={[styles.playerRow, player.isUser && styles.userRow]}>
            <View style={styles.rankContainer}>
              <Text style={[styles.rankText, player.isUser && styles.userRankText]}>{index + 1}</Text>
            </View>

            <View style={[styles.playerIconCircle, player.isUser && styles.userIconCircle]}>
              <Ionicons name={player.icon} size={20} color={player.isUser ? '#3b82f6' : '#64748b'} />
            </View>

            <View style={styles.playerNameContainer}>
              <Text style={[styles.playerName, player.isUser && styles.userPlayerName]}>
                {player.name} {player.isUser && '(You)'}
              </Text>
              <Text style={styles.playerTime}>{formatSeconds(player.totalSeconds)} routine</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
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
  userRow: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
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
  userIconCircle: {
    backgroundColor: 'white',
  },
  playerNameContainer: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  userPlayerName: {
    color: '#3b82f6',
  },
  playerTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
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
