import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, PanResponder, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { scoreStore } from '@/constants/scoreStore';
import quizzDataRaw from '@/data/quizz.json';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const quizzData = quizzDataRaw as any[];

const IMAGES_QUIZZ: { [key: string]: any } = {
  "napoleon": require('@/assets/images/Napoleon.png'),
  "terre": require('@/assets/images/Terre.png'),
  "sahara": require('@/assets/images/sahara.jpg'),
  "realisateur": require('@/assets/images/Realisateur.png'),
  "sportif": require('@/assets/images/Sportif.png'),
  "japon": require('@/assets/images/japon.jpg'),
  "matrix": require('@/assets/images/matrix.webp'),
  "moliere": require('@/assets/images/moliere.jpg'),
  "natation": require('@/assets/images/natation.jpg'),
};

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function GameScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const [questions] = useState(() => {
    const filtered = quizzData.filter(q => q.category === category);
    return shuffleArray(filtered);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentItem = questions[currentIndex];
  const pointsCounter = useRef(0);
  const stateRef = useRef({ currentItem, currentIndex, questions });
  stateRef.current = { currentItem, currentIndex, questions };

  const pan = useRef(new Animated.ValueXY()).current;
  const layoutMetrics = useRef({ imageY: 0, optionsContainerY: 0, options: {} as any });

  // Chronomètre
  useEffect(() => {
    if (isPaused || isGameOver || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleAnswer("TIMEOUT");
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, isPaused, isGameOver, questions.length]);

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    setTimeLeft(15);
    setIsPaused(false);
  }, [currentIndex]);

  const handleAnswer = (selectedAnswer: string) => {
    const current = stateRef.current.currentItem;
    if (!current || isPaused || isGameOver) return;

    setIsPaused(true);

    if (selectedAnswer === current.answer) {
      pointsCounter.current += 1;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => next(), 300);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = selectedAnswer === "TIMEOUT" ? "Temps écoulé !" : `Faux ! La réponse était :\n\n${current.answer}`;

      if (Platform.OS === 'web') {
        setTimeout(() => { alert(msg); next(); }, 50);
      } else {
        Alert.alert("Dommage", msg, [{ text: "Continuer", onPress: next }]);
      }
    }
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const catName = typeof category === 'string' ? category : 'Inconnu';
      scoreStore.addScore(catName, pointsCounter.current, questions.length);
      setIsGameOver(true);
    }
  };

  const handleGoToDashboard = () => {
    if (router.canDismiss()) router.dismissAll();
    router.replace('/(tabs)/dashboard');
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        const active = stateRef.current.currentItem;
        if (!active) return;

        if (active.mode === 'swipe') {
          if (gesture.dx > 120) handleAnswer("Vrai");
          else if (gesture.dx < -120) handleAnswer("Faux");
          else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          return;
        }

        const metrics = layoutMetrics.current;
        const imageCenterY = metrics.imageY + gesture.dy + 80;
        let matched = null;
        Object.keys(metrics.options).forEach(key => {
          const opt = metrics.options[key];
          if (imageCenterY >= (metrics.optionsContainerY + opt.y) - 20 && imageCenterY <= (metrics.optionsContainerY + opt.y + opt.height) + 20) {
            matched = active.options[key];
          }
        });

        if (matched) handleAnswer(matched);
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  // ==========================================
  // ÉCRAN D'ERREUR
  // ==========================================
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.gameOverWrapper}>
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedText style={styles.gameOverTitle}>Oups !</ThemedText>
        <ThemedText style={[styles.gameOverScore, { fontSize: 18, textAlign: 'center' }]}>
          Aucune question trouvée pour la catégorie "{category}".
        </ThemedText>
        <TouchableOpacity style={styles.finishButton} onPress={() => router.back()}>
          <ThemedText style={styles.finishButtonText}>Retourner à l'accueil</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ==========================================
  // ÉCRAN DE FIN DE PARTIE
  // ==========================================
  if (isGameOver) {
    return (
      <SafeAreaView style={styles.gameOverWrapper}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.gameOverContainer}>
          <ThemedText style={styles.gameOverTitle}>Partie Terminée !</ThemedText>
          <ThemedText style={styles.gameOverScore}>
            Score : {pointsCounter.current} / {questions.length}
          </ThemedText>
          <TouchableOpacity style={styles.finishButton} onPress={handleGoToDashboard}>
            <ThemedText style={styles.finishButtonText}>Voir mes scores</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentItem) return null;

  // ==========================================
  // ÉCRAN DE JEU NORMAL
  // ==========================================
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Quitter</ThemedText>
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={styles.timerBarBg}>
            <Animated.View style={[styles.timerBarFill, { width: `${(timeLeft / 15) * 100}%`, backgroundColor: timeLeft < 5 ? '#FF3B7C' : '#4ECDC4' }]} />
          </View>
          <ThemedText style={styles.title}>{currentIndex + 1}/{questions.length}</ThemedText>
        </View>
      </View>

      {currentItem.mode !== 'swipe' && (
        <ThemedText style={styles.instruction}>{currentItem.question}</ThemedText>
      )}

      {currentItem.mode === 'swipe' && (
        <View style={styles.swipeContainer}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              pan.getLayout(),
              styles.swipeCard,
              { transform: [{ rotate: pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-20deg', '0deg', '20deg'] }) }] },
              Platform.OS === 'web' ? { touchAction: 'none' } as any : {}
            ]}
          >
            <ThemedText style={styles.swipeQuestion}>{currentItem.question}</ThemedText>
            <ThemedText style={styles.swipeHint}>← FAUX       VRAI →</ThemedText>
          </Animated.View>
        </View>
      )}

      {currentItem.mode === 'drag_and_drop' && (
        <View style={{ flex: 1 }}>
          <View style={styles.dragZone} onLayout={e => layoutMetrics.current.imageY = e.nativeEvent.layout.y}>
            <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), styles.draggableItem, Platform.OS === 'web' ? { touchAction: 'none' } as any : {}]}>
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <Image source={IMAGES_QUIZZ[currentItem.imageName] || require('@/assets/images/react-logo.png')} style={styles.image} contentFit="cover" />
              </View>
            </Animated.View>
          </View>
          <View style={styles.optionsContainer} onLayout={e => layoutMetrics.current.optionsContainerY = e.nativeEvent.layout.y}>
            {currentItem.options.map((opt: any, i: number) => (
              <View key={i} style={styles.dropZone} onLayout={e => layoutMetrics.current.options[i] = e.nativeEvent.layout}>
                <ThemedText style={styles.descriptionText}>{opt}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}

      {currentItem.mode === 'qcm' && (
        <View style={styles.qcmContainer}>
          {currentItem.options.map((opt: any, i: number) => (
            <TouchableOpacity key={i} style={styles.qcmButton} onPress={() => handleAnswer(opt)}>
              <ThemedText style={styles.qcmText}>{opt}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12142B', paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 15, paddingBottom: 10 },
  backText: { color: '#FF3B7C', fontSize: 16, fontWeight: 'bold' },
  timerBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  timerBarFill: { height: '100%' },
  title: { color: 'white', textAlign: 'right', fontWeight: 'bold', fontSize: 12 },
  instruction: { fontSize: 22, color: 'white', textAlign: 'center', marginVertical: 20, fontWeight: 'bold' },

  // Swipe
  swipeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 50 },
  swipeCard: { width: SCREEN_WIDTH * 0.85, height: 400, backgroundColor: '#3A1C4A', borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FF3B7C', padding: 30, shadowColor: '#FF3B7C', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  swipeQuestion: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', marginBottom: 20, lineHeight: 36 },
  swipeHint: { color: 'white', opacity: 0.8, position: 'absolute', bottom: 30, fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },

  // Drag & Drop
  dragZone: { height: 180, alignItems: 'center', zIndex: 10 },
  draggableItem: { width: 150, height: 150, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: '#4ECDC4' },
  image: { width: '100%', height: '100%' },
  optionsContainer: { flex: 1, justifyContent: 'center', gap: 10 },
  dropZone: { backgroundColor: '#3A1C4A', padding: 15, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  descriptionText: { color: 'white', textAlign: 'center', fontWeight: '600' },

  // QCM
  qcmContainer: { flex: 1, justifyContent: 'center', gap: 15 },
  qcmButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#FF3B7C' },
  qcmText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Écran de fin
  gameOverWrapper: { flex: 1, backgroundColor: '#12142B', justifyContent: 'center', alignItems: 'center', padding: 20 },
  gameOverContainer: { width: '100%', alignItems: 'center', backgroundColor: '#3A1C4A', padding: 30, borderRadius: 25, borderWidth: 2, borderColor: '#4ECDC4' },
  gameOverTitle: { fontSize: 36, fontWeight: 'bold', color: '#FF3B7C', marginBottom: 20, textAlign: 'center' },
  gameOverScore: { fontSize: 24, color: '#FFFFFF', marginBottom: 40, fontWeight: 'bold', textAlign: 'center' },
  finishButton: { backgroundColor: '#4ECDC4', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, shadowColor: '#4ECDC4', shadowOpacity: 0.5, shadowRadius: 15, elevation: 8, width: '100%', alignItems: 'center' },
  finishButtonText: { fontSize: 18, fontWeight: 'bold', color: '#12142B' }
});