import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import quizzDataRaw from '../data/quizz.json';
const quizzData = quizzDataRaw as any[];

const IMAGES_QUIZZ: { [key: string]: any } = {
  "tour_eiffel": require('../assets/images/tour_eiffel.jpg'),
  "italie": require('../assets/images/italie.jpg'),
  "colisee": require('../assets/images/colisee.jpg'),
  "taj_mahal": require('../assets/images/taj_mahal.jpg'),
};

const TIMER_DURATION = 60;
const IMAGE_OPTION_SIZE = 300;

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const hasEnded = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer > 0 || hasEnded.current) return;
    hasEnded.current = true;

    if (Platform.OS === 'web') {
      alert("Temps écoulé !");
      router.replace('/(tabs)');
    } else {
      Alert.alert("Temps écoulé !", "Désolé, le temps est fini.", [
        { text: "OK", onPress: () => router.replace('/(tabs)') }
      ]);
    }
  }, [timer]);

  const currentQuestion = quizzData[currentIndex];

  const handleAnswer = (choice: string) => {
    if (currentIndex < quizzData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Quizz terminé !");
      router.replace('/(tabs)');
    }
  };

  if (!currentQuestion) return <View style={styles.container}><Text>Chargement...</Text></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.timer, timer <= 10 && { color: 'red' }]}>
          {timer}s
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.quizBox}>

          {/* Image principale — type texte uniquement */}
          {currentQuestion.type === 'text' && currentQuestion.imageName && (
            <View style={styles.mainImageWrapper}>
              <Image
                source={IMAGES_QUIZZ[currentQuestion.imageName]}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>
          )}

          <Text style={styles.question}>{currentQuestion.question}</Text>

          {/* Réponses texte */}
          {currentQuestion.type !== 'image' && (
            <View style={styles.column}>
              {currentQuestion.options.map((opt: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswer(opt)}
                  style={styles.textOption}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Réponses image — grille 2x2 en px fixes */}
          {currentQuestion.type === 'image' && (
            <View style={styles.imageGrid}>
              {currentQuestion.options.map((opt: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswer(opt)}
                  style={styles.imageOption}
                >
                  <Image
                    source={IMAGES_QUIZZ[opt]}
                    style={styles.optionImg}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
        <Text style={{ color: 'white', paddingHorizontal: 20, paddingVertical: 5 }}>Quitter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  quizBox: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },

  mainImageWrapper: {
    width: '100%',
    maxWidth: 480,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },

  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 15,
    textAlign: 'center',
    color: '#1A1A1A',
    lineHeight: 28,
  },

  column: {
    width: '100%',
  },
  textOption: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#007AFF',
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: IMAGE_OPTION_SIZE * 2 + 12,
  },
  imageOption: {
    width: IMAGE_OPTION_SIZE,
    height: IMAGE_OPTION_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  optionImg: {
    width: '100%',
    height: '100%',
  },

  backBtn: {
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#ff4444',
    borderRadius: 8,
    overflow: 'hidden',
  },
});