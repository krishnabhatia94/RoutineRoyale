import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categories = ["Skin Tone", "Hats", "Shirts", "Pants"];

const Edit_Avatar = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Skin Tone");

  // This would eventually hold the state of what is equipped
  const [selections, setSelections] = useState({
    "Skin Tone": "none",
    "Hats": "none",
    "Shirts": "none",
    "Pants": "none"
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. Avatar Preview Area (Top) */}
      <View style={styles.previewContainer}>
        <View style={styles.previewPlaceholder}>
          <Ionicons name="person" size={120} color="#cbd5e1" />
          <Text style={styles.previewText}>Avatar Preview</Text>
        </View>
      </View>

      {/* 2. Category Navigation (Center) */}
      <View style={styles.categoryWrapper}>
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
                activeCategory === cat && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                activeCategory === cat && styles.categoryButtonTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Selection Menu (Bottom) */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Select {activeCategory}</Text>
        
        <View style={styles.optionsGrid}>
          {/* Default "None" Option */}
          <TouchableOpacity 
            style={[styles.optionItem, styles.selectedOption]}
            activeOpacity={0.7}
          >
            <Ionicons name="ban" size={32} color="#1e40af" />
            <Text style={styles.optionLabel}>None</Text>
          </TouchableOpacity>

          {/* Placeholders for future items */}
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.optionItem, styles.lockedOption]}>
              <Ionicons name="lock-closed" size={24} color="#cbd5e1" />
            </View>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn}
      onPress={() => router.push('/profile')}
      >
        <Text style={styles.saveBtnText}>Save Changes</Text>
        
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  
  // Preview Section
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
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

  // Category Bar
  categoryWrapper: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
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
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
  },
  categoryButtonTextActive: {
    color: 'white',
  },

  // Menu Selection
  menuContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
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
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  lockedOption: {
    backgroundColor: '#f1f5f9',
    elevation: 0,
    shadowOpacity: 0,
  },
  optionLabel: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: 'bold',
    marginTop: 4,
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#1e40af',
    margin: 20,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Edit_Avatar;