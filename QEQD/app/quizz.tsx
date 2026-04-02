import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
// Importation du bon SafeAreaView
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

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(60);

  // Timer de 1 minute
  useEffect(() => {
    if (timer <= 0) {
        // Optionnel : ce qu'il se passe quand le temps est écoulé
        return;
    };
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Sécurité : si on a fini ou si les données ne sont pas chargées
  const currentQuestion = quizzData[currentIndex];

  const handleAnswer = (choice: string) => {
    if (currentIndex < quizzData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Quizz terminé !");
      router.back();
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
        {/* Affichage de l'image via le mapping */}
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
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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
    fontVariant: ['tabular-nums'] // Évite que le texte bouge quand les chiffres changent
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
    backgroundColor: '#ddd' // Fond gris en attendant l'image
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
    // Petite ombre pour le relief
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