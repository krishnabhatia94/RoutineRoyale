import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePoints } from '../context/PointsContext';
import { useTasks } from '../context/TaskListContext';
import { useTaskStatus } from '../context/TaskStatusContext';

const Routine_Active = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { tasks } = useTasks();
  const { addPoints } = usePoints();

  // Pull everything from Status Context
  // toggleTaskStatus updates completedTaskIds
  // elapsedSeconds is the "live" ticking value from the Provider's useEffect
  const {
    elapsedSeconds,
    formatTime,
    setIsActive,
    completedTaskIds,
    toggleTaskStatus
  } = useTaskStatus();

  // Logic: All tasks are done if every task ID in the master list is present in completedTaskIds
  const allTasksDone = tasks.length > 0 && tasks.every(task => completedTaskIds.includes(task.id));

  const handleFinishRoutine = () => {
    setIsActive(false);
    addPoints(50);
    router.replace('/post_routine');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Routine Active</Text>
          <View style={styles.timerBadge}>
            <Ionicons name="stopwatch-outline" size={16} color="#1e40af" />
            {/* DISPLAYING LIVE CONTEXT TIME HERE */}
            <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Complete your tasks listed below to earn your points.</Text>

        {tasks.map((task) => {
          const isDone = completedTaskIds.includes(task.id);
          return (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskCard, isDone && styles.taskCardDone]}
              onPress={() => toggleTaskStatus(task.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, isDone && styles.iconCircleDone]}>
                <Ionicons
                  name={task.icon as any}
                  size={20}
                  color={isDone ? "white" : "#1e40af"}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.taskText, isDone && styles.taskTextDone]}>
                  {task.name}
                </Text>
                <Text style={styles.taskLengthText}>{task.length}</Text>
              </View>

              <View style={[styles.miniCheckbox, isDone && styles.miniCheckboxChecked]}>
                {isDone && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.elapsedContainer}>
          <Text style={styles.elapsedLabel}>Total Time Elapsed</Text>
          <Text style={styles.elapsedValue}>{formatTime(elapsedSeconds)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.clockOutBtn, !allTasksDone && styles.clockOutBtnDisabled]}
          disabled={!allTasksDone}
          onPress={handleFinishRoutine}
        >
          <Text style={styles.clockOutText}>
            {allTasksDone ? "Finish Routine & Clock Out" : "Complete All Tasks"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... Styles (unchanged from your previous setup)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  timerText: { marginLeft: 5, color: '#1e40af', fontWeight: '800', fontSize: 13, fontVariant: ['tabular-nums'] },
  scrollContainer: { padding: 20 },
  subtitle: { color: '#64748b', marginBottom: 25, fontSize: 15 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  taskCardDone: { borderColor: '#cbd5e1', backgroundColor: '#f1f5f9' },
  iconCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconCircleDone: { backgroundColor: '#10b981' },
  taskText: { fontSize: 16, color: '#1e293b', fontWeight: 'bold' },
  taskTextDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskLengthText: { fontSize: 13, color: '#64748b', marginTop: 2 },
  miniCheckbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  miniCheckboxChecked: { backgroundColor: '#10b981', borderColor: '#10b981' },
  footer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  elapsedContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  elapsedLabel: { color: '#64748b', fontSize: 14, fontWeight: '500' },
  elapsedValue: { color: '#1e293b', fontSize: 18, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  clockOutBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 15, alignItems: 'center' },
  clockOutBtnDisabled: { backgroundColor: '#cbd5e1' },
  clockOutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Routine_Active;