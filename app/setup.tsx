import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useProfile } from '../context/ProfileContext';

const SetupScreen = () => {
  const router = useRouter();
  const { setName, setUsername: setContextUsername, setDob: setContextDob, isDarkMode, toggleDarkMode } = useProfile();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Info Modal State
  const [showInfo, setShowInfo] = useState(false);

  // Date Picker State
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS keep it open until closed, Android closes on selection
    setDob(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const isFormValid = fullName.trim() !== '' && username.trim() !== '';

  const handleContinue = () => {
    // Save to context
    if (fullName) setName(fullName);
    if (username) setContextUsername(username);
    setContextDob(dob.toISOString().split('T')[0]); // YYYY-MM-DD

    router.replace('/home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
        bounces={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.innerContainer, { paddingBottom: Platform.OS === 'android' ? 140 : 120 }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={[styles.title, isDarkMode && styles.titleDark]}>RoutineRoyale</Text>
              <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>Let's get you set up.</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>

              {/* Info Button */}
              <View style={styles.infoButtonWrapper}>
                <TouchableOpacity 
                  style={[styles.infoButton, isDarkMode && styles.infoButtonDark]} 
                  onPress={() => setShowInfo(true)}
                >
                  <Ionicons name="help" size={20} color={isDarkMode ? "#38bdf8" : "#3b82f6"} />
                  <Text style={[styles.infoButtonText, isDarkMode && styles.infoButtonTextDark]}>What is RoutineRoyale?</Text>
                </TouchableOpacity>
              </View>

              {/* Horizontal Theme Toggle */}
              <View style={styles.toggleWrapper}>
                <TouchableOpacity
                  style={[styles.horizontalToggle, isDarkMode && styles.horizontalToggleDark]}
                  onPress={toggleDarkMode}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleTrack}>
                    <View style={[styles.toggleKnob, isDarkMode ? styles.knobRight : styles.knobLeft, isDarkMode && styles.toggleKnobDark]}>
                      <Ionicons
                        name={isDarkMode ? "moon" : "sunny"}
                        size={14}
                        color={isDarkMode ? "#38bdf8" : "#f59e0b"}
                      />
                    </View>
                    <View style={styles.trackIconSpace}>
                      <Ionicons name="sunny" size={14} color={isDarkMode ? "rgba(255,255,255,0.6)" : "transparent"} style={{ marginLeft: 6 }} />
                      <Ionicons name="moon" size={14} color={isDarkMode ? "transparent" : "rgba(255,255,255,0.6)"} style={{ marginRight: 6 }} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>Full Name</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="John Doe"
                  placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>Username</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="johndoe"
                  placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>Date of Birth</Text>
                {Platform.OS === 'ios' ? (
                  <View style={[styles.datePickerContainerIOS, isDarkMode && styles.datePickerContainerIOSDark]}>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={dob}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                      maximumDate={new Date()}
                      themeVariant={isDarkMode ? "dark" : "light"}
                    />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity style={[styles.dateInput, isDarkMode && styles.dateInputDark]} onPress={showDatepicker}>
                      <Text style={[styles.dateText, isDarkMode && styles.dateTextDark]}>
                        {dob.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                      />
                    )}
                  </>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>Password</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Type a password here..."
                  placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* Footer Container for Button */}
      <View style={[styles.footerContainer, { paddingBottom: Platform.OS === 'android' ? 60 : 40 }]}>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton, 
            isDarkMode && styles.continueButtonDark,
            !isFormValid && styles.continueButtonDisabled,
            !isFormValid && isDarkMode && styles.continueButtonDisabledDark
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!isFormValid}
        >
          <Text style={[
            styles.continueText, 
            isDarkMode && styles.continueTextDark,
            !isFormValid && styles.continueTextDisabled,
            !isFormValid && isDarkMode && styles.continueTextDisabledDark
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInfo}
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>How to Play</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#94a3b8" : "#64748b"} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, isDarkMode && styles.modalTextDark]}>
                Compete with friends and strangers in a "Battle Royale" type of setup where you and 10 other people are partnered up for 10 days.{'\n\n'}
                The time it takes you to complete tasks is logged and compared every time you start a Routine. Each day you compete is called a "Routine", and the 10 days you compete for is called a "Royale", and each day, the slowest person to complete a Routine is eliminated.{'\n\n'}
                You earn points depending on what your placement was. Additionally, you can do Daily Quests in order to gain bonus points for each Routine.{'\n\n'}
                You spend points on customizing your avatar, with customization options varying in expensiveness to let users show off their progress.{'\n\n'}
                To let users input tasks for a Routine, they can do it by hand, or describe the overall Routine and have Gemini fill in tasks for the Routine. Users can also ask Gemini for help picking durations and descriptions for tasks based off the Task Name with Magic Fill.
              </Text>
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalGotItButton, isDarkMode && styles.continueButtonDark]} 
              onPress={() => setShowInfo(false)}
            >
              <Text style={[styles.modalGotItText, isDarkMode && styles.continueTextDark]}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3b82f6', // Solid blue background
  },
  safeAreaDark: {
    backgroundColor: '#0f172a', // Dark theme background
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
    marginBottom: 8,
  },
  titleDark: {
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  subtitleDark: {
    color: '#94a3b8',
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  infoButtonWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoButtonDark: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoButtonText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoButtonTextDark: {
    color: '#38bdf8',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelDark: {
    color: '#94a3b8',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inputDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    color: 'white',
  },
  dateInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dateInputDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  dateTextDark: {
    color: 'white',
  },
  datePickerContainerIOS: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'flex-start',
  },
  datePickerContainerIOSDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    alignItems: 'center',
    gap: 16,
  },
  toggleWrapper: {
    marginBottom: 8,
    alignItems: 'center', // Center it nicely in the form
  },
  horizontalToggle: {
    width: 64,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  horizontalToggleDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  toggleTrack: {
    flex: 1,
    width: '100%',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  toggleKnob: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleKnobDark: {
    backgroundColor: '#1e293b',
  },
  knobLeft: { left: 2 },
  knobRight: { right: 2 },
  trackIconSpace: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  continueButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
  },
  continueButtonDark: {
    backgroundColor: '#38bdf8',
  },
  continueButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonDisabledDark: {
    backgroundColor: '#475569',
  },
  continueText: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  continueTextDark: {
    color: 'white',
  },
  continueTextDisabled: {
    color: 'rgba(255,255,255,0.8)',
  },
  continueTextDisabledDark: {
    color: 'rgba(255,255,255,0.4)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContentDark: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  modalTitleDark: {
    color: 'white',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  modalTextDark: {
    color: '#94a3b8',
  },
  modalGotItButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalGotItText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetupScreen;
