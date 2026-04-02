import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

const scoreData = [
  { 
    id: '1', category: 'Personnalités', score: 85, total: 100, 
    color: '#FF3B7C', 
    bgColors: ['#3A1C4A', '#5A2A4A'], 
    image: require('@/assets/images/Napoleon.png'), 
  },
  { 
    id: '2', category: 'Géographie', score: 40, total: 50, 
    color: '#4ECDC4', 
    bgColors: ['#234B6E', '#368A91'], 
    image: require('@/assets/images/Terre.png'), 
  },
  { 
    id: '3', category: 'Cinéma', score: 120, total: 150, 
    color: '#FFE66D', 
    bgColors: ['#4A3F2A', '#7A6B3A'], 
    image: require('@/assets/images/Realisateur.png'), 
  },
  { 
    id: '4', category: 'Sport', score: 75, total: 100, 
    color: '#9B59B6', 
    bgColors: ['#3A1C6A', '#5D33A6'], 
    image: require('@/assets/images/Sportif.png'),
  }
];


export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <ThemedText style={styles.title}>
        Tableau des scores
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Tes scores : 
      </ThemedText>

      <View style={styles.cardsContainer}>
        {scoreData.map((item) => {
          const progressPercentage = (item.score / item.total) * 100;

          return (
            <LinearGradient 
              key={item.id} 
              colors={item.bgColors as [string, string]} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.card}
            >
              
              <View style={styles.textContainer}>
                
                <ThemedText style={styles.category}>
                  {item.category}
                </ThemedText>

                <ThemedText style={styles.score}>
                  {item.score} <ThemedText style={styles.scoreTotal}>/ {item.total}</ThemedText>
                </ThemedText>

                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${progressPercentage}%`, backgroundColor: item.color }
                      ]} 
                    />
                  </View>

                  <View style={[styles.progressBarIcon, { backgroundColor: 'white', opacity: 0.8, borderRadius: 99 }]} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12142B',
  },
  content: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts?.rounded,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    minHeight: 130,
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    padding: 20,
    width: '65%',
    zIndex: 2,
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scoreTotal: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  progressBarWrapper: {
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
    height: 18,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressBarIcon: {
    position: 'absolute',
    left: 4,
    width: 12,
    height: 12,
    zIndex: 10,
  },

  illustration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 140, 
    height: 140, 
    zIndex: 1,
  }
});