import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

const scoreData = [
  { id: '1', category: 'Personnalités', score: 85, total: 100, color: '#FF6B6B' },
  { id: '2', category: 'Géographie', score: 40, total: 50, color: '#4ECDC4' },
  { id: '3', category: 'Cinéma', score: 120, total: 150, color: '#FFE66D' },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts?.rounded,
          }}>
          Tableau des scores
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Votre score :
      </ThemedText>

      <View style={styles.cardsContainer}>
        {scoreData.map((item) => {
          const progressPercentage = (item.score / item.total) * 100;

          return (
            <ThemedView key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText type="subtitle">{item.category}</ThemedText>
              </View>
              
              <ThemedText type="defaultSemiBold" style={styles.scoreText}>
                {item.score} / {item.total} pts
              </ThemedText>

              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${progressPercentage}%`, backgroundColor: item.color }
                  ]} 
                />
              </View>
            </ThemedView>
          );
        })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.8,
  },
  cardsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.1)', 
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 16,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderRadius: 6,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
});