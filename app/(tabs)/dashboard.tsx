import { LinearGradient } from 'expo-linear-gradient';
import React, { useSyncExternalStore } from 'react'; // NOUVEL IMPORT
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { scoreStore } from '@/constants/scoreStore'; // NOUVEL IMPORT
import { Fonts } from '@/constants/theme';

// Ceci devient juste la "configuration visuelle" (couleurs, images)
const uiConfig = [
  { id: '1', category: 'Personnalités', color: '#FF3B7C', bgColors: ['#3A1C4A', '#5A2A4A'], image: require('@/assets/images/Napoleon.png') },
  { id: '2', category: 'Géographie', color: '#4ECDC4', bgColors: ['#234B6E', '#368A91'], image: require('@/assets/images/Terre.png') },
  { id: '3', category: 'Cinéma', color: '#FFE66D', bgColors: ['#4A3F2A', '#7A6B3A'], image: require('@/assets/images/Realisateur.png') },
  { id: '4', category: 'Sport', color: '#9B59B6', bgColors: ['#3A1C6A', '#5D33A6'], image: require('@/assets/images/Sportif.png') }
];

export default function DashboardScreen() {
  // On écoute les vrais scores en direct depuis le store
  const realScores = useSyncExternalStore(scoreStore.subscribe, scoreStore.getSnapshot);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText style={styles.title}>Tableau des scores</ThemedText>
      <ThemedText style={styles.subtitle}>Tes performances par catégorie :</ThemedText>

      <View style={styles.cardsContainer}>
        {uiConfig.map((item) => {
          // On récupère le vrai score (0 par défaut)
          const categoryData = realScores[item.category] || { score: 0, total: 0 };
          
          // On évite la division par zéro si total = 0
          const progressPercentage = categoryData.total > 0 
            ? (categoryData.score / categoryData.total) * 100 
            : 0;

          return (
            <LinearGradient key={item.id} colors={item.bgColors as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              <View style={styles.textContainer}>
                <ThemedText style={styles.category}>{item.category}</ThemedText>
                
                {/* AFFICHAGE DES VRAIS SCORES */}
                <ThemedText style={styles.score}>
                  {categoryData.score} <ThemedText style={styles.scoreTotal}>/ {categoryData.total}</ThemedText>
                </ThemedText>

                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
              </View>
              <Image source={item.image} style={styles.illustration} resizeMode="contain" />
            </LinearGradient>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ... Tes styles restent exactement les mêmes !
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12142B' },
  content: { padding: 20, paddingTop: 70, paddingBottom: 40 },
  title: { fontSize: 28, fontFamily: Fonts?.rounded, fontWeight: 'bold', marginBottom: 8, color: '#FFFFFF' },
  subtitle: { fontSize: 16, opacity: 0.7, color: '#FFFFFF', marginBottom: 30 },
  cardsContainer: { gap: 16 },
  card: { borderRadius: 20, minHeight: 130, position: 'relative', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  textContainer: { padding: 20, width: '65%', zIndex: 2 },
  category: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  score: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  scoreTotal: { fontSize: 20, fontWeight: 'normal', color: '#FFFFFF' },
  progressBarWrapper: { marginBottom: 8, position: 'relative', justifyContent: 'center', height: 18 },
  progressBarBackground: { height: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 999, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 999 },
  illustration: { position: 'absolute', right: 0, bottom: 0, width: 140, height: 140, zIndex: 1 }
});