import { useProfile } from '@/context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = ["Skin Tone", "Hats", "Shirts", "Pants"];

const Edit_Avatar = () => {
  const router = useRouter();
  const { isDarkMode } = useProfile();
  const [activeCategory, setActiveCategory] = useState("Skin Tone");

  // This would eventually hold the state of what is equipped
  const [selections, setSelections] = useState({
    "Skin Tone": "none",
    "Hats": "none",
    "Shirts": "none",
    "Pants": "none"
  });
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      
      {/* 1. Avatar Preview Area (Top) */}
      <View style={[styles.previewContainer, isDarkMode && styles.previewContainerDark]}>
        <View style={styles.previewPlaceholder}>
          <Ionicons name="person" size={120} color={isDarkMode ? "#38bdf8" : "#cbd5e1"} />
          <Text style={[styles.previewText, isDarkMode && styles.previewTextDark]}>Avatar Preview</Text>
        </View>
      </View>

      {/* 2. Category Navigation (Center) */}
      <View style={[styles.categoryWrapper, isDarkMode && styles.categoryWrapperDark]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[
                styles.categoryButton, 
                isDarkMode && styles.categoryButtonDark,
                activeCategory === cat && styles.categoryButtonActive,
                activeCategory === cat && isDarkMode && styles.categoryButtonActiveDark
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                isDarkMode && styles.categoryButtonTextDark,
                activeCategory === cat && styles.categoryButtonTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Selection Menu (Bottom) */}
      <View style={[styles.menuContainer, isDarkMode && styles.menuContainerDark]}>
        <Text style={[styles.menuTitle, isDarkMode && styles.menuTitleDark]}>Select {activeCategory}</Text>
        
        <View style={styles.optionsGrid}>
          {/* Default "None" Option */}
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              isDarkMode && styles.optionItemDark,
              styles.selectedOption,
              isDarkMode && styles.selectedOptionDark
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="ban" size={32} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
            <Text style={[styles.optionLabel, isDarkMode && styles.optionLabelDark]}>None</Text>
          </TouchableOpacity>

          {/* Placeholders for future items */}
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.optionItem, isDarkMode && styles.optionItemDark, styles.lockedOption, isDarkMode && styles.lockedOptionDark]}>
              <Ionicons name="lock-closed" size={24} color={isDarkMode ? "#334155" : "#cbd5e1"} />
            </View>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={[
          styles.saveBtn, 
          isDarkMode && styles.saveBtnDark,
          { marginBottom: Math.max(insets.bottom, 20) }
        ]}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
  
  // Preview Section
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  previewContainerDark: { backgroundColor: '#0f172a' },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    marginTop: 10,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewTextDark: { color: '#64748b' },

  // Category Bar
  categoryWrapper: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryWrapperDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  categoryButtonDark: { backgroundColor: '#0f172a' },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonActiveDark: { backgroundColor: '#38bdf8' },
  categoryButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
  },
  categoryButtonTextDark: { color: '#94a3b8' },
  categoryButtonTextActive: {
    color: 'white',
  },

  // Menu Selection
  menuContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  menuContainerDark: { backgroundColor: '#0f172a' },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  menuTitleDark: { color: '#475569' },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  optionItem: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionItemDark: { backgroundColor: '#1e293b' },
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  selectedOptionDark: { borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  lockedOption: {
    backgroundColor: '#f1f5f9',
    elevation: 0,
    shadowOpacity: 0,
  },
  lockedOptionDark: { backgroundColor: '#0f172a' },
  optionLabel: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: 'bold',
    marginTop: 4,
  },
  optionLabelDark: { color: '#38bdf8' },

  // Save Button
  saveBtn: {
    backgroundColor: '#1e40af',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveBtnDark: { backgroundColor: '#38bdf8' },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Edit_Avatar;