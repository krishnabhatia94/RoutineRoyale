import { useTasks } from '@/context/TaskListContext';
import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams
} from 'react-native-draggable-flatlist';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Task_List = () => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiModalVisible, setIsAiModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { tasks, addTask, updateTask, deleteTask, setTasks } = useTasks();

  const [initialTasks, setInitialTasks] = useState(JSON.stringify(tasks));

  // Hook for Android hardware back button
  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [expandedId, initialTasks, tasks]); // Dependencies to ensure current state is captured

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const hasChanges = initialTasks !== JSON.stringify(tasks);

  const handleSave = async () => {
    if (hasChanges && !isSaving) {
      setIsSaving(true);
      try {
        // Here you would typically await a server response:
        // await api.saveTasks(tasks);

        // Simulating the async nature of a server call
        await new Promise(resolve => setTimeout(resolve, 800));

        setInitialTasks(JSON.stringify(tasks));
        setExpandedId(null);
      } catch (error) {
        console.error("Failed to save tasks:", error);
        Alert.alert("Save Error", "There was a problem saving your tasks.");
      } finally {
        setIsSaving(false);
      }
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

  const handleGenerateRoutine = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      Alert.alert("API Key Missing", "Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.");
      return;
    }

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-2.0-flash for high speed and availability
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are a routine generation assistant for 'RoutineRoyale'. 
      Generate a JSON array of tasks based on the user's prompt. 
      Each task MUST follow this JSON structure precisely:
      { "id": number (unique), "name": string, "length": string (e.g. '10 mins', '30 secs'), "description": string, "icon": string (one of: water, body, book, flash, barbell, cafe), "completed": false }
      
      User Prompt: "${aiPrompt}"
      Return ONLY the raw JSON array. No markdown, no backticks, no prose.`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown if AI included it
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedTasks = JSON.parse(cleanedText);

      if (Array.isArray(generatedTasks)) {
        setTasks(generatedTasks);
        setIsAiModalVisible(false);
        setAiPrompt("");
        Alert.alert("Routine Generated!", "Gemini has initialized your routine.");
      }
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      Alert.alert("Generation Failed", "Could not generate routine. Please check your prompt or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const iconOptions = ['water', 'body', 'book', 'flash', 'barbell', 'cafe'];
  const unitOptions = ['seconds', 'minutes', 'hours'];

  const parseLength = (lengthStr: string) => {
    const num = lengthStr.replace(/[^0-9]/g, '');
    let unit = 'minutes';
    if (lengthStr.toLowerCase().includes('second') || lengthStr.toLowerCase().includes('sec')) unit = 'seconds';
    if (lengthStr.toLowerCase().includes('hour') || lengthStr.toLowerCase().includes('hr')) unit = 'hours';
    return { num, unit };
  };

  const renderItem = React.useCallback(({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <View style={[styles.card, isActive && { backgroundColor: '#f1f5f9' }]}>
        <View style={styles.cardHeaderRow}>
          {/* Rearrange Handle */}
          <TouchableOpacity
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              drag();
            }}
            delayLongPress={300}
            style={styles.dragHandle}
          >
            <Ionicons name="reorder-three-outline" size={24} color="#94a3b8" />
          </TouchableOpacity>

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
        </View>

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
              <View style={styles.lengthInputRow}>
                <TextInput
                  style={[styles.input, styles.numericInput]}
                  value={parseLength(item.length).num}
                  onChangeText={(val) => {
                    const { unit } = parseLength(item.length);
                    updateTask(item.id, 'length', `${val} ${unit}`);
                  }}
                  placeholder="e.g. 10"
                  keyboardType="numeric"
                />
                <View style={styles.unitPicker}>
                  {unitOptions.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitOption,
                        parseLength(item.length).unit === unit && styles.unitOptionSelected
                      ]}
                      onPress={() => {
                        const { num } = parseLength(item.length);
                        updateTask(item.id, 'length', `${num} ${unit}`);
                      }}
                    >
                      <Text style={[
                        styles.unitOptionText,
                        parseLength(item.length).unit === unit && styles.unitOptionTextSelected
                      ]}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
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
    );
  }, [expandedId, tasks]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DraggableFlatList
        containerStyle={{ flex: 1 }}
        data={tasks}
        onDragEnd={({ data }: { data: any[] }) => setTasks(data)}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContainer}
        activationDistance={20}
        ListHeaderComponent={
          <>
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.navBtn} onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color="#3b82f6" />
                <Text style={styles.navBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave} disabled={isSaving || !hasChanges}>
                <Text style={[styles.saveText, (!hasChanges || isSaving) && { opacity: 0.5 }]}>
                  {isSaving ? "Saving..." : (hasChanges ? "Save" : "Saved")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.pageTitle}>Your Personal Task List</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Ionicons name="add" size={24} color="#3b82f6" />
            <Text style={styles.addBtnText}>Add New Task</Text>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Gemini AI Floating Bubble & Input */}
      <View style={styles.aiContainer}>
        {isAiModalVisible && (
          <View style={styles.aiOverlay}>
            <TextInput
              style={styles.aiInput}
              value={aiPrompt}
              onChangeText={setAiPrompt}
              placeholder="Type the routine you want to generate..."
              placeholderTextColor="#94a3b8"
              multiline
            />
            <TouchableOpacity
              style={[styles.aiSendBtn, isGenerating && styles.aiSendBtnDisabled]}
              onPress={handleGenerateRoutine}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Text style={styles.aiSendText}>Generating...</Text>
              ) : (
                <>
                  <Ionicons name="sparkles" size={18} color="white" style={{ marginRight: 6 }} />
                  <Text style={styles.aiSendText}>Generate</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.aiFab, isAiModalVisible && styles.aiFabActive]}
          onPress={() => setIsAiModalVisible(!isAiModalVisible)}
          activeOpacity={0.8}
        >
          <Ionicons name={isAiModalVisible ? "close" : "sparkles"} size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20, flexGrow: 1, paddingBottom: 50 },

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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
  },
  dragHandle: {
    paddingLeft: 15,
    paddingRight: 5,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingLeft: 10,
    flex: 1,
  },
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

  lengthInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  numericInput: {
    flex: 1,
    maxWidth: 80,
    textAlign: 'center',
  },
  unitPicker: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    flex: 2,
  },
  unitOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  unitOptionSelected: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unitOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  unitOptionTextSelected: {
    color: '#3b82f6',
  },

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

  // AI Generation Styles
  aiContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'flex-end',
  },
  aiFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  aiFabActive: {
    backgroundColor: '#1e293b',
    shadowColor: '#000',
  },
  aiOverlay: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    width: 300,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  aiInput: {
    fontSize: 16,
    color: '#1e293b',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    lineHeight: 22,
  },
  aiSendBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  aiSendBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  aiSendText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default Task_List;
