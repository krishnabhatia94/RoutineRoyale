import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Import useSafeAreaInsets
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Routine_Active = () => {
  const router = useRouter();
  // 2. Initialize insets
  const insets = useSafeAreaInsets();
  
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Drink 500ml Water', completed: false },
    { id: 2, text: 'Morning Stretch', completed: false },
    { id: 3, text: 'Review Daily Goals', completed: false },
    { id: 4, text: 'No Phone for 30 Mins', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const allTasksDone = tasks.every(task => task.completed);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
            <Text style={styles.title}>Routine Active</Text>
            <View style={styles.timerBadge}>
                <Ionicons name="stopwatch-outline" size={16} color="#1e40af" />
                <Text style={styles.timerText}>Session Live</Text>
            </View>
        </View>

        <Text style={styles.subtitle}>Complete your morning habits to earn your points.</Text>

        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={[styles.taskCard, task.completed && styles.taskCardDone]}
            onPress={() => toggleTask(task.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
              {task.completed && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text style={[styles.taskText, task.completed && styles.taskTextDone]}>
              {task.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. Apply dynamic padding to the footer */}
      <View style={[
        styles.footer, 
        { paddingBottom: Math.max(insets.bottom, 20) + 10 }
      ]}>
        <TouchableOpacity 
          style={[styles.clockOutBtn, !allTasksDone && styles.clockOutBtnDisabled]}
          disabled={!allTasksDone}
          onPress={() => router.replace('/home')}
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
  sectionHeader: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' },
  timerBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#eff6ff', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12 
  },
  timerText: { marginLeft: 5, color: '#1e40af', fontWeight: 'bold', fontSize: 12 },
  scrollContainer: { padding: 20 },
  subtitle: { color: '#64748b', marginBottom: 25, fontSize: 15 },
  
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  taskCardDone: {
    borderColor: '#cbd5e1',
    backgroundColor: '#f1f5f9',
    opacity: 0.8,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  taskText: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
  taskTextDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  
  footer: { 
    padding: 20, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#e2e8f0',
  },
  clockOutBtn: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  clockOutBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  clockOutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Routine_Active;