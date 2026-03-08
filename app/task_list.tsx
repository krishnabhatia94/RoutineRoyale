import { useProfile } from '@/context/ProfileContext';
import { useTasks, Task } from '@/context/TaskListContext';
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
  const [isMagicFilling, setIsMagicFilling] = useState<number | null>(null);

  const { tasks, addTask, updateTask, deleteTask, setTasks } = useTasks();
  const { activeQuest, setActiveQuest, isDarkMode } = useProfile();

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
      description: activeQuest.description,
      icon: activeQuest.icon,
    };
    return [questTask, ...tasks];
  }, [tasks, activeQuest]);

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
    if (!hasChanges || isSaving) return;

    // Validation: Check if any task name or length is empty
    const invalidTask = tasks.find(t => t.name.trim() === "" || t.length.trim() === "");
    if (invalidTask) {
      Alert.alert(
        "Incomplete Tasks",
        "Every task must have a name and a length. Please check your routine.",
        [{ text: "OK", onPress: () => setExpandedId(invalidTask.id) }]
      );
      return;
    }

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

  const handleClearAll = () => {
    Alert.alert(
      "Clear Routine?",
      "Are you sure you want to remove all tasks from this routine? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setTasks([]);
            setExpandedId(null);
          }
        }
      ]
    );
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

  const handleMagicFill = async (item: any) => {
    if (!item.name.trim()) {
      Alert.alert("Magic Fill", "Please fill in Task Name to use Magic Fill!");
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      Alert.alert("API Key Missing", "Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.");
      return;
    }

    setIsMagicFilling(item.id);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are a helper for 'RoutineRoyale'.
      The user wants to 'Magic Fill' details for a task named: "${item.name}".
      
      Generate appropriate details in this JSON format:
      {
        "length": "string (e.g. '15 mins', '5 mins', '1 hour', '30 secs')",
        "description": "string (brief instruction)",
        "icon": "string (ONE OF: water, body, book, flash, barbell, cafe)"
      }
      
      Return ONLY the raw JSON. No markdown.`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanedText);

      updateTask(item.id, 'length', data.length);
      updateTask(item.id, 'description', data.description);
      updateTask(item.id, 'icon', data.icon);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Magic Fill Error:", error);
      Alert.alert("Magic Fill Failed", "Could not autofill task. Please try again.");
    } finally {
      setIsMagicFilling(null);
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
    const isExpanded = expandedId === item.id;
    return (
      <View style={[
        styles.card, 
        isDarkMode && styles.cardDark,
        isActive && { backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }
      ]}>
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
            <Ionicons name="reorder-three-outline" size={24} color={isDarkMode ? "#64748b" : "#94a3b8"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconCircle, 
              isDarkMode && styles.iconCircleDark,
              item.isQuest && (isDarkMode ? styles.questIconCircleDark : styles.questIconCircle)
            ]}>
              <Ionicons name={item.icon as any} size={20} color={item.isQuest ? "#f59e0b" : (isDarkMode ? "#38bdf8" : "#1e40af")} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskNamePreview, isDarkMode && styles.taskNamePreviewDark]}>
                {item.name || "New Task"}
              </Text>
              <Text style={[styles.taskLengthPreview, isDarkMode && styles.taskLengthPreviewDark]}>
                {item.length || "0 mins"}
              </Text>
            </View>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={isDarkMode ? "#64748b" : "#94a3b8"}
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={[styles.expandedSection, isDarkMode && styles.expandedSectionDark]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>Task Name</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={item.name}
                onChangeText={(val) => !item.isQuest && updateTask(item.id, 'name', val)}
                placeholder="e.g. Morning Meditation"
                placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
                editable={!item.isQuest}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>Length of Task</Text>
                {item.isQuest && (
                  <Text style={[styles.questDurationLabel, isDarkMode && styles.questDurationLabelDark]}>
                    Quest Points: {item.points} pts
                  </Text>
                )}
              </View>
              <View style={styles.lengthInputRow}>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark, styles.numericInput]}
                  value={item.isQuest && item.length === 'N/A' ? 'N/A' : parseLength(item.length).num}
                  onChangeText={(val) => {
                    if (item.isQuest) return;
                    const { unit } = parseLength(item.length);
                    updateTask(item.id, 'length', `${val} ${unit}`);
                  }}
                  placeholder="e.g. 10"
                  placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
                  keyboardType="numeric"
                  editable={!item.isQuest}
                />
                {!item.isQuest ? (
                  <View style={[styles.unitPicker, isDarkMode && styles.unitPickerDark]}>
                    {unitOptions.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.unitOption,
                          parseLength(item.length).unit === unit && (isDarkMode ? styles.unitOptionSelectedDark : styles.unitOptionSelected)
                        ]}
                        onPress={() => {
                          const { num } = parseLength(item.length);
                          updateTask(item.id, 'length', `${num} ${unit}`);
                        }}
                      >
                        <Text style={[
                          styles.unitOptionText,
                          isDarkMode && styles.unitOptionTextDark,
                          parseLength(item.length).unit === unit && styles.unitOptionTextSelected
                        ]}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  item.isQuest && item.length && !item.length.includes('pts') && item.length !== 'N/A' ? (
                    <View style={[styles.questUnitDisplay, isDarkMode && styles.questUnitDisplayDark]}>
                      <Text style={[styles.questUnitText, isDarkMode && styles.questUnitTextDark]}>
                        {parseLength(item.length).unit.charAt(0).toUpperCase() + parseLength(item.length).unit.slice(1)}
                      </Text>
                    </View>
                  ) : null
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>Description</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark, styles.textArea]}
                value={item.description}
                onChangeText={(val) => !item.isQuest && updateTask(item.id, 'description', val)}
                multiline
                placeholder="What needs to be done?"
                placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
                editable={!item.isQuest}
              />
            </View>

            {!item.isQuest && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>Choose Icon</Text>
                <View style={styles.iconPicker}>
                  {iconOptions.map((iconName) => (
                    <TouchableOpacity
                      key={iconName}
                      style={[
                        styles.iconOption,
                        isDarkMode && styles.iconOptionDark,
                        item.icon === iconName && styles.iconOptionSelected
                      ]}
                      onPress={() => updateTask(item.id, 'icon', iconName)}
                    >
                      <Ionicons
                        name={iconName as any}
                        size={20}
                        color={item.icon === iconName ? "white" : (isDarkMode ? "#94a3b8" : "#64748b")}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity 
                  onPress={() => handleMagicFill(item)}
                  disabled={isMagicFilling === item.id}
                  style={styles.magicFillBtn}
                >
                  <Text style={[styles.magicFillText, isDarkMode && styles.magicFillTextDark]}>
                    {isMagicFilling === item.id ? "Working..." : "Magic Fill..."}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {item.isQuest ? (
              <TouchableOpacity
                style={[
                  styles.deleteBtn, 
                  isDarkMode && styles.deleteBtnDark,
                  styles.deselectQuestBtn,
                  isDarkMode && styles.deselectQuestBtnDark
                ]}
                onPress={() => setActiveQuest(null)}>
                <Ionicons name="close-circle-outline" size={18} color="#f59e0b" />
                <Text style={[
                  styles.deleteBtnText, 
                  styles.deselectQuestBtnText,
                  isDarkMode && styles.deselectQuestBtnTextDark
                ]}>
                  Deselect Quest
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.deleteBtn, isDarkMode && styles.deleteBtnDark]}
                onPress={() => deleteTask(item.id)}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
                <Text style={styles.deleteBtnText}>Delete Task</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }, [expandedId, tasks, isDarkMode]);

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <DraggableFlatList
        containerStyle={{ flex: 1 }}
        data={displayTasks}
        onDragEnd={({ data }: { data: any[] }) => {
          // Filter out the quest before saving order
          const updatedTasks = data.filter(t => !t.isQuest);
          setTasks(updatedTasks as Task[]);
        }}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContainer}
        activationDistance={20}
        ListHeaderComponent={
          <>
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.navBtn} onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color={isDarkMode ? "#38bdf8" : "#3b82f6"} />
                <Text style={[styles.navBtnText, isDarkMode && styles.navBtnTextDark]}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave} disabled={isSaving || !hasChanges}>
                <Text style={[
                  styles.saveText, 
                  isDarkMode && styles.saveTextDark,
                  (!hasChanges || isSaving) && { opacity: 0.5 }
                ]}>
                  {isSaving ? "Saving..." : (hasChanges ? "Save" : "Saved")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={[styles.pageTitle, isDarkMode && styles.pageTitleDark]}>Your Personal Task List</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <TouchableOpacity 
              style={[styles.addBtn, isDarkMode && styles.addBtnDark]} 
              onPress={addTask}
            >
              <Ionicons name="add" size={24} color={isDarkMode ? "#38bdf8" : "#3b82f6"} />
              <Text style={[styles.addBtnText, isDarkMode && styles.addBtnTextDark]}>Add New Task</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.addBtn, styles.clearBtn, isDarkMode && styles.addBtnDark, isDarkMode && styles.clearBtnDark]} 
              onPress={handleClearAll}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text style={[styles.addBtnText, styles.clearBtnText]}>Clear All Tasks In This Routine</Text>
            </TouchableOpacity>
          </>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Gemini AI Floating Bubble & Input */}
      <View style={styles.aiContainer}>
        {isAiModalVisible && (
          <View style={[styles.aiOverlay, isDarkMode && styles.aiOverlayDark]}>
            <TextInput
              style={[styles.aiInput, isDarkMode && styles.aiInputDark]}
              value={aiPrompt}
              onChangeText={setAiPrompt}
              placeholder="Type the routine you want to generate..."
              placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
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
          style={[
            styles.aiFab, 
            isAiModalVisible && styles.aiFabActive,
            isDarkMode && !isAiModalVisible && styles.aiFabDark
          ]}
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
  safeAreaDark: { backgroundColor: '#0f172a' },
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
  navBtnTextDark: { color: '#38bdf8' },
  saveText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 17 },
  saveTextDark: { color: '#38bdf8' },

  titleContainer: { alignItems: 'center', marginBottom: 25 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  pageTitleDark: { color: '#f8fafc' },

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
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
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
  iconCircleDark: {
    backgroundColor: '#334155',
  },
  taskNamePreview: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  taskNamePreviewDark: { color: '#f8fafc' },
  taskLengthPreview: { fontSize: 13, color: '#64748b', marginTop: 2 },
  taskLengthPreviewDark: { color: '#94a3b8' },

  expandedSection: {
    padding: 18,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  expandedSectionDark: {
    borderTopColor: '#334155',
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
  deleteBtnDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  inputGroup: { marginTop: 15 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' },
  labelDark: { color: '#64748b' },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  questDurationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
    textTransform: 'uppercase',
  },
  questDurationLabelDark: { color: '#38bdf8' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  inputDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    color: '#f8fafc',
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
  unitPickerDark: {
    backgroundColor: '#0f172a',
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
  unitOptionSelectedDark: {
    backgroundColor: '#334155',
  },
  unitOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  unitOptionTextDark: {
    color: '#94a3b8',
  },
  unitOptionTextSelected: {
    color: '#3b82f6',
  },
  magicFillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
  },
  magicFillTextDark: { color: '#38bdf8' },
  magicFillBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
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
  iconOptionDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
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
  addBtnDark: {
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  addBtnText: { color: '#3b82f6', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  addBtnTextDark: { color: '#38bdf8' },
  clearBtn: {
    marginTop: 0,
    borderColor: '#fee2e2',
    backgroundColor: '#fffafa',
  },
  clearBtnDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  clearBtnText: {
    color: '#ef4444',
  },

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
  aiFabDark: {
    backgroundColor: '#38bdf8',
    shadowColor: '#38bdf8',
  },
  aiFabActive: {
    backgroundColor: '#1e293b',
    shadowColor: '#000',
  },
  questIconCircle: {
    backgroundColor: '#fffbeb',
  },
  questIconCircleDark: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  deselectQuestBtn: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  deselectQuestBtnDark: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  deselectQuestBtnText: {
    color: '#f59e0b',
  },
  deselectQuestBtnTextDark: {
    color: '#fbbf24',
  },
  questUnitDisplay: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questUnitDisplayDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  questUnitText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  questUnitTextDark: { color: '#94a3b8' },
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
  aiOverlayDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  aiInput: {
    fontSize: 16,
    color: '#1e293b',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    lineHeight: 22,
  },
  aiInputDark: {
    color: '#f8fafc',
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
