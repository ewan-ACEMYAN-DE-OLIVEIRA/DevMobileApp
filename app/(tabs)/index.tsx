import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

const categoriesToPlay = [
  { id: '1', category: 'Personnalités', color: '#FF3B7C', bgColors: ['#3A1C4A', '#5A2A4A'], image: require('@/assets/images/Napoleon.png') },
  { id: '2', category: 'Géographie', color: '#4ECDC4', bgColors: ['#234B6E', '#368A91'], image: require('@/assets/images/Terre.png') },
  { id: '3', category: 'Cinéma', color: '#FFE66D', bgColors: ['#4A3F2A', '#7A6B3A'], image: require('@/assets/images/Realisateur.png') },
  { id: '4', category: 'Sport', color: '#9B59B6', bgColors: ['#3A1C6A', '#5D33A6'], image: require('@/assets/images/Sportif.png') }
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText style={styles.title}>Match & Rire</ThemedText>
      <ThemedText style={styles.subtitle}>Choisis une catégorie pour jouer :</ThemedText>

      <View style={styles.cardsContainer}>
        {categoriesToPlay.map((item) => (
          <Pressable 
            key={item.id}
            onPress={() => router.push({ pathname: '/game' as any, params: { category: item.category } })}
          >
            <LinearGradient colors={item.bgColors as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              <View style={styles.textContainer}>
                <ThemedText style={styles.category}>{item.category}</ThemedText>
                <ThemedText style={styles.playText}>Lancer une partie ▶</ThemedText>
              </View>
              <Image source={item.image} style={styles.illustration} resizeMode="contain" />
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12142B' },
  content: { padding: 20, paddingTop: 70, paddingBottom: 40 },
  title: { fontSize: 32, fontFamily: Fonts?.rounded, fontWeight: 'bold', marginBottom: 8, color: '#FF3B7C' },
  subtitle: { fontSize: 18, opacity: 0.8, color: '#FFFFFF', marginBottom: 30 },
  cardsContainer: { gap: 16 },
  card: { borderRadius: 20, minHeight: 120, position: 'relative', overflow: 'hidden' },
  textContainer: { padding: 20, width: '70%', zIndex: 2, justifyContent: 'center' },
  category: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  playText: { fontSize: 16, fontWeight: 'bold', color: '#4ECDC4' },
  illustration: { position: 'absolute', right: -10, bottom: -10, width: 130, height: 130, zIndex: 1, opacity: 0.8 }
});