import { useTasks } from '@/context/TaskListContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert // Import Alert for the pop-up
  ,






  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Task_List = () => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const { tasks, addTask, updateTask, deleteTask, setTasks } = useTasks();
  
  const [initialTasks, setInitialTasks] = useState(JSON.stringify(tasks));

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const hasChanges = initialTasks !== JSON.stringify(tasks);

  const handleSave = () => {
    if (hasChanges) {
      // Update the snapshot so that hasChanges becomes false
      setInitialTasks(JSON.stringify(tasks));
      setExpandedId(null);
      // Optional: Add a small toast or alert here if you want
      // For now, we'll just go back as you had it
      router.back();
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "Do you want to revert changes made?",
        [
          { text: "Keep Editing", style: "cancel" },
          { 
            text: "Revert & Exit", 
            style: "destructive", 
            onPress: () => {
              setExpandedId(null);
              setTasks(JSON.parse(initialTasks));
              router.back();
            } 
          }
        ]
      );
    } else {
      setExpandedId(null);
      router.back();
    }
  };

  const iconOptions = ['water', 'body', 'book', 'meditation', 'flash', 'barbell', 'cafe'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#3b82f6" />
            <Text style={styles.navBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveText, !hasChanges && { opacity: 0.5 }]}>
                {hasChanges ? "Save" : "Saved"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Your Personal Task List</Text>
        </View>

        {tasks.map((item) => (
          <View key={item.id} style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeader} 
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={20} color="#1e40af" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskNamePreview}>{item.name || "New Task"}</Text>
                <Text style={styles.taskLengthPreview}>{item.length || "0 mins"}</Text>
              </View>
              <Ionicons 
                name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#94a3b8" 
              />
            </TouchableOpacity>

            {expandedId === item.id && (
              <View style={styles.expandedSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Task Name</Text>
                  <TextInput 
                    style={styles.input}
                    value={item.name}
                    onChangeText={(val) => updateTask(item.id, 'name', val)}
                    placeholder="e.g. Morning Meditation"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Length of Task</Text>
                  <TextInput 
                    style={styles.input}
                    value={item.length}
                    onChangeText={(val) => updateTask(item.id, 'length', val)}
                    placeholder="e.g. 10 mins"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput 
                    style={[styles.input, styles.textArea]}
                    value={item.description}
                    onChangeText={(val) => updateTask(item.id, 'description', val)}
                    multiline
                    placeholder="What needs to be done?"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Choose Icon</Text>
                  <View style={styles.iconPicker}>
                    {iconOptions.map((iconName) => (
                      <TouchableOpacity 
                        key={iconName}
                        style={[
                          styles.iconOption, 
                          item.icon === iconName && styles.iconOptionSelected
                        ]}
                        onPress={() => updateTask(item.id, 'icon', iconName)}
                      >
                        <Ionicons 
                          name={iconName as any} 
                          size={20} 
                          color={item.icon === iconName ? "white" : "#64748b"} 
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => deleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  <Text style={styles.deleteBtnText}>Delete Task</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Ionicons name="add" size={24} color="#3b82f6" />
          <Text style={styles.addBtnText}>Add New Task</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20 },
  
  // Header Styles
  navRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -5 },
  navBtnText: { color: '#3b82f6', fontSize: 17, fontWeight: '500' },
  saveText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 17 },
  
  titleContainer: { alignItems: 'center', marginBottom: 25 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskNamePreview: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  taskLengthPreview: { fontSize: 13, color: '#64748b', marginTop: 2 },

  expandedSection: {
    padding: 18,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingVertical: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  inputGroup: { marginTop: 15 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  iconPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconOptionSelected: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 30
  },
  addBtnText: { color: '#3b82f6', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
});

export default Task_List;