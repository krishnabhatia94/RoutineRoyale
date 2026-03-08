import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import questsData from '../constants/quests.json';
import { useProfile, Quest } from '../context/ProfileContext';

const Quests = () => {
  const { activeQuest, setActiveQuest } = useProfile();
  const dailyQuests = questsData as Quest[];

  const handleToggleQuest = (quest: Quest) => {
    if (activeQuest?.id === quest.id) {
      setActiveQuest(null);
    } else {
      setActiveQuest(quest);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Daily Quests Section */}
        <View style={[styles.sectionHeader]}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
        </View>

        {/* Quest Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Add one or more of these tasks to your routine to earn bonus points while in routine!
          </Text>
        </View>

        {dailyQuests.map((quest) => {
          const isActive = activeQuest?.id === quest.id;
          return (
            <TouchableOpacity
              key={quest.id}
              style={[
                styles.questCard,
                isActive && styles.questCardActive
              ]}
              onPress={() => handleToggleQuest(quest)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                <Ionicons
                  name={quest.icon as any}
                  size={22}
                  color={isActive ? '#3b82f6' : '#1e40af'}
                />
              </View>
              <View style={styles.questInfo}>
                <Text style={[styles.questTitle, isActive && styles.questTitleActive]}>{quest.title}</Text>
                <Text style={styles.questDesc}>{quest.description}</Text>
              </View>
              <View
                style={[styles.questAction, isActive && styles.questActionActive]}
              >
                {isActive ? (
                  <Text style={styles.activeLabel}>Active</Text>
                ) : (
                  <Text style={styles.pointsAdd}>+{quest.points}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e40af' },

  // Quest Card Styles
  questCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  questCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff', // Light blue background for active
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b', // Subtle slate gray to match your description style
    fontWeight: '400',
  },
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  iconBoxDone: { backgroundColor: '#ecfdf5' },
  iconBoxActive: { backgroundColor: 'white' },
  questInfo: { flex: 1, marginLeft: 15 },
  questTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  questTitleActive: { color: '#1e40af' },
  questDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  questAction: {
    width: 65,
    height: 35,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  questActionActive: {
    backgroundColor: '#1e40af',
  },
  questActionDone: { backgroundColor: '#10b981' },
  pointsAdd: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  activeLabel: { color: 'white', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase' },
});

export default Quests;