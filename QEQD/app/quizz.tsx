import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import des données
import quizzDataRaw from '../data/quizz.json';
const quizzData = quizzDataRaw as any[];

// Mapping des images
const IMAGES_QUIZZ: { [key: string]: any } = {
  "paris": require('../assets/images/paris.jpg'),
  "italie": require('../assets/images/italie.jpg'),
  "colisee": require('../assets/images/colisee.jpg'),
};

const TIMER_DURATION = 30; // secondes

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const hasEnded = useRef(false);

  // Un seul intervalle créé au montage — jamais recréé
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Séparé : réaction quand le timer atteint 0
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
      {/* Header avec Timer */}
      <View style={styles.header}>
        <Text style={[styles.timer, timer <= 10 && { color: 'red' }]}>
          Temps : {timer}s
        </Text>
      </View>

      {/* Contenu du Quiz */}
      <View style={styles.quizBox}>
        <Image 
          source={IMAGES_QUIZZ[currentQuestion.imageName]} 
          style={styles.image} 
          resizeMode="contain"
        />
        
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {currentQuestion.options.map((opt: string, i: number) => (
          <TouchableOpacity 
            key={i} 
            style={styles.optionBtn} 
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton Quitter */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
        <Text style={{color: 'white', paddingHorizontal: 20, paddingVertical: 5}}>Quitter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    padding: 20, 
    alignItems: 'center' 
  },
  timer: { 
    fontSize: 28, 
    fontWeight: 'bold',
    fontVariant: ['tabular-nums']
  },
  quizBox: { 
    padding: 20, 
    alignItems: 'center',
    width: '100%'
  },
  image: { 
    width: '100%', 
    height: 220, 
    borderRadius: 15, 
    marginBottom: 20,
    backgroundColor: '#ddd'
  },
  question: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    textAlign: 'center',
    color: '#333'
  },
  optionBtn: { 
    backgroundColor: '#fff', 
    width: '100%', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  optionText: { 
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: '500',
    color: '#007AFF' 
  },
  backBtn: { 
    marginTop: 'auto', 
    marginBottom: 20, 
    alignSelf: 'center', 
    backgroundColor: '#ff4444', 
    borderRadius: 8,
    overflow: 'hidden'
  }
});