import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, PanResponder, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { ThemedText } from '@/components/themed-text';
import { scoreStore } from '@/constants/scoreStore';
import quizzDataRaw from '@/data/quizz.json';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const quizzData = quizzDataRaw as any[];

const IMAGES_QUIZZ: { [key: string]: any } = {
  "napoleon": require('@/assets/images/Napoleon.png'),
  "terre": require('@/assets/images/Terre.png'),
  "sahara": require('@/assets/images/react-logo.png'), 
  "realisateur": require('@/assets/images/Realisateur.png'),
  "sportif": require('@/assets/images/Sportif.png'),
};

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function GameScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  
  const [questions] = useState(() => shuffleArray(quizzData.filter(q => q.category === category)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const currentItem = questions[currentIndex];
  const pointsCounter = useRef(0);
  const stateRef = useRef({ currentItem, currentIndex, questions });
  stateRef.current = { currentItem, currentIndex, questions };

  // Animations
  const pan = useRef(new Animated.ValueXY()).current;
  const layoutMetrics = useRef({ imageY: 0, optionsContainerY: 0, options: {} as any });

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer("TIMEOUT"); // Trop tard !
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentIndex]);

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    setTimeLeft(15); // Reset timer
  }, [currentIndex]);

  const handleAnswer = (selectedAnswer: string) => {
    const current = stateRef.current.currentItem;
    if (!current) return;

    if (selectedAnswer === current.answer) {
      pointsCounter.current += 1;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      next();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = selectedAnswer === "TIMEOUT" ? "Temps écoulé !" : `Faux ! La réponse était : ${current.answer}`;
      
      if (Platform.OS === 'web') {
        alert(msg);
        next();
      } else {
        Alert.alert("Dommage", msg, [{ text: "Continuer", onPress: next }]);
      }
    }
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      scoreStore.addScore(category as string, pointsCounter.current, questions.length);
      if (pointsCounter.current === questions.length) setShowConfetti(true);
      
      setTimeout(() => {
        const finalMsg = `Score final : ${pointsCounter.current}/${questions.length}`;
        if (Platform.OS === 'web') {
            alert(finalMsg);
            router.replace('/dashboard');
        } else {
            Alert.alert("Terminé !", finalMsg, [{ text: "OK", onPress: () => router.replace('/dashboard') }]);
        }
      }, 500);
    }
  };

  // Swipe / Drag Responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        const active = stateRef.current.currentItem;
        
        // Logique Swipe (Générique)
        if (active.mode === 'swipe') {
          if (gesture.dx > 120) handleAnswer("Vrai");
          else if (gesture.dx < -120) handleAnswer("Faux");
          else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          return;
        }

        // Logique Drag & Drop (Existante)
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

  if (!currentItem) return null;

  return (
    <View style={styles.container}>
      {showConfetti && <ConfettiCannon count={200} origin={{x: -10, y: 0}} fadeOut={true} />}
      
      <View style={styles.header}>
        <View style={styles.timerBarBg}>
          <Animated.View style={[styles.timerBarFill, { width: `${(timeLeft / 15) * 100}%`, backgroundColor: timeLeft < 5 ? '#FF3B7C' : '#4ECDC4' }]} />
        </View>
        <ThemedText style={styles.title}>{currentIndex + 1}/{questions.length}</ThemedText>
      </View>

      <ThemedText style={styles.instruction}>{currentItem.question}</ThemedText>

      {/* MODE SWIPE */}
      {currentItem.mode === 'swipe' && (
        <View style={styles.swipeContainer}>
          <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), styles.swipeCard, { transform: [{ rotate: pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-30deg', '0deg', '30deg'] }) }] }]}>
            <ThemedText style={styles.swipeHint}>Glisse à gauche (Faux) ou à droite (Vrai)</ThemedText>
            <Image source={require('@/assets/images/icon.png')} style={styles.swipeIcon} />
          </Animated.View>
        </View>
      )}

      {/* MODE DRAG & DROP */}
      {currentItem.mode === 'drag_and_drop' && (
        <View style={{flex: 1}}>
          <View style={styles.dragZone} onLayout={e => layoutMetrics.current.imageY = e.nativeEvent.layout.y}>
            <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), styles.draggableItem]}>
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

      {/* MODE QCM */}
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
  container: { flex: 1, backgroundColor: '#12142B', paddingTop: 50, paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  timerBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  timerBarFill: { height: '100%' },
  title: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  instruction: { fontSize: 22, color: 'white', textAlign: 'center', marginVertical: 20, fontWeight: 'bold' },
  
  // Swipe
  swipeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  swipeCard: { width: SCREEN_WIDTH * 0.8, height: 350, backgroundColor: '#3A1C4A', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FF3B7C' },
  swipeHint: { color: 'white', opacity: 0.6, position: 'absolute', bottom: 20 },
  swipeIcon: { width: 100, height: 100 },

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
  qcmText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});