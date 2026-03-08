import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../context/ProfileContext';
import { useTasks } from '../context/TaskListContext';
import { useTaskStatus } from '../context/TaskStatusContext';

const Routine_Active = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { tasks } = useTasks();
  const { activeQuest, isDarkMode } = useProfile();
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  // Combine tasks with active quest for display
  const displayTasks = React.useMemo(() => {
    if (!activeQuest) return tasks;
    const questTask = {
      ...activeQuest,
      id: -activeQuest.id, // Use negative ID to avoid collision
      isQuest: true,
      name: `QUEST: ${activeQuest.title}`,
      length: (activeQuest.length && activeQuest.length !== 'N/A')
        ? activeQuest.length
        : `+${activeQuest.points} pts`,
      description: activeQuest.description || "Active quest objective.",
    };
    return [questTask, ...tasks];
  }, [tasks, activeQuest]);

  // Pull everything from Status Context
  const {
    elapsedSeconds,
    formatTime,
    setIsActive,
    completedTaskIds,
    toggleTaskStatus
  } = useTaskStatus();

  // Logic: All tasks are done if every task ID in the combined list is present in completedTaskIds
  const allTasksDone = displayTasks.length > 0 && displayTasks.every(task => completedTaskIds.includes(task.id));

  const handleFinishRoutine = () => {
    setIsActive(false);
    router.replace('/post_routine');
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>Routine Active</Text>
          <View style={[styles.timerBadge, isDarkMode && styles.timerBadgeDark]}>
            <Ionicons name="stopwatch-outline" size={16} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
            <Text style={[styles.timerText, isDarkMode && styles.timerTextDark]}>{formatTime(elapsedSeconds)}</Text>
          </View>
        </View>

        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>Complete your tasks listed below to earn your points.</Text>

        {displayTasks.map((task: any) => {
          const isDone = completedTaskIds.includes(task.id);
          const isQuest = !!task.isQuest;
          const isExpanded = expandedId === task.id;

          return (
            <View key={task.id} style={styles.cardWrapper}>
              <TouchableOpacity
                style={[
                  styles.taskCard,
                  isDarkMode && styles.taskCardDark,
                  isDone && styles.taskCardDone,
                  isDone && isDarkMode && styles.taskCardDoneDark,
                  isQuest && styles.questCardBorder,
                  isQuest && isDarkMode && styles.questCardBorderDark
                ]}
                onPress={() => toggleTaskStatus(task.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconCircle,
                  isDarkMode && styles.iconCircleDark,
                  isDone && styles.iconCircleDone,
                  isQuest && !isDone && styles.questIconCircle,
                  isQuest && !isDone && isDarkMode && styles.questIconCircleDark
                ]}>
                  <Ionicons
                    name={task.icon as any}
                    size={20}
                    color={isDone ? "white" : (isQuest ? (isDarkMode ? "#f8fafc" : "#f59e0b") : (isDarkMode ? "#38bdf8" : "#1e40af"))}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskText, isDarkMode && styles.taskTextDark, isDone && styles.taskTextDone]}>
                    {task.name}
                  </Text>
                  <Text style={[styles.taskLengthText, isDarkMode && styles.taskLengthTextDark]}>{task.length}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleExpand(task.id);
                    }}
                    style={styles.expandBtn}
                  >
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={isDarkMode ? "#64748b" : "#94a3b8"}
                    />
                  </TouchableOpacity>

                  <View style={[styles.miniCheckbox, isDarkMode && styles.miniCheckboxDark, isDone && styles.miniCheckboxChecked]}>
                    {isDone && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={[styles.expandedContent, isDarkMode && styles.expandedContentDark]}>
                  <Text style={[styles.descriptionText, isDarkMode && styles.descriptionTextDark]}>
                    {task.description || "No description provided for this task."}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, isDarkMode && styles.footerDark, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.elapsedContainer}>
          <Text style={[styles.elapsedLabel, isDarkMode && styles.elapsedLabelDark]}>Total Time Elapsed</Text>
          <Text style={[styles.elapsedValue, isDarkMode && styles.elapsedValueDark]}>{formatTime(elapsedSeconds)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.clockOutBtn, !allTasksDone && styles.clockOutBtnDisabled, !allTasksDone && isDarkMode && styles.clockOutBtnDisabledDark]}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
  scrollContainer: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' },
  titleDark: { color: '#38bdf8' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  timerBadgeDark: { backgroundColor: '#1e293b' },
  timerText: { marginLeft: 5, color: '#1e40af', fontWeight: '800', fontSize: 13, fontVariant: ['tabular-nums'] },
  timerTextDark: { color: '#38bdf8' },
  subtitle: { color: '#64748b', marginBottom: 25, fontSize: 15 },
  subtitleDark: { color: '#94a3b8' },
  cardWrapper: { marginBottom: 12 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  taskCardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  taskCardDone: { borderColor: '#cbd5e1', backgroundColor: '#f1f5f9' },
  taskCardDoneDark: { borderColor: '#334155', backgroundColor: '#0f172a' },
  iconCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconCircleDark: { backgroundColor: '#0f172a' },
  iconCircleDone: { backgroundColor: '#10b981' },
  questIconCircle: { backgroundColor: '#fffbeb' },
  questIconCircleDark: { backgroundColor: '#334155' },
  questCardBorder: { borderColor: '#fde68a', backgroundColor: '#fffdf5' },
  questCardBorderDark: { borderColor: '#fde68a', backgroundColor: 'rgba(253, 230, 138, 0.05)' },
  taskText: { fontSize: 16, color: '#1e293b', fontWeight: 'bold' },
  taskTextDark: { color: '#f8fafc' },
  taskTextDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskLengthText: { fontSize: 13, color: '#64748b', marginTop: 2 },
  taskLengthTextDark: { color: '#94a3b8' },
  expandBtn: { padding: 10, marginRight: 4 },
  miniCheckbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  miniCheckboxDark: { borderColor: '#334155' },
  miniCheckboxChecked: { backgroundColor: '#10b981', borderColor: '#10b981' },
  expandedContent: {
    backgroundColor: '#f8fafc',
    marginTop: -10,
    paddingTop: 18,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e2e8f0',
    zIndex: -1
  },
  expandedContentDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155'
  },
  descriptionText: { fontSize: 14, color: '#475569', lineHeight: 20 },
  descriptionTextDark: { color: '#94a3b8' },
  footer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  footerDark: { backgroundColor: '#1e293b', borderTopColor: '#334155' },
  elapsedContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  elapsedLabel: { color: '#64748b', fontSize: 14, fontWeight: '500' },
  elapsedLabelDark: { color: '#94a3b8' },
  elapsedValue: { color: '#1e293b', fontSize: 18, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  elapsedValueDark: { color: '#f8fafc' },
  clockOutBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 15, alignItems: 'center' },
  clockOutBtnDisabled: { backgroundColor: '#cbd5e1' },
  clockOutBtnDisabledDark: { backgroundColor: '#334155' },
  clockOutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Routine_Active;